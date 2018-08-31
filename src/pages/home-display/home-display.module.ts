import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeDisplayPage } from './home-display';

@NgModule({
  declarations: [
    HomeDisplayPage
  ],
  imports: [
    IonicPageModule.forChild(HomeDisplayPage),
  ],
  exports: [
    HomeDisplayPage
  ]
})
export class HomeDisplayPageModule { }
