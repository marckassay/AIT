var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

/**
 * Reads the build artifact and appends webpack's IONIC_ENV config object with correct TS config
 * type.
 */
var artifact_contents = fs.readFileSync(process.env.IONIC_TMP_DIR + '/build.artifact.json')
var artifact = JSON.parse(artifact_contents);

module.exports = function () {
  useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
    "@environment": path.resolve(process.env.IONIC_ROOT_DIR + '/config/config.' + artifact.ts_environment + '.ts'),
  };
  return useDefaultConfig;
};
