'use client';

import { useChat } from '@ai-sdk/react';
import { User } from 'lucide-react';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import cn from '@/lib/utils/cn';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-4">
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={cn(
                'whitespace-pre-wrap',
                message.role === 'user' &&
                  'border-border flex items-start gap-2 rounded-md border p-2 shadow shadow-slate-200'
              )}
            >
              {message.role === 'user' && (
                <div className="border-border bg-foreground rounded-full border p-1">
                  <User color="white" />
                </div>
              )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div className="p-1" key={`${message.id}-${i}`}>
                        {part.text}
                      </div>
                    );
                }
              })}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <Input
          value={input}
          placeholder="Say something..."
          onChange={(e) => {
            return setInput(e.currentTarget.value);
          }}
        />
      </form>
    </div>
  );
}
