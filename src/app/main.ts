import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { environment } from './environments/environment';

/* if (environment.production) {
  enableProdMode();
} */

console.log("environment.useMock : " + environment.useMock);

platformBrowserDynamic().bootstrapModule(AppModule);

/* var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

module.exports = function () {
  useDefaultConfig[process.env.IONIC_ENV].resolve.alias = {
    "@environment": path.resolve(__dirname + '/../../src/config/config.' + process.env.IONIC_ENV + '.ts'),
  };
  return useDefaultConfig;
}; */
