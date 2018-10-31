import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
//import { app_env } from '@environment';
/* if (environment.production) {
  enableProdMode();
} */

//console.log("maint.ts app_env : " + app_env);

platformBrowserDynamic().bootstrapModule(AppModule);
