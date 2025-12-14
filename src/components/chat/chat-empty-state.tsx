import { Key } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ChatEmptyStateProps = {
  isAuthenticated: boolean;
};

export default function ChatEmptyState({ isAuthenticated }: ChatEmptyStateProps) {
  return (
    <div className="scrollbar-hide flex flex-1 flex-col items-center justify-between overflow-y-auto p-6 text-center">
      <div className="flex basis-full flex-col items-center justify-center">
        {isAuthenticated ? (
          <>
            <div className="bg-muted mb-4 hidden rounded-full p-4 md:block">
              <Key className="text-muted-foreground h-8 w-8" />
            </div>

            <h3 className="mb-2 text-lg font-semibold">API Key Required</h3>

            <p className="text-muted-foreground mb-6 max-w-sm">
              To start using the AI assistant, you need to provide your API key. Your key will be encrypted and stored
              securely.
            </p>

            <Link href="/account/api-keys">
              <Button>Set API Key</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="secondary">Log in to start using the chat</Button>
            </Link>

            <p className="text-muted-foreground mt-2 max-w-sm text-xs">You&apos;ll need to have an API key set up</p>
          </>
        )}
      </div>

      <form className="mx-2 mt-4 w-full">
        <Input disabled placeholder="Add a paragraph or edit existing content..." />
      </form>
    </div>
  );
}
