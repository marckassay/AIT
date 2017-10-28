import { Component, ViewChild, AfterViewInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IntervalDisplayPage, IntervalSettingsPage } from '../pages/pages';
import { Storage } from './core/Storage';
import { HomeEmission, HomeAction } from '../pages/home/home';
import { AppSettingsPage } from '../pages/app-settings/app-settings';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent implements AfterViewInit {
  @ViewChild(Nav)
  navCtrl: Nav;

  rootPage: any;

  @ViewChild('rightMenuInnerHTML', { read: ViewContainerRef })
  rightMenuInnerHTML: ViewContainerRef;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    screenOrientation: ScreenOrientation,
    public menuCtrl: MenuController,
    public storage: Storage,
    public componentFactoryResolver: ComponentFactoryResolver) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      screenOrientation.unlock();
    });

    platform.backButton.subscribe((x) => {
      console.log("Device's back-button clicked!")
    });
  }

  ngAfterViewInit() {
    this.setAndLoadRootWithData();
    this.rightSideMenuComponent(IntervalSettingsPage, "abc123");
  }

  rightSideMenuComponent(component: any, uuid: string) {
    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(component);
    let componentInstance: any = this.rightMenuInnerHTML.createComponent(resolvedComponent);
    componentInstance.instance.initialize(uuid);
  }

  setAndLoadRootWithData() {
    this.storage.getItem("abc123").then((value) => {
      this.navCtrl.setRoot(IntervalDisplayPage, value);
    }).catch((r) => {
      console.log("app.component failed to get record")
    });
  }

  onHomeAction(emission: HomeEmission) {
    switch (emission.action) {
      case HomeAction.IntervalTimer:
        this.menuCtrl.toggle('left');
        break;

      case HomeAction.Countdown:
        break;

      case HomeAction.Stopwatch:
        break;

      case HomeAction.Settings:
        this.navCtrl.push(AppSettingsPage);
        this.menuCtrl.toggle('left');
        break;
    }
  }
}

export interface CountdownWarnings {
  fivesecond: boolean;
  tensecond: boolean;
  fifthteensecond: boolean;
}

export interface Limits {
  lower: number;
  upper: number;
}

export interface UUIDData {
  uuid: string;
}
export interface AppStorageData extends UUIDData {
  vibrate: boolean;
  sound: boolean;
  lighttheme: boolean;
}
export interface IntervalStorageData extends UUIDData{
  name: string;
  activerest: Limits;
  activemaxlimit: number;

  intervals: number;
  intervalmaxlimit: number;

  countdown: number;
  countdownmaxlimit: number;

  isCountdownInSeconds: boolean;

  getready: number;

  warnings: CountdownWarnings;
}

export interface ITimelinePosition {
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
export function getRemainingTimeISO(remainingmilliseconds: number): string {
  return new Date(remainingmilliseconds).toISOString().substr(14, 7);
}
