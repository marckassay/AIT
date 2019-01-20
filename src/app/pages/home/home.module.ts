import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';

/* const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
]; */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([])
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
