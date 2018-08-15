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
import { Vibration } from '@ionic-native/vibration';
import { AITVibrate } from './AITVibrate';
import { AITSound } from './AITSound';
import { Injectable } from '@angular/core';
import { AITStorage } from './AITStorage';
import { AppStorageData } from '../app.component';

@Injectable()
export class AITSignal {
  private _data: AppStorageData;
  public get data(): AppStorageData {
    return this._data;
  }
  public set data(value: AppStorageData) {
    this._data = value;
  }

  sound: AITSound;
  vibrate: AITVibrate;

  constructor(public vibration: Vibration,
    public storage: AITStorage) {
    this.sound = new AITSound();
    this.vibrate = new AITVibrate(vibration);
  }

  single() {
    if (this.data.sound) { this.sound.singleBeep(); }
    if (this.data.vibrate) { this.vibrate.singleVibrate(); }
  }

  double() {
    if (this.data.sound) { this.sound.tripleBeep(); }
    if (this.data.vibrate) { this.vibrate.doubleVibrate(); }
  }

  triple() {
    if (this.data.sound) { this.sound.completeBeep(); }
    if (this.data.vibrate) { this.vibrate.tripleVibrate(); }
  }

  toggleRememberVolume(appstoragedata: AppStorageData) {
    if (appstoragedata.volume.app !== undefined) {
      appstoragedata.volume.app = undefined;
      appstoragedata.volume.device = undefined;
    } else {
      appstoragedata.volume.app = 9;
      appstoragedata.volume.device = 9;
    }

    this.storage.setItem(appstoragedata);

    this.restoreVolume();
  }

  restoreVolume() {
    if (this.data.volume.app !== undefined) {
      this.sound.volume = this.data.volume.app;
      // TODO: get device volume from Android and then update this field
      // this.data.volume.device = ???
    }
  }
}
