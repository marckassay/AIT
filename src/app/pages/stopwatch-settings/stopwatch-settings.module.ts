import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StopwatchSettingsPage } from './stopwatch-settings.page';

const routes: Routes = [
  {
    path: '',
    component: StopwatchSettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StopwatchSettingsPage]
})
export class StopwatchSettingsPageModule {}
