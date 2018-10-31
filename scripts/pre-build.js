/* 'use strict';

var env;
for (let j = 0; j < process.argv.length; j++) {
  if (process.argv[j].startsWith("--")) {
    env = process.argv[j].slice(2);
    break;
  }
}
 */
process.env.APP_ENV = "local";

console.log("process.env.APP_ENV :: " + process.env.APP_ENV);
