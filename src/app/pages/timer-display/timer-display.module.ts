import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FabContainerComponentModule } from 'src/app/components/fab-container/fab-container.module';

import { DisplayPageResolverService } from '../display-page-router.service';
import { TimerSettingsPageModule } from '../timer-settings/timer-settings.module';
import { TimerSettingsPage } from '../timer-settings/timer-settings.page';

import { TimerDisplayPage } from './timer-display.page';

const routes: Routes = [
  {
    path: ':id',
    component: TimerDisplayPage,
    resolve: { subject: DisplayPageResolverService }
  }
];

@NgModule({
  entryComponents: [TimerSettingsPage],
  imports: [
    CommonModule,
    FormsModule,
    FabContainerComponentModule,
    TimerSettingsPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [TimerDisplayPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TimerDisplayPageModule { }
