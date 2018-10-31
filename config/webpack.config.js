var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
process.env.APP_ENV = "device"
module.exports = function () {
  useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
    "@environment": path.resolve(__dirname + '/../src/config/config.' + process.env.APP_ENV + '.ts'),
  };
  return useDefaultConfig;
};
