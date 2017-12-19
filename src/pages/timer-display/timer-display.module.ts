import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerDisplayPage } from './timer-display';

@NgModule({
  declarations: [
    TimerDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(TimerDisplayPage),
  ],
})
export class TimerDisplayPageModule { }
