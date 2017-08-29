import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AITApp } from './app.component'
import { NumericDisplayPage, ProgramPage } from '../pages/pages';


@NgModule({
  declarations: [
    NumericDisplayPage,
    ProgramPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AITApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AITApp,
    NumericDisplayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
