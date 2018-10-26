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
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { StopwatchStorageData } from '../../providers/storage/ait-storage.interfaces';
import { AITBaseSettingsPage } from '../ait-basesettings.page';

@IonicPage()
@Component({
  selector: 'page-stopwatch-settings',
  templateUrl: 'stopwatch-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class StopwatchSettingsPage extends AITBaseSettingsPage {
  @Input('data')
  get data(): StopwatchStorageData {
    return this._uuidData as StopwatchStorageData;
  }
  set data(value: StopwatchStorageData) {
    this._uuidData = value;
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':10';
    }
  }
}
