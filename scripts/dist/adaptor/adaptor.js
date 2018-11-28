#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child = require("child_process");
var path = require("path");
var ext = process.platform === 'win32' ? '.cmd' : '';
var command = path.join(process.cwd(), 'node_modules/.bin/', process.argv[2].toString() + ext);
var opts = Object.assign({}, process.env);
opts.cwd = process.cwd();
opts.stdio = 'inherit';
console.log('[adaptor.js] Executing: ' + command + ' ' + process.argv.slice(3));
var result = child.spawnSync(command, process.argv.slice(3), opts);
if (result.error || result.status !== 0) {
    process.exit(1);
}
else {
    process.exit(0);
}
//# sourceMappingURL=adaptor.js.map