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
  private grandTime = { minutes: 15, seconds: 0 };


  get data(): TimerStorageData {
    return this.uuidData as TimerStorageData;
  }

  get formattedGrandTime(): string {
    return AppUtils.totaltime(this.data);
  }

  get computedFactorValue(): { lower: number, upper: number } {
    // For small magnitude mode, values '1' and '10' for 'lower and 'upper' limits respectively with
    // range incrementing by 1's
    // For big magnitude mode, values '0' and '100' for 'lower and 'upper' limits respectively with
    // range incrementing by 10's
    const lower = this.data.factor === 1 ? 1 : 0;
    const upper = this.data.factor === 1 ? 10 : 100;
    return { lower: lower, upper: upper };
  }

  dataChanged(property: string, event: CustomEvent): void {
    const value: any = event.detail.value;

    if (property === 'seconds') {
      this.data.time = (this.grandTime.minutes * 60) + value;
    } else if (property === 'minutes') {
      this.data.time = (value * 60) + this.grandTime.seconds;
    } else if (property === 'countdown') {
      this.data.countdown = +value;
    } else if (property === 'factor') {
      this.data.factor = event.detail.checked === true ? 10 : 1;
    }
  }
}
