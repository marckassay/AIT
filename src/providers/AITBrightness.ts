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
import { AITStorage } from './AITStorage';
import { AppStorageData, UUIDData } from '../app/app.component';

@Injectable()
export class AITBrightness {

  constructor(public brightness: Brightness,
    public storage: AITStorage) {
  }

  /**
   * Retrieves app's 'brightness' data field and depending on the value of 'enabling' and the value of
   * the app's brightness field, it will behave diffently.
   *
   * TODO: currently this function unconditionally stores the brightness value to 100%. This wasn't
   * my original intention, but the ionic-plugin is designed in a way that makes it cumbersome to set.
   * Not sure if this will be modified in the future or not.
   *
   * @param enabling If 'enabling' is "true", it will get the device's brightness value and set it to
   *                the app's brightness field. If 'enabling' is "false", it will set the app's
   *                brightness field to "undefined". If 'enabling' is 'undefined', it will overwrite
   *                it ('enabling' parameter) to "true" if app's brightness field is defined.
   *                Otherwise, app's brightness field will be set to "false".
   * @returns void
   */
  enableBrightest(enabling?: boolean): void {
    let data: AppStorageData;
    let enablingComputed = enabling;

    this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {

      data = (value as AppStorageData);

      // this is to have enableBrightest act as a toggle function for brightness
      if (enablingComputed === undefined) {
        enablingComputed = (data.brightness === undefined) ? true : false;
      }

      if (enablingComputed === true) {
        data.brightness = 1;
        this.storage.setItem(data);
        this.brightness.setBrightness(data.brightness);
      } else {
        data.brightness = undefined;
        this.storage.setItem(data);
        this.brightness.setBrightness(-1);
      }
    });
  }

  // Retrieves app's 'brightness' data field and if its defined it will set the device's brightness
  // to that value.
  restoreBrightest(): void {
    this.storage.getItem(AITStorage.APP_ID).then((value: UUIDData) => {
      const lastBrightnessValue: number | undefined = (value as AppStorageData).brightness;

      if (lastBrightnessValue !== undefined) {
        this.brightness.setBrightness(lastBrightnessValue);
      }
    });
  }

  setKeepScreenOn(value: boolean): void {
    this.brightness.setKeepScreenOn(value);
  }
}
