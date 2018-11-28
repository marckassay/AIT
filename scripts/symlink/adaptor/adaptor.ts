#!/usr/bin/env node

import * as child from 'child_process';
import { ExecException } from 'child_process';
import { exit } from 'process';

let argument = './node_modules/.bin/';
// prepare argv values into argument, so that regex can parse as expected
for (let j = 2; j < process.argv.length; j++) {
  argument += ' ' + process.argv[j];
}


console.log('Executing: ' + './node_modules/.bin/ionic -v');
child.exec('./node_modules/bin/ionic', (error: ExecException, stdout: string, stderr: string) => {
  if (error) {
    console.log('echo ' + error.message);
    exit(1);
  }
  console.log('echo ' + stderr);
  exit(0);
});
