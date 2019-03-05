require("ts-node").register({ project: 'e2e/tsconfig.standalone.json' });
module.exports = require("./wdio.standalone.ts");