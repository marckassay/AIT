import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IntervalDisplayPage, IntervalSettingsPage } from '../pages/pages';
import { AITStorage } from './core/AITStorage';
import { HomeEmission, HomeAction } from '../pages/home/home';
import { ThemeSettingsProvider, BaseTheme, AccentTheme } from './core/ThemeSettingsProvider';
import { Observable } from 'rxjs/Observable';

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
    //console.log("checkAppStartupData call, attempt number: "+attempts);
    this.storage.checkAppStartupData().then(() => {
      this.storage.getItem(AITStorage.APP_ID).then((value: AppStorageData) => {

        if(value) {
          this.settings.base = <BaseTheme>value.base;
          this.settings.accent = <AccentTheme>value.accent;

          this.settings.combinedTheme.subscribe( (value: string) => {
            this.combinedTheme = value;
          });

          this.afterStartupData(value.current_uuid);
        } else {
          // sometimes or alltimes it fails on initial load with no db.
          Observable.timer(500).subscribe(()=>{this.checkAppStartupData(--attempts)})
        }
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
        this.menuCtrl.toggle('left').then((value) => {
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
