#!/usr/bin/env node
import * as child from 'child_process';
import * as process from 'process';
import { ExecException } from 'child_process';

const regex: RegExp = new RegExp(['^(?<exe>npm)?\\ ?(?<command>[a-z]+(?:[-][a-z]+)?)(?<=\\k<command>)\\ ?',
  '(?<pkgdetails>[a-z0-9\\>\\=\\:\\+\\#\\^\\.\\@\\-\\/]*|(?<!\\k<command>)$)?',
  '(?<options>(?:\\ [-]{1,2}[a-zA-Z]+(?:[-][a-z]+)?)*)$'].join(''));

const argument: string = process.argv.toString();
/* for (let j = 1; j < process.argv.length; j++) {
  argument += ' ' + process.argv[j];
} */

// regex.exec(argument);
/* var result = process.args.match(regex);
var statusNumber = result[1];
var statusString = result[2]; */

console.log(argument);
/* child.exec('cli_expression', (error: ExecException, stdout: string, stderr: string) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
}); */


