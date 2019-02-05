import { Component } from '@angular/core';
import { AppUtils } from 'src/app/app.utils';
import { IntervalStorageData, Limits, TimerStorageData } from 'src/app/services/storage/ait-storage.shapes';

import { SettingsPage } from '../settings-page';

@Component({
  selector: 'app-timer-settings',
  templateUrl: './timer-settings.page.html',
  styleUrls: ['./timer-settings.page.scss'],
})
export class TimerSettingsPage extends SettingsPage {
  _grandTime = { minutes: 15, seconds: 0 };

  get data(): TimerStorageData {
    return this._uuidData as TimerStorageData;
  }

  get formattedGrandTime(): string {
    /*     if (this.data) {
          //const time: Moment = moment(this.data.time * 1000);
          return //time.format('mm:ss.S');
        } */
    return '';
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
      // adjustments to seconds
      this.data.time = (this._grandTime.minutes * 60) + value;
    } else {
      this.data.time = (value * 60) + this._grandTime.seconds;
    }
  }
}
