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
  audioModePriorToChange: number | undefined;
  musicVolumePriorToChange: number | undefined;

  private _data: AppStorageData;
  public get data(): AppStorageData {
    return this._data;
  }
  public set data(value: AppStorageData) {
    this._data = value;
  }

  constructor(public vibration: Vibration,
    public audioman: AudioManagement,
    public storage: AITStorage) {
    this.storage.getPagePromise<AppStorageData>(StorageDefaultData.APP_ID).then((value) => {
      this.data = value;
    });
  }

  /**
   * Enables by applying previous sound volume. This is currently called only when the timer is in
   * its active state. And called with `value` being `false` when timer is no longer in active
   * state.
   *
   * When the `value` is `true` and sounds for the app are enabled (`this.data.sound > 0`), it will
   * get the device's current audiomode (getAudioMode()), store that value by setting
   * `audiomodePriorToChange` and set the device's audiomode (via setAudioMode()) to
   * `AudioMode.Normal`.
   *
   * When the `value` is `false`, it will revert the settings that were done when called with the
   * `value` of `true`. This is done using the `audioModePriorToChange` and
   * `musicVolumePriorToChange`.
   *
   * @param value indicates if it should be enabled or disabled.
   */
  enable(value: boolean): Promise<void> {
    if (value && this.data.sound > 0) {
      return this.audioman.getAudioMode()
        .then((value) => {
          this.audioModePriorToChange = value.mode;
          if (this.audioModePriorToChange !== AudioManagement.AudioMode.Normal) {
            return this.audioman.setAudioMode(AudioManagement.AudioMode.Normal);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          this.audioman.getVolume(AudioManagement.VolumeType.Music)
            .then((value) => {
              this.musicVolumePriorToChange = value.volume;
              return Promise.resolve();
            });
        })
        .then(() => {
          if (this.musicVolumePriorToChange !== this.data.sound) {
            this.audioman.setVolume(AudioManagement.VolumeType.Music, this.data.sound)
              .then(() => {
                console.log("AudioManagement restored Music volume to previous session value.");
                return Promise.resolve();
              });
          } else {
            return Promise.resolve();
          }
        })
        .catch((reason) => {
          return Promise.reject(reason);
        });
    } else if (!value) {
      return Promise.resolve(this.audioModePriorToChange && (this.audioModePriorToChange !== AudioManagement.AudioMode.Normal))
        .then((value) => {
          if (value) {
            return this.audioman.setAudioMode(this.audioModePriorToChange);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          if (this.musicVolumePriorToChange && (this.musicVolumePriorToChange > 0)) {
            return this.audioman.setVolume(AudioManagement.VolumeType.Music, this.musicVolumePriorToChange);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          this.audioModePriorToChange = undefined;
          this.musicVolumePriorToChange = undefined;
          return Promise.resolve();
        })
        .catch((reason) => {
          return Promise.reject(reason);
        });
    }
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
