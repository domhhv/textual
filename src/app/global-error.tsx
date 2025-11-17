'use client';

import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import * as React from 'react';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
