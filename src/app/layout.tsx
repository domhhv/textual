import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Ubuntu, Montserrat } from 'next/font/google';

import './globals.css';
import type { ReactNode } from 'react';

import ApiKeyProvider from '@/components/providers/api-key-provider';
import Toaster from '@/components/ui/sonner';

const ubuntu = Ubuntu({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ubuntu',
  weight: ['300', '400', '500', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  description: 'LLM-powered rich text editor',
  title: 'Rich Text Editor',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ubuntu.variable} ${montserrat.className} ${montserrat.variable} antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <ApiKeyProvider>
            <main className="bg-background h-screen">{children}</main>
            <Analytics />
            <SpeedInsights />
            <Toaster richColors duration={10_000} />
          </ApiKeyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
