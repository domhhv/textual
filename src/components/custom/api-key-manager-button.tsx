'use client';

import { Key, Edit3, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { ApiKeyContext } from '@/components/providers/api-key-provider';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import cn from '@/lib/utils/cn';

interface ApiKeyManagerProps {
  onEditClick: () => void;
  className?: string;
}

export default function ApiKeyManagerButton({
  className,
  onEditClick,
}: ApiKeyManagerProps) {
  const { apiKey, hasApiKey, removeApiKey } = React.use(ApiKeyContext);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = React.useCallback(() => {
    removeApiKey();
    setShowDeleteConfirm(false);
    toast.success('API Key Deleted', {
      description: 'Your API key has been removed from local storage.',
    });
  }, [removeApiKey]);

  if (!hasApiKey || !apiKey) {
    return null;
  }

  const maskedKey = `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          title="Manage API Key"
          className={cn(
            'text-muted-foreground hover:text-foreground h-8 w-8 p-0',
            className
          )}
        >
          <Key className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={10}
        className="w-64 p-3"
      >
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium">OpenAI API Key</h4>
            <p className="text-muted-foreground mt-1 font-mono text-xs">
              {maskedKey}
            </p>
          </div>

          {!showDeleteConfirm ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={onEditClick}
              >
                <Edit3 className="mr-1 h-3 w-3" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive flex-1"
                onClick={() => {
                  return setShowDeleteConfirm(true);
                }}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs">
                Are you sure you want to delete your API key?
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    return setShowDeleteConfirm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
