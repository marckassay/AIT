#!/usr/bin/env node

let argument = '';
// prepare argv values into argument, so that regex can parse as expected
for (let j = 2; j < process.argv.length; j++) {
  argument += ' ' + process.argv[j];
}

console.log('cwd: ' + process.cwd());
console.log('env: ' + process.env);
console.log('arg: ' + argument);
