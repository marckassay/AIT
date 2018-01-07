/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

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
import { IonicPageModule } from 'ionic-angular';
import { IntervalDisplayPage } from './interval-display';
import { FabContainerComponentModule } from '../../app/components/fabcontainer.component/fabcontainer.component.module';

@NgModule({
  declarations: [
    IntervalDisplayPage
  ],
  imports: [
    FabContainerComponentModule,
    IonicPageModule.forChild([IntervalDisplayPage]),
  ],
  exports: [
    IntervalDisplayPage
  ]
})
export class IntervalDisplayPageModule {}
