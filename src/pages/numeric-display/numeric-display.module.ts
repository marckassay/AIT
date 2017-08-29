import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NumericDisplayPage } from './numeric-display';

@NgModule({
  declarations: [
    NumericDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(NumericDisplayPage),
  ],
})
export class NumericDisplayPageModule {}
