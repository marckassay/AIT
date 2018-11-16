import * as child from 'child_process';

var argument = '';
// prepare argv values into argument, so that regex can parse as expected
for (var j = 2; j < process.argv.length; j++) {
  argument += ' ' + process.argv[j];
}

console.log(process.cwd());
console.log(process.env);
console.log(argument);
