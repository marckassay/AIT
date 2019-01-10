import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IntervalDisplayPage } from './interval-display.page';
import { IntervalSettingsPage } from '../interval-settings/interval-settings.page';
import { ActiverestRendererComponentModule } from 'src/app/components/activerest-renderer/activerest-renderer.module';
import { FabContainerComponentModule } from 'src/app/components/fab-container/fab-container.module';


/* const routes: Routes = [
  { path: 'settings', component: IntervalSettingsPage },
]; */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ActiverestRendererComponentModule,
    FabContainerComponentModule/* ,
    RouterModule.forChild(routes) */
  ],
  declarations: [IntervalDisplayPage]
  ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntervalDisplayPageModule { }
