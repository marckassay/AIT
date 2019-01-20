import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'interval',
    loadChildren: './pages/interval-display/interval-display.module#IntervalDisplayPageModule'
  },
  {
    path: 'timer',
    loadChildren: './pages/timer-display/timer-display.module#TimerDisplayPageModule'
  },
  {
    path: 'stopwatch',
    loadChildren: './pages/stopwatch-display/stopwatch-display.module#StopwatchDisplayPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: true, // <-- debugging purposes only
      initialNavigation: false
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
