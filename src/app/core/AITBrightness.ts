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
import { AppStorageData } from '../app.component';

@Injectable()
export class AITBrightness {
  data: AppStorageData;

  constructor(public brightness: Brightness,
    public storage: AITStorage) {
    this.storage.getItem(AITStorage.APP_ID).then((value) => {
      this.data = (value as AppStorageData);
    });
  }

  storeBrightness = (enabling: boolean = false) => {
    const lastBrightnessValue = this.data.brightness;
    if ((lastBrightnessValue !== undefined) || enabling) {
      this.brightness.getBrightness().then((value) => {
        this.data.brightness = value;
      });
    }
  }

  restoreBrightness = () => {
    const lastBrightnessValue = this.data.brightness;
    if (lastBrightnessValue !== undefined) {
      this.brightness.setBrightness(lastBrightnessValue);
    }
  }
}
