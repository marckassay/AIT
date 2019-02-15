import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment as env } from './environments/environment';

if (env.production) {
  enableProdMode();
} else {
  console.clear();
  console.log('The environment config being used is:', env);
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
