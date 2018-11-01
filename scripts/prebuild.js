'use strict';
var fs = require('fs')
var path = require('path')

var value;
for (let j = 2; j < process.argv.length; j++) {
  if (process.argv[j].startsWith("--")) {
    value = process.argv[j].slice(2);
    break;
  }
}

var artifacts = {
  environment: value
};
var IONIC_TMP_DIR = ".tmp/";
var artifact_path = IONIC_TMP_DIR + 'build.artifact.json';

// check and resolve for IONIC_TMP_DIR existence
var dirname = path.dirname(artifact_path);
if (fs.existsSync(dirname) == false) {
  fs.mkdirSync(dirname);
}

console.log("Writing artifact file: " + artifact_path)
fs.writeFile(artifact_path, JSON.stringify(artifacts), (err) => {
  console.error("The file: ./scripts/prebuild.js, failed writing artifact file!", err);
});
