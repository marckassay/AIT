import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IntervalDisplayPage } from './pages/interval-display/interval-display';

const appRoutes: Routes = [
  { path: '', redirectTo: '/interval-display', pathMatch: 'full' },
  { path: '**', component: IntervalDisplayPage }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
