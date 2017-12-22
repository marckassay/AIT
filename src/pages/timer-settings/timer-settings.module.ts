import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerSettingsPage } from './timer-settings';

@NgModule({
  declarations: [
    TimerSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(TimerSettingsPage),
  ],
  exports: [
    TimerSettingsPage
  ]
})
export class TimerSettingsPageModule { }
