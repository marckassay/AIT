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
import { Brightness } from '@ionic-native/brightness';
import { Injectable } from '@angular/core';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData, UUIDData, BrightnessSet, DeviceBrightnessSet } from './storage/ait-storage.interfaces';

export class BrightnessUtil {
  static convertToBrightnessNumber(value: DeviceBrightnessSet): BrightnessSet {
    return (value * 100) as BrightnessSet;
  }

  static convertToDeviceBrightnessNumber(value: BrightnessSet): DeviceBrightnessSet {
    return (value / 100) as DeviceBrightnessSet;
  }

  static reverseSign(value: BrightnessSet): BrightnessSet {
    return (value * -1) as BrightnessSet;
  }

  static absolute(value: BrightnessSet): BrightnessSet {
    return Math.abs(value as number) as BrightnessSet;
  }
}

@Injectable()
export class AITBrightness {

  constructor(public brightness: Brightness,
    public storage: AITStorage) {
  }

  /**
   * Sets ait's 'brightness' data field [-100,100] in intervals of tens. The value will be divided
   * 100 so that its converted for the platform, Android. The following is their statement:
   *
   *    "A value of less than 0, the default, means to use the preferred screen
   *    brightness. 0 to 1 adjusts the brightness from dark to full bright."
   *
   * If ait's 'brightness' value is -100, it means that the default value is being used. The default
   * value is having this brightness feature disabled. If the value is between [10, 100], it means the
   * brightness feature is enabled. In so many words, apps will never know what brightness value the
   * user has the device brightness set to.
   *
   * Upon the ait is no longer active app and its brightness feature is enabled, the device will
   * return to its default value. This is done by Android and not AiT.
   *
   * @param value Any positive number enables ait's brightness feature, while any negative number
   *              disables it.
   * @returns void
   */
  setBrightness(value: BrightnessSet): void {

    this.storage.getItem(AITStorage.APP_ID).then((val: UUIDData) => {
      let data: AppStorageData = (val as AppStorageData);

      if (data.brightness !== value) {
        data.brightness = value;
        this.storage.setItem(data);

        this.brightness.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(data.brightness));
      }
    });
  }

  // Retrieves ait's 'brightness' data field and if its defined it will set the device's brightness
  // to that value.
  restoreBrightness(): void {
    this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {
      const lastBrightnessValue: BrightnessSet = (value as AppStorageData).brightness;
      this.brightness.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(lastBrightnessValue));
    });
  }

  setKeepScreenOn(value: boolean): void {
    this.brightness.setKeepScreenOn(value);
  }
}
