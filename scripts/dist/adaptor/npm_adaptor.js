#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
// maps all npm options to yarn options
function isoMorphCollection(target, source) {
    return target.map(function (val) {
        var mappedval = source[val.trim()];
        return (mappedval) ? mappedval : val;
    });
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
// tslint:disable-next-line:no-inferrable-types
var argument = '';
// prepare argv values into argument, so that regex can parse as expected
for (var j = 2; j < process.argv.length; j++) {
    argument += ' ' + process.argv[j];
}
argument = argument.trimLeft();
var parsedArg = regex.exec(argument)['groups'];
var transformedExe = 'yarn';
var transformedCommand;
// tslint:disable-next-line:no-inferrable-types
var transformedPkgDetails = '';
var transformedOptions;
var transformedOptionsString;
if (parsedArg.pkgdetails) {
    transformedPkgDetails = parsedArg.pkgdetails;
}
if (parsedArg.options) {
    transformedOptions = isoMorphCollection(parsedArg.options.trim().split(' '), equivalenceTable);
}
switch (parsedArg.command) {
    case 'install':
        transformedCommand = 'add';
        if (transformedOptions && transformedOptions.some(function (value) { return value === '**prod'; })) {
            transformedOptions = transformedOptions.filter(function (value) { return value !== '**prod'; });
        }
        else if (transformedOptions && transformedOptions.some(function (value) { return value === '**global'; })) {
            transformedCommand = 'global add';
        }
        else if (!transformedPkgDetails) {
            transformedCommand = 'install';
        }
        break;
    default:
        transformedCommand = parsedArg.command;
}
transformedOptionsString = (transformedOptions) ? transformedOptions.join(' ') : '';
var tranformedExpression = (transformedCommand + ' ' + transformedPkgDetails + ' ' + transformedOptionsString).trimRight();
var opts = Object.assign({}, process.env);
opts.cwd = process.cwd();
opts.stdio = 'inherit';
console.log('The following npm expression has been transformed into the following yarn expression:');
console.log(argument);
console.log(transformedExe + ' ' + tranformedExpression);
console.log(transformedExe, [transformedCommand, transformedPkgDetails, transformedOptionsString].toString());
var result = child.spawnSync(transformedExe, [transformedCommand, transformedPkgDetails, transformedOptionsString], opts);
if (result.error || result.status !== 0) {
    process.exit(1);
}
else {
    process.exit(0);
}
//# sourceMappingURL=npm_adaptor.js.map