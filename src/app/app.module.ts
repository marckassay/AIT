import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, Injector, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Insomnia } from '@ionic-native/insomnia';

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
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
    InAppBrowser,
    Vibration,
    Insomnia,
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
