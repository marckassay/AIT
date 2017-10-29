import { Component, ViewEncapsulation } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import * as app from '../../app/app.component';
import { Storage } from '../../app/core/Storage';
import { IntervalStorageData } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html',
  encapsulation: ViewEncapsulation.None,
})
export class IntervalSettingsPage {
  constructor(public storage: Storage) { }

  ionViewWillEnter() {
    console.log("ionViewWillEnter")
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad")
  }

  ionViewWillLeave() {
    console.log("ionViewWillLeave")
    this.storage.setItem(this.data);
  }

  initialize(uuid: string): void {
    this.storage.getItem(uuid).then((value) => {
      this.data = <IntervalStorageData>value;
    });
  }

  get totaltime(): string {
    if (this.data) {
      const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return app.getRemainingTimeISO(totaltimeInSeconds * app.millisecond);
    } else {
      return "00:00.0";
    }
  }

  get countdownLabel(): string {
    if (this.data) {
      return ":" + this.data.countdown;
    } else {
      return ":0";
    }
  }

  _data: IntervalStorageData;
  get data(): IntervalStorageData {
    return this._data;
  }
  set data(value: IntervalStorageData) {
    this._data = value;
  }
}
