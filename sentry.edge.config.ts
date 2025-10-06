import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: 'https://b6814ad132e9ed53ae1e16ef73f0ade7@o4510131109822464.ingest.de.sentry.io/4510131140231248',
  enableLogs: true,
  tracesSampleRate: 1,
  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
  ],
});
