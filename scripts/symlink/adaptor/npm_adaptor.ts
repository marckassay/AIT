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
  return target.map((val) => {
    const mappedval = source[val.trim()];
    return (mappedval) ? mappedval : val;
  });
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

// tslint:disable-next-line:no-inferrable-types
let argument: string = '';

// prepare argv values into argument, so that regex can parse as expected
for (let j = 2; j < process.argv.length; j++) {
  argument += ' ' + process.argv[j];
}
argument = argument.trimLeft();
const parsedArg: RegExShape = regex.exec(argument)['groups'];

const transformedExe = 'yarn';
let transformedCommand: string;
// tslint:disable-next-line:no-inferrable-types
let transformedPkgDetails: string = '';
let transformedOptions: Array<string> | undefined;
let transformedOptionsString: string;

if (parsedArg.pkgdetails) {
  transformedPkgDetails = parsedArg.pkgdetails;
}

if (parsedArg.options) {
  transformedOptions = isoMorphCollection(parsedArg.options.trim().split(' '), equivalenceTable);
}

switch (parsedArg.command) {
  case 'install':
    transformedCommand = 'add';

    if (transformedOptions && transformedOptions.some((value) => value === '**prod')) {
      transformedOptions = transformedOptions.filter((value) => value !== '**prod');
    } else if (transformedOptions && transformedOptions.some((value) => value === '**global')) {
      transformedCommand = 'global add';
    } else if (!transformedPkgDetails) {
      transformedCommand = 'install';
    }
    break;
  default:
    transformedCommand = parsedArg.command;
}

transformedOptionsString = (transformedOptions) ? transformedOptions.join(' ') : '';
const tranformedExpression: string = (transformedCommand + ' ' + transformedPkgDetails + ' ' + transformedOptionsString).trimRight();

const opts = Object.assign({}, process.env);
opts.cwd = process.cwd();
opts.stdio = 'inherit';

console.log('The following npm expression has been transformed into the following yarn expression:');
console.log(argument);
console.log(transformedExe + ' ' + tranformedExpression);
console.log(transformedExe, [transformedCommand, transformedPkgDetails, transformedOptionsString].toString());

const result = child.spawnSync(transformedExe, [transformedCommand, transformedPkgDetails, transformedOptionsString], opts);
if (result.error || result.status !== 0) {
  process.exit(1);
} else {
  process.exit(0);
}

