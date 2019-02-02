import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { IonicModule, IonicRouteStrategy, MenuController } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideMenuModule } from './components/side-menu/side-menu.module';
import { AudioManagementMock } from './mocks/audiomanagement.mock';
import { HomePageModule } from './pages/home/home.module';
import { HomePage } from './pages/home/home.page';
import { ScreenService } from './services/screen.service';
import { SignalService } from './services/signal.service';
import { AITStorage } from './services/storage/ait-storage.service';

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
    AITStorage,
    Brightness,
    Vibration,
    ScreenOrientation,
    SplashScreen,
    StatusBar,
    ScreenService,
    { provide: AudioManagement, useClass: AudioManagementMock },
    SignalService,
    MenuController,
    IonicStorageModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
