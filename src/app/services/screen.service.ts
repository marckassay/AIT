/**
    AiT - Another Interval Timer
    Copyright (C) 2019 Marc Kassay

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
import { Injectable } from '@angular/core';
import { AndroidFullScreen, AndroidSystemUiFlags } from '@ionic-native/android-full-screen/ngx';
import { Brightness } from '@ionic-native/brightness/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { BehaviorSubject } from 'rxjs';

import { AppUtils } from '../app.utils';

import { StorageDefaultData } from './storage/ait-storage.defaultdata';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData, BrightnessSet, OrientationSetting } from './storage/ait-storage.shapes';

export class BrightnessUtil {
  static convertToDeviceBrightnessNumber(value: BrightnessSet): number {
    return (value / 100) as number;
  }

  static reverseSign(value: BrightnessSet): BrightnessSet {
    return (value * -1) as BrightnessSet;
  }

  static absolute(value: BrightnessSet): BrightnessSet {
    return Math.abs(value as number) as BrightnessSet;
  }
}

/**
 * Sets ait's 'brightness' data field [-100,100] in intervals of tens. This value is stored as-is
 * however the device's brightness value uses a different numbering set. The following is their
 * statement:
 *
 *  "A value of less than 0, the default, means to use the preferred screen brightness. 0 to 1
 * adjusts the brightness from dark to full bright."
 *
 * If ait's 'brightness' value is -100, it means that the default value is being used. The default
 * value is having this brightness feature disabled. If the value is between [10, 100], it means the
 * brightness feature is enabled. In so many words, apps will never know what brightness value the
 * user has the device brightness set to. Hence the term 'brightnessOffset' is used versus 'brightness'
 * which implies an absolute value.
 *
 * When ait is no longer active app and its brightness feature is enabled, the device will return
 * to its default value. This is done by Android and not AiT.
 */
@Injectable()
export class ScreenService {
  private _data: AppStorageData;
  public get data(): AppStorageData {
    return this._data;
  }
  public set data(value: AppStorageData) {
    this._data = value;
  }

  private subject: BehaviorSubject<AppStorageData>;

  constructor(
    private brightness: Brightness,
    public orientation: ScreenOrientation,
    private uibars: AndroidFullScreen,
    private splash: SplashScreen,
    private storage: AITStorage) { }

  /**
   * Called by display-page
   */
  onInit(): void {
    if (this.data === undefined) {
      // "lock" data to prevent any others in here
      this.data = null;
      this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
        .then((val) => {
          this.subject = val;
          this.subject.subscribe((data) => { this.data = data; });
        });
    }
  }

  /**
   * Called by app-component during bootup
   */
  async bootupScreen(): Promise<void> {
    await this.uibars.showUnderStatusBar();
    await this.uibars.setSystemUiVisibility(AndroidSystemUiFlags.HideNavigation);
    await AppUtils.delayPromise(500);
    this.splash.hide();
  }

  async setScreenToRunningMode(value: boolean): Promise<void> {
    await this.applyOrientation(value);
    await AppUtils.delayPromise(250);
    await this.applyBrightnessOffset(value);
    await AppUtils.delayPromise(750);
    await this.hideStatusAndNavBar(value);
    await AppUtils.delayPromise(500);
    await this.setKeepScreenOn(value);
  }

  private async applyOrientation(value: boolean): Promise<void> {
    if ((value === true) && (this.data.orientation !== 0)) {
      const mode = (this.data.orientation === 1) ? this.orientation.ORIENTATIONS.PORTRAIT : this.orientation.ORIENTATIONS.LANDSCAPE;
      await this.orientation.lock(mode);
    } else if ((value === false) && (this.data.orientation !== 0)) {
      await this.orientation.unlock();
    }
  }

  /**
   * Retrieves ait's 'brightness' data field and if its defined (greater than 0), it will set the
   * device's brightness to that value. If value is false, sets the device's API brightness to -1,
   * to remove offset (if any) and return to the brightness value prior to AiT being launched.
   *
   * @param value to apply or revert brightness offset
   */
  private async applyBrightnessOffset(value: boolean): Promise<void> {
    if (value === true) {
      const lastBrightnessValue = this.data.brightness;
      if (lastBrightnessValue > 0) {
        await this.brightness.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(lastBrightnessValue));
      }
    } else {
      await this.brightness.setBrightness(-1);
    }
  }

  private setKeepScreenOn(value: boolean): void {
    this.brightness.setKeepScreenOn(value);
  }

  private async hideStatusAndNavBar(value: boolean): Promise<void> {
    if (value) {
      await this.uibars.setSystemUiVisibility(
        AndroidSystemUiFlags.Immersive |
        AndroidSystemUiFlags.Fullscreen |
        AndroidSystemUiFlags.HideNavigation);
    } else {
      await this.uibars.setSystemUiVisibility(
        AndroidSystemUiFlags.Immersive |
        AndroidSystemUiFlags.Visible |
        AndroidSystemUiFlags.HideNavigation);
    }
  }
}
