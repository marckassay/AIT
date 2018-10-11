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
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Optional, SkipSelf } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { APP_SETTINGS_PAGE, INTERVAL_DISPLAY_PAGE, TIMER_DISPLAY_PAGE, STOPWATCH_DISPLAY_PAGE } from '../pages/ait-constants.page';
import { StatusBar } from '@ionic-native/status-bar';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { HomeAction, HomeEmission, HomeDisplayPage } from '../pages/home-display/home-display';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from '../providers/theme-settings.provider';
import { Observable } from 'rxjs/Observable';
import { AITBrightness } from '../providers/ait-screen';
import { HomeDisplayService } from '../providers/home-display.service';
import { AppStorageData, UUIDData } from '../providers/storage/ait-storage.interfaces';

@Component({
  templateUrl: 'app.html'
})
export class App {
  @ViewChild(Nav)
  navCtrl: Nav;

  @ViewChild('leftMenuInnerHTML', { read: ViewContainerRef })
  leftMenuInnerHTML: ViewContainerRef;

  @ViewChild('rightMenuInnerHTML', { read: ViewContainerRef })
  rightMenuInnerHTML: ViewContainerRef;

  combinedTheme: string;

  appstoragedata: AppStorageData;

  protected isFirstViewing: boolean;

  constructor(private platform: Platform,
    private homeService: HomeDisplayService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private settings: ThemeSettingsProvider,
    private brightness: AITBrightness,
    private storage: AITStorage,
    private menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      this.screenOrientation.unlock();
      this.statusBar.styleLightContent();
    });

    this.isFirstViewing = true;
    this.homeService.observable.subscribe({
      complete: () => {
        this.createComponentForLeftMenu();
      }
    });
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
            this.brightness.restoreBrightness();
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
      this.brightness.restoreBrightness();
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

    this.navCtrl.push(displayPage, {
      id: uuid,
      rightmenu: this.rightMenuInnerHTML
    }, {
        updateUrl: false,
        isNavRoot: true
      }).then(() => {
        if (!this.isFirstViewing) {
          this.menuCtrl.toggle('left').then(() => {
            this.storage.setCurrentUUID(uuid);
          }, (reason) => {
            console.error(reason);
          });

        } else {
          this.isFirstViewing = false;
        }
      }, (reason) => {
        console.error(reason);
      });
  }

  createComponentForLeftMenu() {
    if (!this.leftMenuInnerHTML.length) {

      const resolvedComponent = this.componentFactoryResolver.resolveComponentFactory(HomeDisplayPage);
      const homepage = this.leftMenuInnerHTML.createComponent(resolvedComponent);
      // TODO: need a better check to set this property to true. it may fail to create component;
      // need to be mindful of that.

      homepage.instance.onAction.subscribe((next) => {
        this.onHomeAction(next);
      });
    }
  }

  onHomeAction(emission: HomeEmission) {
    const currentPageName: string = this.navCtrl.getActive().component.name;

    switch (emission.action) {
      case HomeAction.IntervalTimer:
        if (currentPageName !== INTERVAL_DISPLAY_PAGE) {
          this.setPageToRoot(AITStorage.INITIAL_INTERVAL_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Timer:
        if (currentPageName !== TIMER_DISPLAY_PAGE) {
          this.setPageToRoot(AITStorage.INITIAL_TIMER_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Stopwatch:
        if (currentPageName !== STOPWATCH_DISPLAY_PAGE) {
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
