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
import { Injectable } from '@angular/core';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData } from './storage/ait-storage.interfaces';
import { AudioManagement } from '@ionic-native/audio-management';
import { StorageDefaultData } from './storage/ait-storage.defaultdata';

@Injectable()
/**
 * References audio and vibrate features of the device.
 */
export class AITSignal {
  data: AppStorageData;

  constructor(public vibration: Vibration,
    public audioman: AudioManagement,
    public storage: AITStorage) {
    this.storage.getPagePromise(StorageDefaultData.APP_ID).then((value) => {
      this.data = (value as AppStorageData);
    });
  }

  single() {
    if (this.data.sound !== 0) { this.singleBeep(); }
    if (this.data.vibrate) { this.singleVibrate(); }
  }

  double() {
    if (this.data.sound !== 0) { this.tripleBeep(); }
    if (this.data.vibrate) { this.doubleVibrate(); }
  }

  triple() {
    if (this.data.sound !== 0) { this.completeBeep(); }
    if (this.data.vibrate) { this.tripleVibrate(); }
  }

  private singleVibrate() {
    this.vibration.vibrate(500);
  }

  private doubleVibrate() {
    this.vibration.vibrate([500, 500, 500]);
  }

  private tripleVibrate() {
    this.vibration.vibrate([1000, 500, 1000]);
  }

  private singleBeep() {
    /*     this.sound_1.stop();
        this.sound_1.rate(1.0);
        this.sound_1.play(); */
  }

  private tripleBeep() {
    /*     marcmod.getAudioMode((result) => {
          console.log("MUSIC VOL" + result);
        }); */
    /*     let interval = 0;
        let intervalId = setInterval(() => {
          if (interval === 0 || interval === 2) {
            this.sound_1.stop();
            this.sound_1.rate(1.5);
            this.sound_1.play();
          } else if (interval === 1) {
            this.sound_1.stop();
            this.sound_1.rate(.5);
            this.sound_1.play();
          }
          (interval === 2) ? clearInterval(intervalId) : interval++;
        }, 250); */
  }

  private completeBeep() {
    /*     let interval = 0;
        let intervalId = setInterval(() => {
          this.sound_1.stop();
          this.sound_1.rate(1);
          this.sound_1.play();
          (interval === 50) ? clearInterval(intervalId) : interval++;
        }, 150); */
  }
}
