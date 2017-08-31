import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AppComponent } from './app.component'
import { NumericDisplayPage, ProgramPage } from '../pages/pages';
import { SimpleTimer } from 'ng2-simple-timer';


@NgModule({
  declarations: [
    AppComponent,
    NumericDisplayPage,
    ProgramPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    NumericDisplayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SimpleTimer,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
