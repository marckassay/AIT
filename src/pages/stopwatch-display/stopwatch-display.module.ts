import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StopwatchDisplayPage } from './stopwatch-display';
import { StopwatchSettingsPage } from '../stopwatch-settings/stopwatch-settings';

@NgModule({
  declarations: [
    StopwatchDisplayPage, StopwatchSettingsPage
  ],
  imports: [
    IonicPageModule.forChild([StopwatchDisplayPage, StopwatchSettingsPage]),
  ],
})
export class StopwatchDisplayPageModule { }
