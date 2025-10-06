/* eslint-disable import/namespace */

import * as Sentry from '@sentry/nextjs';

if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.warn(
    'NEXT_PUBLIC_SENTRY_DSN is not set. Skipping Sentry initialization.'
  );
} else {
  Sentry.init({
    debug: false,
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    enableLogs: true,
    integrations: [Sentry.replayIntegration()],
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    tracesSampleRate: 1,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
