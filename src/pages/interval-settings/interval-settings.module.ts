import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntervalSettingsPage } from './interval-settings';

@NgModule({
  declarations: [
    IntervalSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(IntervalSettingsPage),
  ],
  exports: [
    IntervalSettingsPage
  ]
})
export class IntervalSettingsPageModule {}
