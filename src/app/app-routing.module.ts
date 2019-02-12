/**
    AiT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { environment as env } from 'src/environments/environment';

import { AppRoutingStrategy } from './app-routing-strategy';

const routes: Routes = [
  {
    path: 'settings',
    loadChildren: './pages/app-settings/app-settings.module#AppSettingsPageModule'
  },
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
      relativeLinkResolution: 'legacy',
      enableTracing: false, // <-- debugging purposes only
      initialNavigation: false
    }
  )],
  providers: [
    { provide: RouteReuseStrategy, useClass: (env.enableViewCache === false) ? IonicRouteStrategy : AppRoutingStrategy }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
