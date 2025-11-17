import { Eye, XIcon, EyeOff, CheckIcon, ExternalLink } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import HelixLoader from '@/components/ui/helix-loader';
import { Input } from '@/components/ui/input';
import OPENAI_KEY_ISSUE_MESSAGES from '@/lib/constants/openai-key-messages';
import checkOpenAIKey from '@/lib/utils/check-openai-key';
import validateApiKeyWithServer from '@/lib/utils/validate-api-key';

type ApiKeyDialogProps = {
  isOpen: boolean;
  onApiKeySet: (apiKey: string) => void;
  onOpenChange: (open: boolean) => void;
};

type FormValues = {
  apiKey: string;
};

export default function ApiKeyDialog({ isOpen, onApiKeySet, onOpenChange }: ApiKeyDialogProps) {
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [serverValidation, setServerValidation] = React.useState<{
    error?: string;
    isValid: boolean;
    tested?: boolean;
  } | null>(null);

  const form = useForm<FormValues>({
    defaultValues: { apiKey: '' },
    mode: 'onChange',
  });

  const apiKeyValue = form.watch('apiKey');
  const keyCheck = checkOpenAIKey(apiKeyValue);

  async function handleTestConnection() {
    const currentValue = form.getValues('apiKey');

    if (!currentValue.trim()) {
      return;
    }

    setIsTesting(true);
    setServerValidation(null);

    try {
      const result = await validateApiKeyWithServer(currentValue.trim());
      setServerValidation({ ...result, tested: true });

      if (result.isValid) {
        toast.success('Connection Test Successful', {
          description: 'Your API key is valid and working!',
        });
      }
    } catch (error) {
      setServerValidation({
        error: 'Failed to test connection',
        isValid: false,
        tested: true,
      });
    } finally {
      setIsTesting(false);
    }
  }

  async function onSubmit(values: FormValues) {
    const result = checkOpenAIKey(values.apiKey);

    onApiKeySet(result.normalized);
    onOpenChange(false);

    form.reset();
    setServerValidation(null);

    if (result.ok) {
      toast.success('API Key Saved', {
        description: 'Your OpenAI API key has been saved securely.',
      });
    } else {
      toast.success('API Key Saved (with warnings)', {
        description: 'Key saved, but please double-check the format.',
      });
    }
  }

  function handleSetAnyway() {
    const currentValue = form.getValues('apiKey');

    if (currentValue.trim()) {
      const result = checkOpenAIKey(currentValue);
      onApiKeySet(result.normalized);
      onOpenChange(false);
      form.reset();
      setServerValidation(null);

      toast.success('API Key Saved', {
        description: 'Key saved despite validation warnings.',
      });
    }
  }

  function handleClose() {
    onOpenChange(false);
    form.reset();
    setServerValidation(null);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Your OpenAI API Key</DialogTitle>
          <DialogDescription>
            Enter your OpenAI API key to start using the AI assistant. Your key will be encrypted and stored locally in
            your browser.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="apiKey"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="pr-10"
                          autoComplete="off"
                          placeholder="sk-..."
                          type={showApiKey ? 'text' : 'password'}
                          {...field}
                        />
                        <Button
                          size="sm"
                          type="button"
                          variant="ghost"
                          className="absolute top-0 right-0 h-full px-3"
                          onClick={() => {
                            return setShowApiKey(!showApiKey);
                          }}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {!keyCheck.ok && apiKeyValue && (
              <Alert>
                <AlertTitle>Format Issues Detected</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {keyCheck.issues.map((issue) => {
                      return <li key={issue.code}>{OPENAI_KEY_ISSUE_MESSAGES[issue.code]}</li>;
                    })}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {serverValidation && (
              <Alert
                className={
                  serverValidation.isValid
                    ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
                    : 'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300'
                }
              >
                <AlertTitle className="flex items-center gap-2">
                  {serverValidation.isValid ? (
                    <>
                      <CheckIcon size={16} /> Connection Test Successful
                    </>
                  ) : (
                    <>
                      <XIcon size={16} /> Connection Test Failed
                    </>
                  )}
                </AlertTitle>
                <AlertDescription>
                  {serverValidation.isValid ? 'Your API key is valid and working!' : serverValidation.error}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <ExternalLink className="h-4 w-4" />
              <span>
                Get your API key from{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  href="https://platform.openai.com/api-keys"
                >
                  OpenAI Platform
                </a>
              </span>
            </div>

            <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
              <div className="flex flex-1 gap-2">
                <Button type="button" variant="outline" disabled={isTesting} onClick={handleClose}>
                  Cancel
                </Button>

                {!keyCheck.ok && apiKeyValue && keyCheck.normalized !== apiKeyValue && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.setValue('apiKey', keyCheck.normalized, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    Apply Fixes
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="space-x-2"
                  onClick={handleTestConnection}
                  disabled={isTesting || !apiKeyValue.trim()}
                >
                  {isTesting && <HelixLoader size={16} color="var(--foreground)" />}
                  Test Connection
                </Button>
              </div>

              <div className="flex gap-2">
                {serverValidation && !serverValidation.isValid && serverValidation.tested ? (
                  <Button
                    type="button"
                    onClick={handleSetAnyway}
                    disabled={isTesting || !apiKeyValue.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Set Anyway
                  </Button>
                ) : (
                  <Button type="submit" disabled={isTesting || !apiKeyValue.trim()}>
                    Set API Key
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
