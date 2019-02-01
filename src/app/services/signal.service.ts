import { Injectable } from '@angular/core';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import { AudioManagementMock } from '../mocks/audiomanagement.mock';

import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData } from './storage/ait-storage.shapes';

@Injectable()
/**
 * References audio and vibrate features of the device.
 */
export class SignalService {
  audioModePriorToChange: number | undefined;
  volumePriorToChange: number | undefined;

  private _data: AppStorageData;
  public get data(): AppStorageData {
    return this._data;
  }
  public set data(value: AppStorageData) {
    this._data = value;
  }

  audio: AudioManagement;

  constructor(public vibration: Vibration,
    public storage: AITStorage) {
    // since AudioManagement is a dependency for this service, dont simply inject it. Instead
    // instaniate and mutate `audio` instance
    this.audio = new AudioManagementMock() as AudioManagement;
    (this.audio as any).storage = storage;
  }

  /**
   * Applies previous sound volume setting. This is intended to be called when the timer is entering
   * into its active state. And called after timer is active  with `value` as `false` to revert the
   * user's sound mode and volume.
   *
   * When the `value` is `true` and sounds for the app are enabled (`this.data.sound > 0`), it will
   * get the device's current audiomode (getAudioMode()), store that value by setting
   * `audiomodePriorToChange` and set the device's audiomode (via setAudioMode()) to
   * `AudioMode.Normal`.
   *
   * When the `value` is `false`, it will revert the settings that were done when called with
   * `value` of `true`. This is done using the `audioModePriorToChange` and
   * `volumePriorToChange`.
   *
   * @param value indicates if it should be enabled or disabled.
   */
  enable(value: boolean): Promise<void> {
    if (value && this.data.sound > 0) {
      return this.audio.getAudioMode()
        .then((val) => {
          this.audioModePriorToChange = val.audioMode;
          if (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL) {
            return this.audio.setAudioMode(AudioManagement.AudioMode.NORMAL);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          this.audio.getVolume(AudioManagement.VolumeType.MUSIC)
            .then((val) => {
              this.volumePriorToChange = val.volume;
              return Promise.resolve();
            });
        })
        .then(() => {
          if (this.volumePriorToChange !== this.data.sound) {
            this.audio.setVolume(AudioManagement.VolumeType.MUSIC, this.data.sound)
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
            return this.audio.setAudioMode(this.audioModePriorToChange);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          if (this.volumePriorToChange && (this.volumePriorToChange > 0)) {
            return this.audio.setVolume(AudioManagement.VolumeType.MUSIC, this.volumePriorToChange);
          } else {
            return Promise.resolve();
          }
        })
        .then(() => {
          this.audioModePriorToChange = undefined;
          this.volumePriorToChange = undefined;
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
    /*  this.sound_1.stop();
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
