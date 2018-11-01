var fs = require('fs');
var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

var artifacts = fs.readFileSync(process.env.IONIC_TMP_DIR + '/build.artifact.json')
var config_subtype = JSON.parse(artifacts);

module.exports = function () {
  useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
    "@environment": path.resolve(__dirname + '/config.' + config_subtype.environment + '.ts'),
  };
  return useDefaultConfig;
};
