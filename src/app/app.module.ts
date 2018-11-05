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
    }),
    AppRoutingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [App],
  providers: [
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ThemeSettingsProvider,
    IonicStorageModule,
    AITStorage,
    Vibration,
    AITBrightness,
    Brightness,
    AITSignal,
    { provide: AudioManagement, useClass: (false) ? AudioManagement : AudioManagementMock },
    HomeDisplayService,
    MenuController,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
  ],
  bootstrap: [AppComponent]
