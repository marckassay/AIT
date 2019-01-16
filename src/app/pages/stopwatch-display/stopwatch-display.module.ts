import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { StopwatchDisplayPage } from './stopwatch-display.page';

const routes: Routes = [
  {
    path: '',
    component: StopwatchDisplayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StopwatchDisplayPage]
})
export class StopwatchDisplayPageModule { }
