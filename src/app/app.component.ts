/**
    AiT - Another Interval Timer
    Copyright (C) 2018 Marc Kassay

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { APP_SETTINGS_PAGE, INTERVAL_DISPLAY_PAGE, TIMER_DISPLAY_PAGE, STOPWATCH_DISPLAY_PAGE, INTERVAL_SETTINGS_PAGE, TIMER_SETTINGS_PAGE, STOPWATCH_SETTINGS_PAGE } from '../pages/pages.constants';
import { StatusBar } from '@ionic-native/status-bar';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { AITStorage } from './core/AITStorage';
import { HomeAction, HomeEmission } from '../pages/home-display/home-display';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from './core/ThemeSettingsProvider';
import { Observable } from 'rxjs/Observable';
import { AITBaseSettingsPage } from '../pages/AITBaseSettingsPage';
import { AITBrightness } from './core/AITBrightness';

@Component({
  templateUrl: 'app.html'
})
export class App {
  @ViewChild(Nav)
  navCtrl: Nav;

  combinedTheme: string;
  appstoragedata: AppStorageData;

  protected isFirstViewing: boolean;

  @ViewChild('rightMenuInnerHTML', { read: ViewContainerRef })
  rightMenuInnerHTML: ViewContainerRef;

  constructor(private platform: Platform,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private settings: ThemeSettingsProvider,
    private brightness: AITBrightness,
    private menuCtrl: MenuController,
    private storage: AITStorage,
    private componentFactoryResolver: ComponentFactoryResolver) {

    this.platform.ready().then(() => {
      this.screenOrientation.unlock();
      this.statusBar.styleLightContent();
    });

    this.isFirstViewing = true;
    this.checkAppStartupData(5);
  }

  checkAppStartupData(attempts: number) {
    // console.log("checkAppStartupData call, attempt number: "+attempts);
    this.storage.checkAppStartupData().then(() => {

      this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {
        if (value) {
          this.appstoragedata = (value as AppStorageData);

          this.registerAppEventHandlers();

          this.settings.base = this.appstoragedata.base as BaseTheme;
          this.settings.accent = this.appstoragedata.accent as AccentTheme;

          this.settings.combinedTheme.subscribe((value: string) => {
            this.combinedTheme = value;
          });

          this.setPageToRoot(value.current_uuid);
          Observable.timer(8000).subscribe(() => {
            this.brightness.restoreBrightest();
          });
        } else {
          // sometimes or alltimes it fails on initial load with no db.
          Observable.timer(500).subscribe(() => {
            this.checkAppStartupData(--attempts);
          });
        }
      });
    });
  }

  registerAppEventHandlers() {
    this.platform.resume.subscribe(() => {
      this.brightness.restoreBrightest();
    });
  }

  setPageToRoot(uuid: string) {
    let displayPage: any;

    if (uuid === AITStorage.INITIAL_INTERVAL_ID) {
      displayPage = INTERVAL_DISPLAY_PAGE;
    } else if (uuid === AITStorage.INITIAL_TIMER_ID) {
      displayPage = TIMER_DISPLAY_PAGE;
    } else if (uuid === AITStorage.INITIAL_STOPWATCH_ID) {
      displayPage = STOPWATCH_DISPLAY_PAGE;
    }

    this.navCtrl.setRoot(displayPage, uuid).then(() => {
      if (!this.isFirstViewing) {
        this.menuCtrl.toggle('left').then(() => {
          this.storage.setCurrentUUID(uuid);
        });
      } else {
        this.isFirstViewing = false;
      }
    });
  }

  /*   setSettingsPageToRightMenu(uuid: string) {
      let settingsPage: any;

      if (uuid === AITStorage.INITIAL_INTERVAL_ID) {
        settingsPage = INTERVAL_SETTINGS_PAGE;
      } else if (uuid === AITStorage.INITIAL_TIMER_ID) {
        settingsPage = TIMER_SETTINGS_PAGE;
      } else if (uuid === AITStorage.INITIAL_STOPWATCH_ID) {
        settingsPage = STOPWATCH_SETTINGS_PAGE;
      }

      this.createComponentForRightMenu(settingsPage, uuid);
    } */

  createComponentForRightMenu(settingsPage: any, uuid: string) {
    const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory<AITBaseSettingsPage>(settingsPage);
    this.rightMenuInnerHTML.clear();
    const componentInstance = this.rightMenuInnerHTML.createComponent<AITBaseSettingsPage>(resolvedComponent);
    componentInstance.instance.uuid = uuid;
  }

  onHomeAction(emission: HomeEmission) {
    const currentPage = this.navCtrl.getActive().component;

    switch (emission.action) {
      case HomeAction.IntervalTimer:
        if (currentPage !== INTERVAL_DISPLAY_PAGE) {
          this.setPageToRoot(AITStorage.INITIAL_INTERVAL_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Timer:
        if (currentPage !== TIMER_DISPLAY_PAGE) {
          this.setPageToRoot(AITStorage.INITIAL_TIMER_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Stopwatch:
        if (currentPage !== STOPWATCH_DISPLAY_PAGE) {
          this.setPageToRoot(AITStorage.INITIAL_STOPWATCH_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Settings:
        this.menuCtrl.toggle('left').then(() => {
          this.navCtrl.push(APP_SETTINGS_PAGE);
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
  // default value is 'undefined'; which means by default this option is disabled
  brightness: number | undefined;
  lighttheme: boolean;
  base: number;
  accent: number;
}

export interface CountdownWarnings {
  fivesecond: boolean;
  tensecond: boolean;
  fifteensecond: boolean;
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

  // this field needs to be maintained by object that reads it.
  hasLastSettingChangedTime: boolean;
}

export interface StopwatchStorageData extends UUIDData {
  name: string;

  countdown: number;
  countdownmaxlimit: number;

  warnings: CountdownWarnings;
}

export interface TimerStorageData extends StopwatchStorageData {
  time: number;
  warnings: CountdownWarnings;

  // this field needs to be maintained by object that reads it.
  hasLastSettingChangedTime: boolean;
}
