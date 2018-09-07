import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StopwatchDisplayPage } from './stopwatch-display';
import { FabContainerComponentModule } from '../../components/fab-container/fab-container.module';
import { StopwatchSettingsPageModule } from '../stopwatch-settings/stopwatch-settings.module';

@NgModule({
  declarations: [
    StopwatchDisplayPage
  ],
  imports: [
    StopwatchSettingsPageModule,
    FabContainerComponentModule,
    IonicPageModule.forChild(StopwatchDisplayPage)
  ]
})
export class StopwatchDisplayPageModule { }
