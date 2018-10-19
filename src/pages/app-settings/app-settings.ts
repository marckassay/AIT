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
import { Component, ViewChild } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { AppStorageData, BrightnessSet } from '../../providers/storage/ait-storage.interfaces';
import { AITStorage } from '../../providers/storage/ait-storage.service';
import { AITBrightness, BrightnessUtil } from '../../providers/ait-screen';
import { AccentTheme, BaseTheme, ThemeSettingsProvider } from '../../providers/theme-settings.provider';
import { Navbar } from 'ionic-angular/navigation/nav-interfaces';
import { AITSignal } from '../../providers/ait-signal';

@IonicPage()
@Component({
  selector: 'page-app-settings',
  templateUrl: 'app-settings.html',
})
export class AppSettingsPage {
  _data: AppStorageData;
  get data(): AppStorageData {
    return this._data;
  }
  set data(value: AppStorageData) {
    this._data = value;
  }

  @ViewChild('Navbar')
  nav: Navbar;

  BaseTheme = BaseTheme;
  AccentTheme = AccentTheme;

  absoluteBrightnessValue: BrightnessSet;
  soundToggleWillEnter: boolean;
  soundRememberToggleWillEnter: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public storage: AITStorage,
    public brightness: AITBrightness,
    public signal: AITSignal,
    public settings: ThemeSettingsProvider,
    public menuCtrl: MenuController) {
  }

  ionViewWillEnter(): void {
    this.menuCtrl.enable(false, 'left');
    this.menuCtrl.enable(false, 'right');

    this.storage.getItem(AITStorage.APP_ID).then((value) => {
      this.data = value as AppStorageData;
      this.absoluteBrightnessValue = BrightnessUtil.absolute(this.data.brightness);
      this.soundToggleWillEnter = (this.data.sound !== 0);
      this.soundRememberToggleWillEnter = this.data.sound > 0;
    }).catch((reason: any) => {
      console.log("app-settings storage error" + reason);
    });
  }

  ionViewWillLeave(): void {
    if (this.data) {
      this.storage.setItem(this.data);
      this.signal.data = this.data;
    }
  }

  toggleSound(): void {
    if (this.data.sound === 0) {
      this.signal.audioman.getVolume(1, (result) => {
        this.data.sound = result.volume;
      });
    } else if (Math.abs(this.data.sound) > 0) {
      this.data.sound = 0;
    }
  }

  /**
   * The UI for this event handler is only enabled when: `Math.abs(this.data.sound) > 0`.
   */
  testVolume(event?: MouseEvent): void {
    this.signal.double();
  }

  /**
   * This UI is only enabled when: `Math.abs(this.data.sound) > 0`. And it simply will reverse the
   * sign of `this.data.sound` to indicate that a value of less than 0 disables this
   * "remember volume" feature, while a sign of greater than 0 enables it.
   */
  toggleRememberVolume(): void {
    if (this.data.sound !== 0) {
      this.data.sound = (this.data.sound * -1);
    }
  }

  toggleRememberBrightness(): void {
    this.data.brightness = BrightnessUtil.reverseSign(this.data.brightness);
  }

  brightnessChanged(event: any): void {
    // TODO: async to change device brightness momentarily
    this.data.brightness = (event.value as BrightnessSet);
  }

  toggleBaseTheme(value: BaseTheme): void {
    this.settings.base = value;
    this._data.base = value;
  }

  toggleAccentTheme(value: AccentTheme): void {
    this.settings.accent = value;
    this._data.accent = value;
  }

  navBack(): void {
    this.navCtrl.pop();
  }
}
