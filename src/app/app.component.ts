import { Component, ViewChild, AfterViewInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IntervalDisplayPage, IntervalSettingsPage } from '../pages/pages';
import { AITStorage } from './core/AITStorage';
import { HomeEmission, HomeAction } from '../pages/home/home';
import { AppSettingsPage } from '../pages/app-settings/app-settings';
import { ThemeSettingsProvider } from './core/ThemeSettingsProvider';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  @ViewChild(Nav)
  navCtrl: Nav;

  rootPage: any;

  combinedTheme: string;

  @ViewChild('rightMenuInnerHTML', { read: ViewContainerRef })
  rightMenuInnerHTML: ViewContainerRef;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              screenOrientation: ScreenOrientation,
              public settings: ThemeSettingsProvider,
              public menuCtrl: MenuController,
              public storage: AITStorage,
              public componentFactoryResolver: ComponentFactoryResolver) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      screenOrientation.unlock();
    });

    platform.backButton.subscribe(() => {
      console.log("Device's back-button clicked!");
    });

    storage.checkAppStartupData().then(() => {
      storage.getItem(AITStorage.APP_ID).then((value: AppStorageData) => {

        const lasttheme = (value.lighttheme)?'theme-light':'theme-dark';
        settings.setCombinedTheme(lasttheme);

        this.settings.combinedTheme.subscribe( (value: string) => {
          this.combinedTheme = value;
        });

        this.afterStartupData(value.current_uuid);
      });
    });
  }

  afterStartupData(current_uuid: string) {
    // TODO: will need to not have page hard-coded when CountdownPage
    // or StopwatchPage is implemented.
    this.navCtrl.setRoot(IntervalDisplayPage, current_uuid);

    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(IntervalSettingsPage);
    let componentInstance: any = this.rightMenuInnerHTML.createComponent(resolvedComponent);
    componentInstance.instance.initialize(current_uuid);
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

export interface UUIDData {
  uuid: string;
  current_uuid: string;
}

export interface AppStorageData extends UUIDData {
  vibrate: boolean;
  sound: boolean;
  lighttheme: boolean;
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

export interface IntervalStorageData extends UUIDData {
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
