import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, MenuController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { App } from './app.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ThemeSettingsProvider } from '../providers/theme-settings.provider';
import { IonicStorageModule } from '@ionic/storage';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { Vibration } from '@ionic-native/vibration/ngx';
import { AITBrightness } from '../providers/ait-screen';
import { Brightness } from '@ionic-native/brightness/ngx';
import { AITSignal } from '../providers/ait-signal';
import { HomeDisplayPageModule } from '../pages/home-display/home-display.module';
import { HomeDisplayService } from '../providers/home-display.service';
import { AudioManagement } from '@ionic-native/audio-management';
import { AudioManagementMock } from '../providers/mocks/AudioManagementMock';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, Router } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HomeDisplayPageModule,
    IonicStorageModule.forRoot({
      name: '__aitdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot(AppComponent, {
      menuType: 'reveal'
    }),
    AppRoutingModule
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
    HomeDisplayService,
    MenuController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AudioManagement, useClass: (false) ? AudioManagement : AudioManagementMock },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})

export class AppModule {
  constructor(router: Router) {
    // Use a custom replacer to display function names in the route configs
    const replacer = (key, value) => (typeof value === 'function') ? value.name : value;

    console.log('Routes: ', JSON.stringify(router.config, replacer, 2));
  }
}


