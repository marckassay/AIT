import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment as env } from './environments/environment';


if (env.production) {
  enableProdMode();
} else {
  console.clear();
  console.log('     ________      ___      _________    ');
  console.log('    |\\   __  \\    |\\  \\    |\\___   ___\\  ');
  console.log('    \\ \\  \\|\\  \\   \\ \\  \\   \\|___ \\  \\_|  ');
  console.log('     \\ \\   __  \\   \\ \\  \\       \\ \\  \\   ');
  console.log('      \\ \\  \\ \\  \\   \\ \\  \\       \\ \\  \\  ');
  console.log('       \\ \\__\\ \\__\\   \\ \\__\\       \\ \\__\\ ');
  console.log('        \\|__|\\|__|    \\|__|        \\|__| ');
  console.log('                                         ');
  console.log('The environment config for this session is not a production build. The following applies:');
  console.log('  - Cordova mocks', (env.useMocks) ? 'are being' : 'are not being', 'used. This is to ' +
    'prevent error messages from poluting the browser console.');
  console.log('  - ViewCache feature', (env.enableViewCache) ? 'is' : 'is not', 'enabled. This is ' +
    'intended to leverage Angular\'s caching feature, but hasn\'t been implemented yet.');
  console.log('');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
