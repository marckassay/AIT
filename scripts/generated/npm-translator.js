#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var process_1 = require("process");
// maps all npm options to yarn options
function isoMorphCollection(target, source) {
    return target.map(function (val) { return source[val.trim()]; });
}
var equivalenceTable = {
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
var regex = new RegExp([
    '^(?<exe>npm)?\\ ?',
    '(?<command>[a-z]+(?:[-][a-z]+)?)(?<=\\k<command>)\\ ?',
    '(?<pkgdetails>[a-z0-9\\>\\=\\:\\+\\#\\^\\.\\@\\-\\/]*|(?<!\\k<command>)$)?',
    '(?<options>(?:\\ [-]{1,2}[a-zA-Z]+(?:[-][a-z]+)?)*)$'
].join(''));
// prepare argv values into argument, so that regex can parse as expected
// tslint:disable-next-line:no-inferrable-types
var argument = '';
// let argument = 'install cordova-android@7.1.1 --production --save-exact';
for (var j = 2; j < process.argv.length; j++) {
    argument += ' ' + process.argv[j];
}
argument = argument.trimLeft();
var parsedArg = regex.exec(argument)['groups'];
var transformedOptions;
if (parsedArg.options) {
    transformedOptions = isoMorphCollection(parsedArg.options.trim().split(' '), equivalenceTable);
}
var transformedExe = 'yarn';
var transformedCommand;
switch (parsedArg.command) {
    case 'install':
        if (transformedOptions && transformedOptions.some(function (value) { return value === '**prod'; })) {
            transformedOptions = transformedOptions.filter(function (value) { return value !== '**prod'; });
            transformedCommand = 'add';
        }
        else if (transformedOptions && transformedOptions.some(function (value) { return value === '**global'; })) {
            transformedCommand = 'global add';
        }
        else if (transformedOptions && transformedOptions.some(function (value) {
            return value === '--dev' || value === '--optional' || value === '--exact';
        })) {
            transformedCommand = 'add';
        }
        else {
            transformedCommand = 'install';
        }
        break;
}
var tranformedExpression = transformedExe + ' ' + transformedCommand + ' ' + parsedArg.pkgdetails + transformedOptions.join(' ');
console.log('The following npm expression has been tranformed into the following yarn expression:');
console.log('npm ' + argument);
console.log(tranformedExpression);
child.exec(tranformedExpression, function (error, stdout, stderr) {
    if (error) {
        process_1.exit(1);
    }
    process_1.exit(0);
});
//# sourceMappingURL=npm-translator.js.map