import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Insomnia } from '@ionic-native/insomnia';

import { AppComponent } from './app.component'
import { IntervalDisplayPage, IntervalSettingsPage, AppSettingsPage } from '../pages/pages';
import { FabContainerComponent } from './components/fabcontainer.component/fabcontainer.component';
import { Storage, StorageMock } from './core/Storage';
import { NativeStorage } from '@ionic-native/native-storage';
import { Vibration } from '@ionic-native/vibration';
import { HomePage } from '../pages/home/home';
import { ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { AITSignal } from './core/AITSignal';

@NgModule({
  declarations: [
    AppComponent,
    IntervalDisplayPage,
    IntervalSettingsPage,
    HomePage,
    AppSettingsPage,
    FabContainerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent, {
      menuType: 'reveal'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    IntervalDisplayPage,
    IntervalSettingsPage,
    HomePage,
    AppSettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    ThemeSettingsProvider,
    { provide: Storage, useClass: StorageMock },
    NativeStorage,
    Vibration,
    Insomnia,
    AITSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
