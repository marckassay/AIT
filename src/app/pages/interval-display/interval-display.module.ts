import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActiverestRendererComponentModule } from 'src/app/components/activerest-renderer/activerest-renderer.module';
import { FabContainerComponentModule } from 'src/app/components/fab-container/fab-container.module';

import { DisplayPageResolverService } from '../display-page-router.service';
import { IntervalSettingsPageModule } from '../interval-settings/interval-settings.module';
import { IntervalSettingsPage } from '../interval-settings/interval-settings.page';

import { IntervalDisplayPage } from './interval-display.page';

const routes: Routes = [
  {
    path: ':id',
    component: IntervalDisplayPage,
    resolve: { subject: DisplayPageResolverService }
  }
];

@NgModule({
  entryComponents: [IntervalSettingsPage],
  imports: [
    CommonModule,
    FormsModule,
    ActiverestRendererComponentModule,
    FabContainerComponentModule,
    IntervalSettingsPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [IntervalDisplayPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntervalDisplayPageModule { }
