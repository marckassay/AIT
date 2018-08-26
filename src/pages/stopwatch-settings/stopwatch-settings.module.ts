import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StopwatchSettingsPage } from './stopwatch-settings';

@NgModule({
  declarations: [
    StopwatchSettingsPage
  ],
  imports: [
    IonicPageModule.forChild([StopwatchSettingsPage]),
  ],
})
export class StopwatchSettingsPageModule { }
