'use strict';
var fs = require('fs')
var path = require('path')
var artifact = require('./build.artifact.js')

/**
 * This script file is intended to be called by node prior to any "scripts" commands. Its purpose is
 * to determine the (TypeScript) environment so that 'tsc' will be assigned the correct
 * 'config/config.XXX.ts' file. This has been created as a workaround to this issue:
 *  https://github.com/ionic-team/ionic-cli/issues/1205#issuecomment-420583034
 */
for (let j = 2; j < process.argv.length; j++) {
  if (process.argv[j].startsWith("--")) {
    artifact.ts_environment = process.argv[j].slice(2);
    break;
  }
}

var IONIC_TMP_DIR = ".tmp/";
var artifact_path = IONIC_TMP_DIR + 'build.artifact.json';

// check and resolve for IONIC_TMP_DIR existence
if (fs.existsSync(IONIC_TMP_DIR) == false) {
  fs.mkdirSync(IONIC_TMP_DIR);
}
console.log("Writing artifact file: " + artifact_path)
console.log("        artifact contents: " + JSON.stringify(artifact))
fs.writeFile(artifact_path, JSON.stringify(artifact), (err) => {
  if (err)
    console.error("The build file, './scripts/prebuild.js', failed writing artifact file!", err);
});
