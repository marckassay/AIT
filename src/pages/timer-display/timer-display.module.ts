import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FabContainerComponentModule } from '../../components/fab-container/fab-container.module';
import { TimerSettingsPageModule } from '../timer-settings/timer-settings.module';
import { TimerDisplayPage } from './timer-display';

@NgModule({
  declarations: [
    TimerDisplayPage
  ],
  imports: [
    TimerSettingsPageModule,
    FabContainerComponentModule,
    IonicPageModule.forChild(TimerDisplayPage)
  ]
})
export class TimerDisplayPageModule { }
