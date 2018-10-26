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
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TimerStorageData } from '../../providers/storage/ait-storage.interfaces';
import { AITBaseSettingsPage } from '../ait-basesettings.page';
import * as moment from 'moment';
import { Moment } from 'moment';

@IonicPage()
@Component({
  selector: 'page-timer-settings',
  templateUrl: 'timer-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class TimerSettingsPage extends AITBaseSettingsPage implements OnInit {
  grandTime: { minutes: number, seconds: number };

  get data(): TimerStorageData {
    return this._uuidData as TimerStorageData;
  }
  set data(value: TimerStorageData) {
    this._uuidData = value;
  }

  get formattedGrandTime(): string {
    if (this.data) {
      const time: Moment = moment(this.data.time * 1000);
      return time.format('mm:ss.S');
    }
    return '';
  }

  get countdownLabel(): string {
    if (this.data) {
      return ':' + this.data.countdown;
    } else {
      return ':10';
    }
  }

  ngOnInit() {
    this.grandTime = { minutes: 15, seconds: 0 };
  }

  protected dataChanged(): void {
    this.data.time = (this.grandTime.minutes * 60) + this.grandTime.seconds;

    super.dataChanged();
  }
}
