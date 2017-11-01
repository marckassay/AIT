import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntervalDisplayPage } from './interval-display';
import { FabContainerComponentModule } from '../../app/components/fabcontainer.component/fabcontainer.component.module';

@NgModule({
  declarations: [
    IntervalDisplayPage
  ],
  imports: [
    FabContainerComponentModule,
    IonicPageModule.forChild([IntervalDisplayPage]),
  ],
  exports: [
    IntervalDisplayPage
  ]
})
export class IntervalDisplayPageModule {}
