import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StopwatchDisplayPage } from './stopwatch-display';
import { FabContainerComponentModule } from '../../components/fab-container/fab-container.module';

@NgModule({
  declarations: [
    StopwatchDisplayPage
  ],
  imports: [
    FabContainerComponentModule,
    IonicPageModule.forChild([StopwatchDisplayPage])
  ]
})
export class StopwatchDisplayPageModule { }
