import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { StopwatchSettingsPage } from './stopwatch-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([])
  ],
  declarations: [StopwatchSettingsPage]
})
export class StopwatchSettingsPageModule { }
