#!/usr/bin/env node

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
// let argument = '';
let argument = 'install cordova-android@7.1.1 --production --save-exact';

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
    } else {
      transformedCommand = 'install';
    }
    break;
}

console.log(transformedExe + ' ' + transformedCommand + ' ' + parsedArg.pkgdetails + transformedOptions.join(' '));

/*
child.exec('cli_expression', (error: ExecException, stdout: string, stderr: string) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
*/

/*
npm install --production	                      yarn install
npm install                                     yarn install
  (N / A)	                                      yarn install --flat
  (N / A)	                                      yarn install --har
npm install --no-package-lock	                  yarn install --no-lockfile
  (N / A)	                                      yarn install --pure-lockfile

npm install [package] --save	                  yarn add [package]
npm install [package] --save-dev	              yarn add [package] --dev
  (N / A)	                                      yarn add [package] --peer
npm install [package] --save-optional	          yarn add [package] --optional
npm install [package] --save-exact	            yarn add [package] --exact
  (N / A)	                                      yarn add [package] --tilde
npm install [package] --global	                yarn global add [package]

npm update --global                             yarn global upgrade
npm rebuild	                                    yarn add --force
npm uninstall [package]	                        yarn remove[package]
npm cache clean	                                yarn cache clean [package]
rm -rf node_modules && npm install              yarn upgrade
npm version major                               yarn version --major
npm version minor                               yarn version --minor
npm version patch                               yarn version --patch
*/

