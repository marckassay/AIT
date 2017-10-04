import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as app from '../../app/app.component';
import { IntervalStorageData } from "../pages";
import { Storage } from '../../app/core/Storage';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html',
})

export class IntervalSettingsPage implements OnInit {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
    /*
    if((<IntervalStorageData>navParams.data).uuid) {
      this._data = navParams.data as any;
    } else {
      this.data = this.getDefaultData();
    }
    */
    // TODO: this is just a crutch for dev...
    if((<IntervalStorageData>navParams.data).uuid) {
      this._data = storage.getItem(navParams.data.uuid) as any;
    } else {
      this.data = this.getDefaultData();
    }
  }

  ngOnInit(): void {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntervalSettingsPage');
    console.log(this.data)
  }

  ionViewWillLeave() {
    this.storage.setItem(this.data);
  }

  _data: IntervalStorageData;

  get data(): IntervalStorageData {
    return this._data;
  }

  set data(value: IntervalStorageData) {
    this._data = value;
  }

  getDefaultData(): IntervalStorageData {
    return {  uuid: "abcdef123456",
              name: "Program #1 ",
              activerest: {lower: 10, upper: 50},
              activemaxlimit: 90,
              intervals: 12,
              intervalmaxlimit: 20,
              countdown: 15,
              countdownmaxlimit: 60,
              getready: 10,
              isCountdownInSeconds: false };
  }

  get totaltime(): string {
    const totaltimeInSeconds = (this.data.activerest.upper + this.data.activerest.lower) * this.data.intervals;
    return app.getRemainingTimeISO(totaltimeInSeconds * app.millisecond);
  }

  get countdownLabel(): string {
    return ":"+this.data.countdown;
  }
}
