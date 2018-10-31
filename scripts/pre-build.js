'use strict';

const newLocal = 'fs';
const fs = require(newLocal);

for (let j = 0; j < process.argv.length; j++) {
  console.log(j + ' -> ' + (process.argv[j]));
}

let rawdata = fs.readFileSync('./src/local.json');
let enviro = JSON.parse(rawdata);
console.log(enviro);
var text = `//THIS FILE IS GENERATED
export let environment = {
  useMock: true
};`
fs.writeFileSync('./src/app/environments/environment.ts', text);
