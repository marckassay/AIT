import { Injectable } from '@angular/core';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import { StorageDefaultData } from './storage/ait-storage.defaultdata';
import { AppStorageData } from './storage/ait-storage.interfaces';
import { AITStorage } from './storage/ait-storage.service';

@Injectable()
/**
 * References audio and vibrate features of the device.
 */
export class SignalService {
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
    /*     this.storage.getPagePromise<AppStorageData>(StorageDefaultData.APP_ID).then((value) => {
          this.data = value;
        }); */
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
        .then((val) => {
          this.audioModePriorToChange = val.audioMode;
          if (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL) {
            return this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
            .then((val) => {
              this.musicVolumePriorToChange = val.volume;
              return Promise.resolve();
            });
        })
        .then(() => {
          if (this.musicVolumePriorToChange !== this.data.sound) {
            this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.data.sound)
              .then(() => {
                console.log('AudioManagement restored Music volume to previous session value.');
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
      return Promise.resolve(this.audioModePriorToChange && (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL))
        .then((val) => {
          if (val) {
            return this.audioman.setAudioMode(this.audioModePriorToChange);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          if (this.musicVolumePriorToChange && (this.musicVolumePriorToChange > 0)) {
            return this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.musicVolumePriorToChange);
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
