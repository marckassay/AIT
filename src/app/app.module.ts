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
import { SideMenuModule } from './components/side-menu/side-menu.module';
import { HomePageModule } from './pages/home/home.module';
import { HomePage } from './pages/home/home.page';
import { AITBrightness } from './providers/ait-screen';
import { AITSignal } from './providers/ait-signal';
import { AITStorage } from './providers/storage/ait-storage.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [HomePage],
  imports: [
    CommonModule,
    BrowserModule,
    SideMenuModule,
    HomePageModule,
    IonicStorageModule.forRoot({
      name: '__aitdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot({
      menuType: 'reveal'
    }),
    AppRoutingModule
  ],
  providers: [
    AITSignal,
    AITStorage,
    AITBrightness,
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    Vibration,
    Brightness,
    MenuController,
    IonicStorageModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: AudioManagement, useClass: (true) ? AudioManagement : 'AudioManagementMock' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
