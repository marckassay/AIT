import { Component, Input, ViewEncapsulation } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import * as moment from 'moment';
import { TimerStorageData } from '../../app/app.component';
import { AITBaseSettingsPage } from '../AITBaseSettingsPage';
import { Moment } from 'moment';

@IonicPage()
@Component({
  selector: 'page-timer-settings',
  templateUrl: 'timer-settings.html',
  encapsulation: ViewEncapsulation.None
})
export class TimerSettingsPage extends AITBaseSettingsPage {
  grandTime: { minutes: number, seconds: number };

  @Input('data')
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
    super.ngOnInit();
    this.grandTime = { minutes: 15, seconds: 0 };
  }

  protected dataChanged(property?: string): void {
    property!;
    this.data.time = (this.grandTime.minutes * 60) + this.grandTime.seconds;
    this.storage.setItem(this.data);
    this.ngDectector.detectChanges();
  }
}
