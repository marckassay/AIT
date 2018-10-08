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
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import * as moment from 'moment';
import { IntervalStorageData } from '../../providers/storage/ait-storage.interfaces';
import { AITBaseSettingsPage } from '../ait-basesettings.page';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html'
})
export class IntervalSettingsPage extends AITBaseSettingsPage {
  get data(): IntervalStorageData {
    return this._uuidData as IntervalStorageData;
  }
  set data(value: IntervalStorageData) {
    this._uuidData = value;
  }

  get totaltime(): string {
    if (this.data) {
      const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return moment(totaltimeInSeconds * 1000).format('mm:ss.S');
    } else {
      return '00:00.0';
    }
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':0';
    }
  }
}
