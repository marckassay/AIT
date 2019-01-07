import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'interval', loadChildren: './pages/interval-display/interval-display.module#IntervalDisplayPageModule' },
  { path: 'timer', loadChildren: './pages/timer-display/timer-display.module#TimerDisplayPageModule' },
  { path: 'stopwatch', loadChildren: './pages/stopwatch-display/stopwatch-display.module#StopwatchDisplayPageModule' },
  { path: 'timer-settings', loadChildren: './pages/timer-settings/timer-settings.module#TimerSettingsPageModule' },
  { path: 'stopwatch-settings', loadChildren: './pages/stopwatch-settings/stopwatch-settings.module#StopwatchSettingsPageModule' },
  { path: 'interval-settings', loadChildren: './pages/interval-settings/interval-settings.module#IntervalSettingsPageModule' },
  { path: 'settings', loadChildren: './pages/app-settings/app-settings.module#AppSettingsPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      enableTracing: false, // <-- debugging purposes only
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
