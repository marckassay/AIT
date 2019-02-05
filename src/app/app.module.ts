/**
    AiT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
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
    NativeAudio,
    ScreenOrientation,
    AndroidFullScreen,
    SplashScreen,
    ScreenService,
    { provide: AudioManagement, useClass: AudioManagement },
    SignalService,
    MenuController,
    IonicStorageModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
