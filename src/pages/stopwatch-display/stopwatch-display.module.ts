import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FabContainerComponentModule } from '../../app/components/fabcontainer.component/fabcontainer.component.module';
import { StopwatchDisplayPage } from './stopwatch-display';

@NgModule({
  declarations: [
    StopwatchDisplayPage
  ],
  imports: [
    FabContainerComponentModule,
    IonicPageModule.forChild([StopwatchDisplayPage]),
  ],
  exports: [
    StopwatchDisplayPage
  ]
})
export class StopwatchDisplayPageModule { }
