import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerDisplayPage } from './timer-display';
import { TimerSettingsPage } from '../timer-settings/timer-settings';

@NgModule({
  declarations: [
    TimerDisplayPage, TimerSettingsPage
  ],
  imports: [
    IonicPageModule.forChild([TimerDisplayPage, TimerSettingsPage]),
  ],
})
export class TimerDisplayPageModule { }
