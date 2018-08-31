import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntervalDisplayPage } from './interval-display';
import { ActiverestRendererComponentModule } from '../../components/activerest-renderer/activerest-renderer.module';
import { FabContainerComponentModule } from '../../components/fab-container/fab-container.module';

@NgModule({
  declarations: [
    IntervalDisplayPage
  ],
  imports: [
    ActiverestRendererComponentModule,
    FabContainerComponentModule,
    IonicPageModule.forChild(IntervalDisplayPage)
  ]
})
export class IntervalDisplayPageModule { }
