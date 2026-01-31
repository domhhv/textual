'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as Sentry from '@sentry/nextjs';
import { $getRoot, type EditorState } from 'lexical';
import { LoaderCircleIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import * as React from 'react';
import type { PropsWithChildren } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useConfirm } from '@/components/providers/confirm-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogTitle, DialogFooter, DialogHeader, DialogContent } from '@/components/ui/dialog';
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createDocument, removeDocument, updateDocument } from '@/lib/actions/document.actions';
import type { DocumentItem } from '@/lib/models/document.model';
import getErrorMessage from '@/lib/utils/get-error-message';
import $getNextEditorState from '@/lib/utils/get-next-editor-state';

type DocumentContextType = {
  activeDocument: DocumentItem | null;
  activeDropdownDocumentId: string | null;
  documentIdBeingRemoved: string | null;
  documentIdInteractedWith: string;
  hasUnsavedEditorChanges: boolean;
  isEditorEmpty: boolean;
  closeActiveDocument: () => void;
  handleDropdownOpenChange: (isOpen: boolean, documentId: string) => void;
  handleEditorChange: (editorState: EditorState) => void;
  initiateDocumentRemoval: (documentId: string) => Promise<void>;
  openDocumentDialog: () => void;
  setDocumentIdInteractedWith: (documentId: string) => void;
};

const DocumentContext = React.createContext<DocumentContextType | null>(null);

export function useDocument(): DocumentContextType {
  const context = React.useContext(DocumentContext);

  if (!context) {
    throw new Error('useDocument must be used within a DocumentProvider');
  }

  return context;
}

const documentFormSchema = z.object({
  description: z.string().max(1000, 'Description is too long').optional(),
  title: z.string().max(255, 'Title is too long').optional(),
});

type DocumentProviderProps = PropsWithChildren<{
  documents: DocumentItem[];
  isAuthenticated: boolean;
}>;

export default function DocumentProvider({ children, documents, isAuthenticated }: DocumentProviderProps) {
  const { confirm } = useConfirm();
  const [editor] = useLexicalComposerContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof documentFormSchema>>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      description: '',
      title: '',
    },
  });

  const [isSavingDocument, setIsSavingDocument] = React.useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = React.useState(false);
  const [documentIdBeingRemoved, setDocumentIdBeingRemoved] = React.useState('');
  const [activeDocument, setActiveDocument] = React.useState<DocumentItem | null>(null);
  const [activeDropdownDocumentId, setActiveDropdownDocumentId] = React.useState('');
  const [documentIdInteractedWith, setDocumentIdInteractedWith] = React.useState('');
  const [isEditorEmpty, setIsEditorEmpty] = React.useState(true);
  const [hasUnsavedEditorChanges, setHasUnsavedEditorChanges] = React.useState(false);

  React.useEffect(() => {
    setHasUnsavedEditorChanges(false);
    setIsEditorEmpty(!activeDocument);
  }, [activeDocument]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  React.useEffect(() => {
    const documentId = searchParams.get('document');

    if (!documentId) {
      return setActiveDocument(null);
    }

    const document = documents.find((doc) => {
      return doc.id === documentId;
    });

    if (!document) {
      router.replace('/');
      toast.error('The requested document does not exist or is not accessible.');

      return setActiveDocument(null);
    }

    setActiveDocument(document || null);
  }, [searchParams, documents, router]);

  const handleEditorChange = React.useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const children = JSON.parse($getNextEditorState().nextEditorRootChildren);
        const currentEditorState = JSON.stringify(editorState);
        const hasTextContent = !!$getRoot().getTextContent();
        const isEmpty = !activeDocument && !hasTextContent;
        setIsEditorEmpty(isEmpty);
        setHasUnsavedEditorChanges(
          (hasTextContent || !!activeDocument?.content) && currentEditorState !== activeDocument?.content
        );

        console.info('Editor State Updated: ', {
          children,
          currentEditorState,
          editorState,
          textContent: $getRoot().getTextContent(),
        });
      });
    },
    [activeDocument]
  );

  const openDocumentDialog = React.useCallback(() => {
    setTimeout(() => {
      setDocumentIdInteractedWith(documentIdInteractedWith);
    });
    posthog.capture(documentIdInteractedWith ? 'open_document_details_dialog' : 'open_new_document_dialog');
    setIsDocumentDialogOpen(true);

    if (!documentIdInteractedWith) {
      form.setValue('title', '');
      form.setValue('description', '');
    } else {
      const document = documents.find((doc) => {
        return doc.id === documentIdInteractedWith;
      });

      if (document) {
        form.setValue('title', document.title || '');
        form.setValue('description', document.description || '');
      }
    }
  }, [documentIdInteractedWith, form, documents]);

  async function onDocumentFormSubmit(values: z.infer<typeof documentFormSchema>) {
    try {
      setIsSavingDocument(true);

      if (documentIdInteractedWith) {
        await updateDocument(documentIdInteractedWith, values);
        posthog.capture('document_updated', {
          documentId: documentIdInteractedWith,
        });
      } else {
        await editor.read(async () => {
          const hasTextContent = !activeDocument && !!$getRoot().getTextContent();
          const { id } = await createDocument({
            ...values,
            content: hasTextContent ? JSON.stringify(editor.getEditorState()) : null,
          });
          posthog.capture('document_created', {
            documentId: id,
          });
          router.replace(`/?document=${id}`);
        });
      }

      toast.success(`Document ${documentIdInteractedWith ? 'updated' : 'created'} successfully`);
      setIsDocumentDialogOpen(false);
      setTimeout(() => {
        setDocumentIdInteractedWith('');
        form.reset();
      });
    } catch (error) {
      Sentry.captureException(error);
      console.error(`Error ${documentIdInteractedWith ? 'updating' : 'creating'} document: `, error);
      toast.error(`Error ${documentIdInteractedWith ? 'updating' : 'creating'} document`, {
        description: getErrorMessage(error),
      });
    } finally {
      setIsSavingDocument(false);
    }
  }

  function handleDocumentDialogOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.setValue('title', '');
      form.setValue('description', '');
      setDocumentIdInteractedWith('');
    }

    setIsDocumentDialogOpen(isOpen);
  }

  const handleDropdownOpenChange = React.useCallback((isOpen: boolean, documentId: string) => {
    if (isOpen) {
      setDocumentIdInteractedWith(documentId);

      return setActiveDropdownDocumentId(documentId);
    }

    setActiveDropdownDocumentId('');
    setDocumentIdInteractedWith('');
  }, []);

  const closeActiveDocument = React.useCallback(() => {
    setActiveDocument(null);
    setIsEditorEmpty(true);
    void router.replace('/');
  }, [router]);

  const initiateDocumentRemoval = React.useCallback(
    async (documentId: string) => {
      setTimeout(() => {
        setDocumentIdInteractedWith(documentId);
      });

      const confirmed = await confirm({
        cancelText: 'Cancel',
        confirmText: 'Remove',
        description: 'Are you sure you want to remove this document? This action cannot be undone.',
        title: 'Remove Document',
        variant: 'destructive',
      });

      if (!confirmed) {
        setDocumentIdInteractedWith('');

        return;
      }

      setActiveDropdownDocumentId('');
      setDocumentIdBeingRemoved(documentId);

      try {
        if (activeDocument?.id === documentId) {
          closeActiveDocument();
        }

        await removeDocument(documentId);
        posthog.capture('document_removed', { documentId });
        toast.success('Document removed successfully');

        if (documentIdInteractedWith === documentId) {
          setDocumentIdInteractedWith('');
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error removing document: ', error);
        toast.error('Error removing document', {
          description: getErrorMessage(error),
        });
      } finally {
        setDocumentIdBeingRemoved('');
      }
    },
    [confirm, activeDocument?.id, closeActiveDocument, documentIdInteractedWith]
  );

  const value = React.useMemo(() => {
    return {
      activeDocument,
      activeDropdownDocumentId,
      closeActiveDocument,
      documentIdBeingRemoved,
      documentIdInteractedWith,
      handleDropdownOpenChange,
      handleEditorChange,
      hasUnsavedEditorChanges,
      initiateDocumentRemoval,
      isEditorEmpty,
      openDocumentDialog,
      setDocumentIdInteractedWith,
    };
  }, [
    closeActiveDocument,
    documentIdInteractedWith,
    openDocumentDialog,
    handleDropdownOpenChange,
    activeDropdownDocumentId,
    documentIdBeingRemoved,
    initiateDocumentRemoval,
    activeDocument,
    handleEditorChange,
    isEditorEmpty,
    hasUnsavedEditorChanges,
  ]);

  return (
    <DocumentContext.Provider value={value}>
      {children}

      <Dialog open={isDocumentDialogOpen} onOpenChange={handleDocumentDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onDocumentFormSubmit)}>
              <DialogHeader>
                <DialogTitle>{documentIdInteractedWith ? 'Edit Document Details' : 'Start a New Document'}</DialogTitle>
              </DialogHeader>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Untitled" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSavingDocument}>
                  {isSavingDocument && <LoaderCircleIcon className="mr-2 animate-spin" />}
                  {documentIdInteractedWith ? 'Save Changes' : 'Create Document'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DocumentContext.Provider>
  );
}
