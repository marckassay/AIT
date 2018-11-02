import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import { APP_ENV } from '@environment';

if (APP_ENV.useMock === false) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
