import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FabContainerComponentModule } from 'src/app/components/fab-container/fab-container.module';
import { XProgressBarModule } from 'src/app/components/x-progress-bar/x-progress-bar.module';

import { DisplayPageResolverService } from '../display-page-router.service';
import { StopwatchSettingsPageModule } from '../stopwatch-settings/stopwatch-settings.module';
import { StopwatchSettingsPage } from '../stopwatch-settings/stopwatch-settings.page';

import { StopwatchDisplayPage } from './stopwatch-display.page';

const routes: Routes = [
  {
    path: ':id',
    component: StopwatchDisplayPage,
    resolve: { subject: DisplayPageResolverService }
  }
];

@NgModule({
  entryComponents: [StopwatchSettingsPage],
  imports: [
    CommonModule,
    FormsModule,
    FabContainerComponentModule,
    XProgressBarModule,
    StopwatchSettingsPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [StopwatchDisplayPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StopwatchDisplayPageModule { }
