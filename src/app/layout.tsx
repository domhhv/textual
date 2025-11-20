import { ClerkProvider } from '@clerk/nextjs';
import { shadcn } from '@clerk/themes';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import { Ubuntu, Montserrat } from 'next/font/google';

import './globals.css';
import type { PropsWithChildren } from 'react';

import ApiKeyProvider from '@/components/providers/api-key-provider';
import ConfirmProvider from '@/components/providers/confirm-provider';
import Toaster from '@/components/ui/sonner';

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  width: 'device-width',
};

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
  title: 'Rich Textual Editor',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <ClerkProvider appearance={{ theme: shadcn }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${ubuntu.variable} ${montserrat.className} ${montserrat.variable} antialiased`}>
          <ThemeProvider enableSystem attribute="class" defaultTheme="system" disableTransitionOnChange>
            <ConfirmProvider>
              <ApiKeyProvider>
                <main className="bg-background h-dvh">{children}</main>
                <Analytics />
                <SpeedInsights />
                <Toaster richColors closeButton duration={10_000} />
              </ApiKeyProvider>
            </ConfirmProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
