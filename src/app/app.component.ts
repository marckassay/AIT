import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IntervalDisplayPage } from '../pages/pages';
import { Storage } from './core/Storage';

@Component({
  template: '<ion-nav #appnav [root]="rootPage"></ion-nav>'
})
export class AppComponent {
  @ViewChild('appnav')
  nav: NavController;

  rootPage:any = IntervalDisplayPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, screenOrientation: ScreenOrientation, public storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      screenOrientation.unlock();
      this.stubData();
    });

    platform.backButton.subscribe((x)=>{console.log("backButton clicked!")})
  }

  stubData() {
    this.storage.getItem("abc123").then((value) => {
                    this.nav.setRoot(IntervalDisplayPage,value);
                  }).catch((r)=>{ console.log("app.component failed to get record")});
  }
}

export interface Limits {
  lower: number;
  upper: number;
}

export interface IntervalStorageData {
  uuid: string;
  name: string;
  activerest: Limits;
  activemaxlimit: number;

  intervals: number;
  intervalmaxlimit: number;

  countdown: number;
  countdownmaxlimit: number;

  isCountdownInSeconds: boolean;

  getready: number;
}

export interface ITimelinePosition
{
  /**
   * Used to indicate where in the Observable sequence it is currently at.
   */
  timelinePosition: number;
}

export const millisecond: number = 1000;
/**
 * Returns this partial time segment, for an example:
 *  01:02.3
 * The example above is can be said, "1 minute, 2 point 3/10ths of a second"
 */
export function getRemainingTimeISO (remainingmilliseconds: number): string {
  return new Date(remainingmilliseconds).toISOString().substr(14,7);
}
