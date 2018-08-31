import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { App } from './app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { IonicStorageModule } from '@ionic/storage';
import { AITStorage } from './core/AITStorage';
import { Vibration } from '@ionic-native/vibration';
import { AITBrightness } from './core/AITBrightness';
import { Brightness } from '@ionic-native/brightness';
import { AITSignal } from './core/AITSignal';
import { BrowserModule } from '@angular/platform-browser';
import { HomeDisplayPageModule } from '../pages/home-display/home-display.module';

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    HomeDisplayPageModule,
    IonicStorageModule.forRoot({
      name: '__aitdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot(App, {
      menuType: 'reveal'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [App],
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
export class AppModule { }
