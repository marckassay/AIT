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
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActiverestRendererComponentModule } from 'src/app/components/activerest-renderer/activerest-renderer.module';
import { FabContainerComponentModule } from 'src/app/components/fab-container/fab-container.module';

import { DisplayPageResolverService } from '../display-page-router.service';
import { IntervalSettingsPageModule } from '../interval-settings/interval-settings.module';
import { IntervalSettingsPage } from '../interval-settings/interval-settings.page';

import { IntervalDisplayPage } from './interval-display.page';

const routes: Routes = [
  {
    path: ':id',
    component: IntervalDisplayPage,
    resolve: { subject: DisplayPageResolverService }
  }
];

@NgModule({
  entryComponents: [IntervalSettingsPage],
  imports: [
    CommonModule,
    FormsModule,
    ActiverestRendererComponentModule,
    FabContainerComponentModule,
    IntervalSettingsPageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [IntervalDisplayPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntervalDisplayPageModule { }
