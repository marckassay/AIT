import { Component, OnInit, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as app from '../../app/app.component';
import { Storage } from '../../app/core/Storage';
import { IntervalStorageData } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html',
})

export class IntervalSettingsPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage) {}

  ionViewWillEnter() {
    this.preinitializeDisplay();
  }

  ionViewDidLoad() {
    this.preinitializeDisplay();
  }

  ionViewWillLeave() {
    this.storage.setItem(this.data);
  }

  preinitializeDisplay(): void {
    const uuid = this.navParams.data;
    if(uuid) {
      this.storage.getItem(uuid).then((value) => {
        this.data = value;
      });
    }
  }

  get totaltime(): string {
    if(this.data) {
      const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
      return app.getRemainingTimeISO(totaltimeInSeconds * app.millisecond);
    } else {
      return "00:00.0";
    }
  }

  get countdownLabel(): string {
    if(this.data) {
      return ":"+this.data.countdown;
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
