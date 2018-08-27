import { ErrorHandler, NgModule, Injector } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AppComponent } from './app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { IonicStorageModule } from '@ionic/storage';
import { AITStorage } from './core/AITStorage';
import { Vibration } from '@ionic-native/vibration';
import { AITBrightness } from './core/AITBrightness';
import { Brightness } from '@ionic-native/brightness';
import { AITSignal } from './core/AITSignal';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    IonicModule.forRoot(AppComponent, {
      menuType: 'reveal'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [AppComponent],
  providers: [
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    ThemeSettingsProvider,
    IonicStorageModule,
    AITStorage,
    Vibration,
    AITBrightness,
    Brightness,
    AITSignal,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
/**
 * Pattern came from: stackoverflow.com/questions/33970645
 */
export class ServiceLocator {
  static injector: Injector;
}
