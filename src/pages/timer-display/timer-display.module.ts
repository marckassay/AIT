import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimerDisplayPage } from './timer-display';
import { FabContainerComponentModule } from '../../app/components/fabcontainer.component/fabcontainer.component.module';

@NgModule({
  declarations: [
    TimerDisplayPage
  ],
  imports: [
    FabContainerComponentModule,
    IonicPageModule.forChild([TimerDisplayPage]),
  ],
  exports: [
    TimerDisplayPage
  ]
})
export class TimerDisplayPageModule { }
