import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IntervalDisplayPage, IntervalSettingsPage, TimerDisplayPage, TimerSettingsPage, } from '../pages/pages';
import { AITStorage } from './core/AITStorage';
import { HomeAction, HomeEmission } from '../pages/home/home';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  @ViewChild(Nav)
  navCtrl: Nav;

  combinedTheme: string;

  @ViewChild('rightMenuInnerHTML', { read: ViewContainerRef })
  rightMenuInnerHTML: ViewContainerRef;

  constructor(platform: Platform,
    statusBar: StatusBar,
    screenOrientation: ScreenOrientation,
    public splashScreen: SplashScreen,
    public settings: ThemeSettingsProvider,
    public menuCtrl: MenuController,
    public storage: AITStorage,
    public componentFactoryResolver: ComponentFactoryResolver) {

    platform.ready().then(() => {
      statusBar.styleDefault();
      screenOrientation.unlock();
    });
    /*
    platform.backButton.subscribe(() => {
      console.log("Device's back-button clicked!");
    });
    */
    this.checkAppStartupData(5);
  }

  checkAppStartupData(attempts: number) {
    // console.log("checkAppStartupData call, attempt number: "+attempts);
    this.storage.checkAppStartupData().then(() => {

      this.storage.getItem(AITStorage.APP_ID).then((value: AppStorageData) => {

        if (value) {
          this.settings.base = value.base as BaseTheme;
          this.settings.accent = value.accent as AccentTheme;

          this.settings.combinedTheme.subscribe((value: string) => {
            this.combinedTheme = value;
          });

          this.setRootAndCreatePage(value.current_uuid);
        } else {
          // sometimes or alltimes it fails on initial load with no db.
          Observable.timer(500).subscribe(() => {
            this.checkAppStartupData(--attempts);
          });
        }
      });
    });
  }

  setRootAndCreatePage(current_uuid: string) {
    let displayPage: any;
    let settingsPage: any;

    if (current_uuid === AITStorage.INITIAL_INTERVAL_ID) {
      displayPage = IntervalDisplayPage;
      settingsPage = IntervalSettingsPage;
    } else if (current_uuid === AITStorage.INITIAL_TIMER_ID) {
      displayPage = TimerDisplayPage;
      settingsPage = TimerSettingsPage;
    }

    this.navCtrl.setRoot(displayPage, current_uuid);

    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(settingsPage);
    this.rightMenuInnerHTML.clear();
    let componentInstance: any = this.rightMenuInnerHTML.createComponent(resolvedComponent);
    componentInstance.instance.initialize(current_uuid);

    this.storage.setCurrentUUID(current_uuid);
  }

  onHomeAction(emission: HomeEmission) {
    const currentPage = this.navCtrl.getActive().component;

    switch (emission.action) {
      case HomeAction.IntervalTimer:
        if (currentPage !== IntervalDisplayPage) {
          this.setRootAndCreatePage(AITStorage.INITIAL_INTERVAL_ID);
        }
        this.menuCtrl.toggle('left');

        break;

      case HomeAction.Timer:
        if (currentPage !== TimerDisplayPage) {
          this.setRootAndCreatePage(AITStorage.INITIAL_TIMER_ID);
        }
        this.menuCtrl.toggle('left');

        break;

      case HomeAction.Stopwatch:
        break;

      case HomeAction.Settings:
        this.menuCtrl.toggle('left').then(() => {
          this.navCtrl.push('AppSettingsPage');
        });
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
  base: number;
  accent: number;
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

  warnings: CountdownWarnings;
}

export interface StopwatchStorageData extends UUIDData {
  name: string;

  countdown: number;
  countdownmaxlimit: number;
}

export interface TimerStorageData extends StopwatchStorageData {
  time: number;
}
