import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntervalDisplayPage } from './interval-display';

@NgModule({
  declarations: [
    IntervalDisplayPage
  ],
  imports: [
    IonicPageModule.forChild([IntervalDisplayPage]),
  ],
})
export class NumericDisplayPageModule {}
