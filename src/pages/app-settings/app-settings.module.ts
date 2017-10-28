import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppSettingsPage } from './app-settings';

@NgModule({
  declarations: [
    AppSettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(AppSettingsPage),
  ],
})
export class AppSettingsPageModule {}
