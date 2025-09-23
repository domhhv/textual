/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

const config = {
  '*.{md,js,ts,tsx}': ['npm run eslint:check', 'npm run prettier:check'],
  '*.{ts,tsx}': () => {
    return 'npm run typecheck';
  },
  '**/package.json': [
    'npm run sort-package-json:check',
    'npm run prettier:check',
  ],
};

export default config;
