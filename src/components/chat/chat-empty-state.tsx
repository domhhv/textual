'use client';

import { Key } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';

interface ChatEmptyStateProps {
  onSetApiKey: () => void;
}

export function ChatEmptyState({ onSetApiKey }: ChatEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center p-6 text-center md:justify-center">
      <div className="bg-muted mb-4 rounded-full p-4">
        <Key className="text-muted-foreground h-8 w-8" />
      </div>

      <h3 className="mb-2 text-lg font-semibold">API Key Required</h3>

      <p className="text-muted-foreground mb-6 max-w-sm">
        To start using the AI assistant, you need to provide your OpenAI API
        key. Your key will be encrypted and stored securely in your browser.
      </p>

      <Button size="lg" onClick={onSetApiKey}>
        <Key className="mr-2 h-4 w-4" />
        Set OpenAI API Key
      </Button>

      <p className="text-muted-foreground mt-4 text-xs">
        Don&apos;t have an API key?{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          href="https://platform.openai.com/signup"
        >
          Sign up at OpenAI Platform
        </a>
      </p>
    </div>
  );
}
