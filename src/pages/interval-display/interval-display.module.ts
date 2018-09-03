import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntervalDisplayPage } from './interval-display';
import { ActiverestRendererComponentModule } from '../../components/activerest-renderer/activerest-renderer.module';
import { FabContainerComponentModule } from '../../components/fab-container/fab-container.module';
import { IntervalSettingsPage } from '../interval-settings/interval-settings';
import { IntervalSettingsPageModule } from '../interval-settings/interval-settings.module';

@NgModule({
  declarations: [
    IntervalDisplayPage
  ],
  imports: [
    ActiverestRendererComponentModule,
    FabContainerComponentModule,
    IonicPageModule.forChild(IntervalDisplayPage)
  ],
  entryComponents: [
    IntervalSettingsPage
  ],
  exports: [
    IntervalSettingsPageModule
  ]
})
export class IntervalDisplayPageModule { }
