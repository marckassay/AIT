require("ts-node").register({ project: 'e2e/appium/tsconfig.standalone.json' });
module.exports = require("./wdio.standalone.ts");