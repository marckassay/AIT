import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ActiverestRendererComponentModule } from 'src/app/components/activerest-renderer/activerest-renderer.module';
import { FabContainerComponentModule } from 'src/app/components/fab-container/fab-container.module';

import { IntervalDisplayPage } from './interval-display.page';


const routes: Routes = [
  {
    path: '',
    component: IntervalDisplayPage
  },
  {
    path: 'interval-settings',
    loadChildren: '../interval-settings/interval-settings.module#IntervalSettingsPageModule'
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ActiverestRendererComponentModule,
    FabContainerComponentModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [IntervalDisplayPage]
  ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntervalDisplayPageModule { }
