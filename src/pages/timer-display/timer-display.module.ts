import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerDisplayPage } from './timer-display';
import { FabContainerComponentModule } from '../../components/fab-container/fab-container.module';

@NgModule({
  declarations: [
    TimerDisplayPage
  ],
  imports: [
    FabContainerComponentModule,
    IonicPageModule.forChild([TimerDisplayPage])
  ]
})
export class TimerDisplayPageModule { }
