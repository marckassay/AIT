import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as app from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-interval-settings',
  templateUrl: 'interval-settings.html',
})

export class IntervalSettingsPage {
  title: string;
  activerest: any = { lower: 10,
                      upper: 50 };
  interval: number = 12;
  intervalObject: any = { min: 1,
                          max: 20 };
  countdown: number = 30;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntervalSettingsPage');
  }

  get totaltime(): string {
    const totaltimeInSeconds = (this.activerest.upper + this.activerest.lower) * this.interval;
    return app.getRemainingTimeISO(totaltimeInSeconds * app.millisecond);
  }

  get countdownLabel(): string {
    return ":"+this.countdown;
  }
}
