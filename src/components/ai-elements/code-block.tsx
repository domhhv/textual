'use client';

import { CopyIcon, CheckIcon } from 'lucide-react';
import * as React from 'react';
import type { ComponentProps, HTMLAttributes } from 'react';
import { codeToHtml, type BundledLanguage, type ShikiTransformer } from 'shiki';

import { Button } from '@/components/ui/button';
import cn from '@/lib/utils/cn';

type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: BundledLanguage;
  showLineNumbers?: boolean;
};

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = React.createContext<CodeBlockContextType>({
  code: '',
});

const lineNumberTransformer: ShikiTransformer = {
  name: 'line-numbers',
  line(node, line) {
    node.children.unshift({
      children: [{ type: 'text', value: String(line) }],
      tagName: 'span',
      type: 'element',
      properties: {
        className: ['inline-block', 'min-w-10', 'mr-4', 'text-right', 'select-none', 'text-muted-foreground'],
      },
    });
  },
};

export async function highlightCode(code: string, language: BundledLanguage, showLineNumbers = false) {
  const transformers: ShikiTransformer[] = showLineNumbers ? [lineNumberTransformer] : [];

  return await Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: 'one-light',
      transformers,
    }),
    codeToHtml(code, {
      lang: language,
      theme: 'one-dark-pro',
      transformers,
    }),
  ]);
}

export function CodeBlock({ children, className, code, language, showLineNumbers = false, ...props }: CodeBlockProps) {
  const [html, setHtml] = React.useState<string>('');
  const [darkHtml, setDarkHtml] = React.useState<string>('');
  const mounted = React.useRef(false);

  React.useEffect(() => {
    highlightCode(code, language, showLineNumbers).then(([light, dark]) => {
      if (!mounted.current) {
        setHtml(light);
        setDarkHtml(dark);
        mounted.current = true;
      }
    });

    return () => {
      mounted.current = false;
    };
  }, [code, language, showLineNumbers]);

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn(
          'group bg-background text-foreground relative w-full overflow-hidden rounded-md border',
          className
        )}
        {...props}
      >
        <div className="relative">
          <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="[&>pre]:bg-background! [&>pre]:text-foreground! overflow-hidden dark:hidden [&_code]:font-mono [&_code]:text-sm [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-sm"
          />
          <div
            dangerouslySetInnerHTML={{ __html: darkHtml }}
            className="[&>pre]:bg-background! [&>pre]:text-foreground! hidden overflow-hidden dark:block [&_code]:font-mono [&_code]:text-sm [&>pre]:m-0 [&>pre]:overflow-x-auto [&>pre]:p-4 [&>pre]:text-sm"
          />
          {children && <div className="absolute top-2 right-2 flex items-center gap-2">{children}</div>}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
}

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  timeout?: number;
  onCopy?: () => void;
  onError?: (error: Error) => void;
};

export function CodeBlockCopyButton({
  children,
  className,
  onCopy,
  onError,
  timeout = 2000,
  ...props
}: CodeBlockCopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);
  const { code } = React.useContext(CodeBlockContext);

  async function copyToClipboard() {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      onError?.(new Error('Clipboard API not available'));

      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => {
        return setIsCopied(false);
      }, timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  }

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button size="icon" variant="ghost" onClick={copyToClipboard} className={cn('shrink-0', className)} {...props}>
      {children ?? <Icon size={14} />}
    </Button>
  );
}
