#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var process_1 = require("process");
var argument = './node_modules/.bin/';
// prepare argv values into argument, so that regex can parse as expected
for (var j = 2; j < process.argv.length; j++) {
    argument += ' ' + process.argv[j];
}
console.log('Executing: ' + './node_modules/.bin/ionic -v');
child.exec('./node_modules/bin/ionic', function (error, stdout, stderr) {
    if (error) {
        console.log('echo ' + error.message);
        process_1.exit(1);
    }
    console.log('echo ' + stderr);
    process_1.exit(0);
});
//# sourceMappingURL=adaptor.js.map