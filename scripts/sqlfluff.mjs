#!/usr/bin/env node

import { execSync } from 'child_process';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

const args = process.argv.slice(2);

const command = `docker run --rm -v "${projectRoot}:/sql" sqlfluff/sqlfluff ${args.join(' ')}`;

try {
  execSync(command, {
    shell: true,
    stdio: 'inherit',
  });
} catch (error) {
  process.exit(error.status || 1);
}
