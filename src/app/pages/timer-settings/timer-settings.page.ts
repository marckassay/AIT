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
import { Component } from '@angular/core';
import { AppUtils } from 'src/app/app.utils';
import { TimerStorageData } from 'src/app/services/storage/ait-storage.shapes';

import { SettingsPage } from '../settings-page';

@Component({
  selector: 'page-timer-settings',
  templateUrl: './timer-settings.page.html',
  styleUrls: ['./timer-settings.page.scss'],
})
export class TimerSettingsPage extends SettingsPage {
  _grandTime = { minutes: 15, seconds: 0 };

  get data(): TimerStorageData {
    return this._uuidData as TimerStorageData;
  }

  get formattedGrandTime(): string {
    if (this.data) {
      return AppUtils.totaltime(this.data);
    }
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':0';
    }
  }

  dataChanged(property: string, event: CustomEvent): void {
    const value = event.detail.value;

    if (property === 'seconds') {
      this.data.time = (this._grandTime.minutes * 60) + value;
    } else {
      this.data.time = (value * 60) + this._grandTime.seconds;
    }
  }
}
