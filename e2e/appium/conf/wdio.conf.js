require("ts-node").register({ project: 'e2e/appium/tsconfig.wdio.json' });
module.exports = require("./wdio.conf.ts");