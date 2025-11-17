import { auth } from '@clerk/nextjs/server';
import camelcaseKeys from 'camelcase-keys';

import Chat from '@/components/chat/chat';
import Editor from '@/components/editor/editor';
import AdaptiveLayout from '@/components/layout/adaptive-layout';
import Sidebar from '@/components/layout/sidebar';
import ChatStatusProvider from '@/components/providers/chat-status-provider';
import DocumentProvider from '@/components/providers/document-provider';
import EditorToolbarStateProvider from '@/components/providers/editor-toolbar-state-provider';
import LexicalComposerProvider from '@/components/providers/lexical-composer-provider';
import MobileLayoutProvider from '@/components/providers/mobile-layout-provider';
import SidebarProvider from '@/components/providers/sidebar-provider';
import createClerkSupabaseSsrClient from '@/lib/utils/create-clerk-supabase-ssr-client';

export default async function Home() {
  const { isAuthenticated } = await auth();
  const client = await createClerkSupabaseSsrClient();

  const { data } = await client.from('documents').select('*').order('created_at', { ascending: false });

  const documents = camelcaseKeys(data || []);

  return (
    <LexicalComposerProvider>
      <SidebarProvider>
        <DocumentProvider documents={documents}>
          <div className="flex h-dvh">
            <Sidebar documents={documents} isAuthenticated={isAuthenticated} />
            <div className="flex-1 overflow-hidden">
              <ChatStatusProvider>
                <EditorToolbarStateProvider>
                  <MobileLayoutProvider>
                    <AdaptiveLayout chat={<Chat />} editor={<Editor />} />
                  </MobileLayoutProvider>
                </EditorToolbarStateProvider>
              </ChatStatusProvider>
            </div>
          </div>
        </DocumentProvider>
      </SidebarProvider>
    </LexicalComposerProvider>
  );
}
