#!/usr/bin/env node
import * as child from 'child_process';
import { ExecException } from 'child_process';
import { exit } from 'process';

interface RegExShape {
  exe?: string;
  command: string;
  pkgdetails: string;
  options: string;
}

// maps all npm options to yarn options
function isoMorphCollection(target: string[], source: {}): string[] {
  return target.map((val) => source[val.trim()]);
}

const equivalenceTable = {
  '--no-package-lock': '--no-lockfile',
  '--production': '',
  '--save': '**prod',
  '--save-prod': '**prod',
  '-P': '**prod',
  '--save-dev': '--dev',
  '-D': '--dev',
  '--save-optional': '--optional',
  '-O': '--optional',
  '--save-exact': '--exact',
  '-E': '--exact',
  '--global': '**global'
};

const regex = new RegExp([
  '^(?<exe>npm)?\\ ?',
  '(?<command>[a-z]+(?:[-][a-z]+)?)(?<=\\k<command>)\\ ?',
  '(?<pkgdetails>[a-z0-9\\>\\=\\:\\+\\#\\^\\.\\@\\-\\/]*|(?<!\\k<command>)$)?',
  '(?<options>(?:\\ [-]{1,2}[a-zA-Z]+(?:[-][a-z]+)?)*)$'
].join(''));

// prepare argv values into argument, so that regex can parse as expected
// tslint:disable-next-line:no-inferrable-types
let argument: string = '';
// let argument = 'install cordova-android@7.1.1 --production --save-exact';

for (let j = 2; j < process.argv.length; j++) {
  argument += ' ' + process.argv[j];
}
argument = argument.trimLeft();

const parsedArg: RegExShape = regex.exec(argument)['groups'];
let transformedOptions: Array<string> | undefined;
if (parsedArg.options) {
  transformedOptions = isoMorphCollection(parsedArg.options.trim().split(' '), equivalenceTable);
}

const transformedExe = 'yarn';

let transformedCommand: string;
switch (parsedArg.command) {
  case 'install':
    if (transformedOptions && transformedOptions.some((value) => value === '**prod')) {
      transformedOptions = transformedOptions.filter((value) => value !== '**prod');
      transformedCommand = 'add';
    } else if (transformedOptions && transformedOptions.some((value) => value === '**global')) {
      transformedCommand = 'global add';
    } else if (transformedOptions && transformedOptions.some((value) =>
      value === '--dev' || value === '--optional' || value === '--exact')) {
      transformedCommand = 'add';
    } else {
      transformedCommand = 'install';
    }
    break;
}
const tranformedExpression: string = transformedExe + ' ' + transformedCommand + ' ' + parsedArg.pkgdetails + transformedOptions.join(' ');

console.log('The following npm expression has been tranformed into the following yarn expression:');
console.log('npm ' + argument);
console.log(tranformedExpression);

child.exec(tranformedExpression, (error: ExecException, stdout: string, stderr: string) => {
  if (error) {
    exit(1);
  }
  exit(0);
});
