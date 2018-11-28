#!/usr/bin/env node

import * as child from 'child_process';
import * as path from 'path';

const ext = process.platform === 'win32' ? '.cmd' : '';
const command = path.join(process.cwd(), 'node_modules/.bin/', process.argv[2].toString() + ext);

const opts = Object.assign({}, process.env);
opts.cwd = process.cwd();
opts.stdio = 'inherit';

console.log('[adaptor.js] Executing: ' + command + ' ' + process.argv.slice(3));

const result = child.spawnSync(command, process.argv.slice(3), opts);
if (result.error || result.status !== 0) {
  process.exit(1);
} else {
  process.exit(0);
}
