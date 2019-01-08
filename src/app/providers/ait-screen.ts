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
import { Brightness } from '@ionic-native/brightness/ngx';
import { Injectable } from '@angular/core';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData, UUIDData, BrightnessSet } from './storage/ait-storage.interfaces';
import { StorageDefaultData } from './storage/ait-storage.defaultdata';
import { Subject } from 'rxjs';

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
 * Upon the ait is no longer active app and its brightness feature is enabled, the device will
 * return to its default value. This is done by Android and not AiT.
 */
@Injectable()
export class AITBrightness {

  constructor(
    public display: Brightness,
    public storage: AITStorage) { }

  /**
   * Sets the BrightnessSet value that the user has choosen. This value will be mapped to
   * DeviceBrightnessSet so that it will be available to be read by the device.
   *
   * @param value Any positive number enables ait's brightness feature, while any negative number
   *              disables it.
   */
  storeBrightnessOffset(value: BrightnessSet, apply: boolean = false) {
    const store = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID, true);

    store.promise.then((val) => {
      if (val.brightness !== value) {
        val.brightness = value;
      }

      store.subject.next(val);

      if (apply === true) {
        this.display.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(value));
      }
    });
  }

  retrieveBrightnessOffset(): Promise<BrightnessSet> {
    const store = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID, true);

    return store.promise.then((value): BrightnessSet => {
      return value.brightness;
    });
  }

  /**
   * Retrieves ait's 'brightness' data field and if its defined (greater than 0), it will set the
   * device's brightness to that value.
   */
  applyBrightnessOffset(): void {
    const store = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID, true);

    store.promise.then((value) => {
      const lastBrightnessValue: BrightnessSet = value.brightness;
      if (lastBrightnessValue > 0) {
        this.display.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(lastBrightnessValue));
      }
    });
  }

  /**
   * Sets the device's API brightness to -1, to remove our offset (if any) and return to the
   * brightness value prior to AiT being launched. Calling this method doesn't modify app's storage.
   */
  removeBrightnessOffset(): void {
    this.display.setBrightness(-1);
  }

  setKeepScreenOn(value: boolean): void {
    this.display.setKeepScreenOn(value);
  }
}
