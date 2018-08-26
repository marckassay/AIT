import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeDisplayPage } from './home-display';

@NgModule({
  declarations: [
    HomeDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeDisplayPage),
  ],
})
export class HomeDisplayPageModule {}
