#!/usr/bin/env node
var argument = '';
// prepare argv values into argument, so that regex can parse as expected
for (var j = 2; j < process.argv.length; j++) {
    argument += ' ' + process.argv[j];
}
console.log('cwd: ' + process.cwd());
console.log('env: ' + process.env);
console.log('arg: ' + argument);
//# sourceMappingURL=adaptor.js.map