import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Insomnia } from '@ionic-native/insomnia';

import { ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { AppComponent } from './app.component';
import { FabContainerComponent } from './components/fabcontainer.component/fabcontainer.component';
import { AITStorage } from './core/AITStorage';
import { IonicStorageModule } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
import { HomePage, IntervalDisplayPage, IntervalSettingsPage, TimerDisplayPage, TimerSettingsPage } from '../pages/pages';
import { AITSignal } from './core/AITSignal';
import { HomePageModule } from '../pages/home/home.module';
import { IntervalDisplayPageModule } from '../pages/interval-display/interval-display.module';
import { IntervalSettingsPageModule } from '../pages/interval-settings/interval-settings.module';
import { FabContainerComponentModule } from './components/fabcontainer.component/fabcontainer.component.module';
import { TimerDisplayPageModule } from '../pages/timer-display/timer-display.module';
import { TimerSettingsPageModule } from '../pages/timer-settings/timer-settings.module';
import { StopwatchDisplayPage } from '../pages/stopwatch-display/stopwatch-display';
import { StopwatchDisplayPageModule } from '../pages/stopwatch-display/stopwatch-display.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    IntervalDisplayPageModule,
    IntervalSettingsPageModule,
    TimerDisplayPageModule,
    TimerSettingsPageModule,
    StopwatchDisplayPageModule,
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
    FabContainerComponent,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    ThemeSettingsProvider,
    IonicStorageModule,
    AITStorage,
    Vibration,
    Insomnia,
    AITSignal,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
