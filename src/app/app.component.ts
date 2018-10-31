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
import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { APP_SETTINGS_PAGE, INTERVAL_DISPLAY_PAGE, TIMER_DISPLAY_PAGE, STOPWATCH_DISPLAY_PAGE } from '../pages/ait-constants.page';
import { StatusBar } from '@ionic-native/status-bar';
import { MenuController, Nav, Platform } from 'ionic-angular';
import { AITStorage } from '../providers/storage/ait-storage.service';
import { HomeAction, HomeEmission, HomeDisplayPage } from '../pages/home-display/home-display';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from '../providers/theme-settings.provider';
import { HomeDisplayService } from '../providers/home-display.service';
import { AppStorageData } from '../providers/storage/ait-storage.interfaces';
import { StorageDefaultData } from '../providers/storage/ait-storage.defaultdata';
import { app_env } from "@environment";

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

  protected isFirstViewing: boolean;

  constructor(private platform: Platform,
    private homeService: HomeDisplayService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private settings: ThemeSettingsProvider,
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
    this.checkAppStartupData();

    console.log("ENV :: " + app_env.useMock);
  }

  checkAppStartupData() {
    this.storage.getPagePromise<AppStorageData>(StorageDefaultData.APP_ID).then((value) => {
      if (value) {
        this.registerAppEventHandlers();

        this.settings.base = value.base as BaseTheme;
        this.settings.accent = value.accent as AccentTheme;

        this.settings.combinedTheme.subscribe((val: string) => {
          this.combinedTheme = val;
        });

        this.setPageToRoot(value.current_uuid);
      }
    });
  }

  registerAppEventHandlers() {
    this.platform.resume.subscribe(() => {
      // TODO: in an unlikely event, this perhaps can be used. That is, if the user has display in
      // running state when they set ait to the device's background and then returns. At that point
      // this may be called.
      // this.brightness.applyBrightnessOffset();
    });
  }

  setPageToRoot(uuid: string) {
    let displayPage: any;

    if (uuid === StorageDefaultData.INTERVAL_ID) {
      displayPage = INTERVAL_DISPLAY_PAGE;
    } else if (uuid === StorageDefaultData.TIMER_ID) {
      displayPage = TIMER_DISPLAY_PAGE;
    } else if (uuid === StorageDefaultData.STOPWATCH_ID) {
      displayPage = STOPWATCH_DISPLAY_PAGE;
    }

    this.navCtrl.push(displayPage,
      { uuid: uuid, rightmenu: this.rightMenuInnerHTML },
      { updateUrl: false, isNavRoot: true }).then(() => {
        if (!this.isFirstViewing) {
          this.menuCtrl.toggle('left');
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
          this.setPageToRoot(StorageDefaultData.INTERVAL_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Timer:
        if (currentPageName !== TIMER_DISPLAY_PAGE) {
          this.setPageToRoot(StorageDefaultData.TIMER_ID);
        } else {
          this.menuCtrl.toggle('left');
        }
        break;
      case HomeAction.Stopwatch:
        if (currentPageName !== STOPWATCH_DISPLAY_PAGE) {
          this.setPageToRoot(StorageDefaultData.STOPWATCH_ID);
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
