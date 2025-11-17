'use client';

import type { ReactNode, PropsWithChildren } from 'react';
import React from 'react';

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';

export interface ConfirmOptions {
  title?: string;
  description?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

type ConfirmContextType = {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = React.createContext<ConfirmContextType | null>(null);

interface ConfirmState extends ConfirmOptions {
  open: boolean;
}

export default function ConfirmProvider({ children }: PropsWithChildren) {
  const [state, setState] = React.useState<ConfirmState>({
    cancelText: undefined,
    confirmText: undefined,
    description: undefined,
    open: false,
    title: undefined,
    variant: undefined,
  });

  const resolveRef = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = React.useCallback((options: ConfirmOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({
        cancelText: options.cancelText,
        confirmText: options.confirmText,
        description: options.description,
        open: true,
        title: options.title,
        variant: options.variant,
      });
    });
  }, []);

  const handleConfirm = React.useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }

    setState((prev) => {
      return { ...prev, open: false };
    });
  }, []);

  const handleCancel = React.useCallback(() => {
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }

    setState((prev) => {
      return { ...prev, open: false };
    });
  }, []);

  const handleOpenChange = React.useCallback((open: boolean) => {
    setState((prev) => {
      return { ...prev, open };
    });

    if (!open && resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog open={state.open} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="border-0">
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title || 'Are you sure?'}</AlertDialogTitle>
            <AlertDialogDescription>{state.description || 'This action cannot be undone.'}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{state.cancelText || 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className={
                (state.variant || 'destructive') === 'destructive'
                  ? 'hover:bg-destructive/90 bg-red-500 text-white'
                  : ''
              }
            >
              {state.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextType {
  const context = React.useContext(ConfirmContext);

  if (context === null) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  return context;
}
