import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy, MenuController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemsModule } from './items/items.module';
import { AITBrightness } from './providers/ait-screen';
import { AITSignal } from './providers/ait-signal';
import { HomeDisplayService } from './providers/home-display.service';
// import { AudioManagementMock } from './providers/mocks/AudioManagementMock';
import { AITStorage } from './providers/storage/ait-storage.service';
import { ThemeSettingsProvider } from './providers/theme-settings.provider';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    IonicStorageModule.forRoot({
      name: '__aitdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot(),
    ItemsModule,
    AppRoutingModule
  ],
  providers: [
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    ThemeSettingsProvider,
    IonicStorageModule,
    AITStorage,
    Vibration,
    AITBrightness,
    AudioManagement,
    Brightness,
    AITSignal,
    HomeDisplayService,
    MenuController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AudioManagement, useClass: (true) ? AudioManagement : 'AudioManagementMock' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
