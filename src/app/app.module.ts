import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { App } from './app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ThemeSettingsProvider } from '../providers/theme-settings.provider';
import { IonicStorageModule } from '@ionic/storage';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { Vibration } from '@ionic-native/vibration';
import { AITBrightness } from '../providers/ait-screen';
import { Brightness } from '@ionic-native/brightness';
import { AITSignal } from '../providers/ait-signal';
import { BrowserModule } from '@angular/platform-browser';
import { HomeDisplayPageModule } from '../pages/home-display/home-display.module';
import { HomeDisplayService } from '../providers/home-display.service';
import { AudioManagement } from '@ionic-native/audio-management';
import { AudioManagementMock } from '../providers/mocks/AudioManagementMock';
import { environment } from './environments/environment';

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
    { provide: AudioManagement, useClass: (environment.useMock) ? AudioManagement : AudioManagementMock },
    HomeDisplayService,
    MenuController,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
