/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

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
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Insomnia } from '@ionic-native/insomnia';
import { AITBrightness } from './core/AITBrightness';
import { HomeDisplayPageModule } from '../pages/home-display/home-display.module';
import { ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { FabContainerComponent } from './components/fabcontainer.component/fabcontainer.component';
import { AITStorage } from './core/AITStorage';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { HomeDisplayPage, IntervalDisplayPage, IntervalSettingsPage, StopwatchSettingsPage, TimerDisplayPage, TimerSettingsPage } from '../pages/pages';
import { AITSignal } from './core/AITSignal';
import { AppComponent } from './app.component';
import { IntervalDisplayPageModule } from '../pages/interval-display/interval-display.module';
import { IntervalSettingsPageModule } from '../pages/interval-settings/interval-settings.module';
import { FabContainerComponentModule } from './components/fabcontainer.component/fabcontainer.component.module';
import { TimerDisplayPageModule } from '../pages/timer-display/timer-display.module';
import { TimerSettingsPageModule } from '../pages/timer-settings/timer-settings.module';
import { StopwatchDisplayPage } from '../pages/stopwatch-display/stopwatch-display';
import { StopwatchDisplayPageModule } from '../pages/stopwatch-display/stopwatch-display.module';
import { StopwatchSettingsPageModule } from '../pages/stopwatch-settings/stopwatch-settings.module';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ActiveRestRendererComponentModule } from './components/activerestrenderer.component/activerestrenderer.component.module';
import { ActiveRestRendererComponent } from './components/activerestrenderer.component/activerestrenderer.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HomeDisplayPageModule,
    IntervalDisplayPageModule,
    IntervalSettingsPageModule,
    TimerDisplayPageModule,
    TimerSettingsPageModule,
    StopwatchDisplayPageModule,
    StopwatchSettingsPageModule,
    ActiveRestRendererComponentModule,
    FabContainerComponentModule,
    IonicStorageModule.forRoot({
      name: '__aitdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicModule.forRoot(AppComponent, {
      menuType: 'reveal'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    IntervalDisplayPage,
    IntervalSettingsPage,
    TimerDisplayPage,
    TimerSettingsPage,
    StopwatchDisplayPage,
    StopwatchSettingsPage,
    ActiveRestRendererComponent,
    FabContainerComponent,
    HomeDisplayPage
  ],
  providers: [
    ScreenOrientation,
    StatusBar,
    SplashScreen,
    ThemeSettingsProvider,
    IonicStorageModule,
    AITStorage,
    Vibration,
    Insomnia,
    AITBrightness,
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
