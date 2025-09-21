/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

const config = {
  '*.{md,js,ts,tsx}': ['npm run eslint:check', 'npm run prettier:check'],
  '*.{ts,tsx}': () => {
    return 'npm run typecheck';
  },
};

export default config;
