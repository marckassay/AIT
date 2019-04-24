/*
    AIT - Another Interval Timer
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
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppUtils } from '../app.utils';
import { StorageDefaultData } from './storage/ait-storage.defaultdata';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData, VolumeSet } from './storage/ait-storage.shapes';



/**
 * References audio and vibrate features of the device.
 */
@Injectable()
export class SignalService {
  private _data: AppStorageData;
  public get data(): AppStorageData {
    return this._data;
  }
  public set data(value: AppStorageData) {
    this.clearHasBeenInformed();
    this._data = value;
  }

  private MP3 = 'beep';
  private appSubjet: BehaviorSubject<AppStorageData>;

  /**
   * If the DO_NOT_DISTURB error occurs, this is set to true, which is only set back to false when
   * the `clearHasBeenInformed()`. Intention with this boolean flag to prevent annoying the user
   * by overly notifying them. If they wish to proceed running timer with 'Do Not Distrub' enabled,
   * it will bypass vibrate and sounds.
   */
  private hasBeenInformed: boolean;
  private audioModePriorToChange: number | undefined;
  private volumePriorToChange: number | undefined;

  constructor(
    private vibration: Vibration,
    private sound: NativeAudio,
    public audioman: AudioManagement,
    private storage: AITStorage,
    private toastCtrl: ToastController) {
    // audioman mock has storage field to simulate device storage
    if (environment.useMocks) {
      (audioman as any).storage = this.storage;
    }
  }

  onInit(): void {
    if (this.data === undefined) {
      // "lock" data to prevent any others in here
      this.data = null;
      const getPromiseSubject = async (): Promise<void> => {
        await this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
          .then((value) => {
            this.subscribe(value);
          })
          .then(() => {
            this.sound.preloadSimple(this.MP3, 'assets/sounds/beep.mp3');
          });
      };
      getPromiseSubject();
    }
  }

  /**
   * In order to get volume, it needs to set the audiomode to NORMAL. After that is set, it will retrieve device
   * volume for MUSIC and set it into its copy of `AppStorageData`.
   */
  async storeCurrentDeviceVolume(): Promise<void> {
    await this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL);
    await this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
      .then((result) => {
        this.data.sound = result.volume as VolumeSet;
      });
  }

  /**
   * Applies previous sound volume setting. This is intended to be called when the timer is entering
   * into its active state. And called after timer is active with `value` as `false` to revert the
   * user's sound mode and volume.
   *
   * When the `value` is `true` and sounds for the app are enabled (`this.data.sound !== 0`), it will
   * get the device's current audiomode (`getAudioMode()`), store that value by setting
   * `audiomodePriorToChange` and set the device's audiomode (via `setAudioMode()`) to
   * `AudioMode.Normal`, if it isn't already.
   *
   * When the `value` is `false`, it will revert the settings that were done when called with
   * `value` of `true`. This is done using the `audioModePriorToChange` and
   * `volumePriorToChange`.
   *
   * This method is used for when the app has 'remember alarm volume' enabled or disabled.
   *
   * @param value indicates if it should be enabled or disabled.
   */
  async enablePreferredVolume(value: boolean): Promise<void> {
    if ((value === true) && (this.data.sound > 0)) {

      if (this.hasBeenInformed === false) {
        // get the device's audio mode...
        await this.audioman.getAudioMode()
          .then((val) => {
            this.audioModePriorToChange = val.audioMode;
          });

        // ... if needed adjust it to the value of AudioMode.NORMAL
        if (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL) {
          await this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
            .catch((reason) => {
              // this will set `hasBeenInformed`
              return this.settleRejection(reason);
            });
        }
      }

      if (this.hasBeenInformed === false) {
        if (this.data.sound > 0) {
          // get the device's volume...
          await this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
            .then((val) => {
              this.volumePriorToChange = val.volume;
            });
        }

        // ... and if needed adjust it to data.sound
        if (this.volumePriorToChange !== this.data.sound) {
          await this.setMusicVolume(this.data.sound)
            .catch((reason) => {
              return this.settleRejection(reason);
            });
        }
      }
    } else if ((value === false) && (this.data.sound > 0)) {

      if (this.hasBeenInformed === false) {
        // revert audio settings to what device had prior to calling this as: enablePreferredVolume(true)
        if (this.audioModePriorToChange && (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL)) {
          await this.audioman.setAudioMode(this.audioModePriorToChange);
          this.audioModePriorToChange = undefined;
        }

        if (this.volumePriorToChange && (this.volumePriorToChange > 0)) {
          await this.setMusicVolume(this.volumePriorToChange);
          this.volumePriorToChange = undefined;
        }
      } else {
        if (this.audioModePriorToChange) {
          this.audioModePriorToChange = undefined;
        }
        if (this.volumePriorToChange) {
          this.volumePriorToChange = undefined;
        }
      }
    }

    return Promise.resolve();
  }

  clearHasBeenInformed(): void {
    this.hasBeenInformed = false;
  }

  single(): void {
    if (this.hasBeenInformed === false) {
      if (this.data.sound !== 0) { this.loopBeep(1); }
      if (this.data.vibrate) { this.loopVibrate(1); }
    }
  }

  double(): void {
    if (this.hasBeenInformed === false) {
      if (this.data.sound !== 0) { this.loopBeep(2); }
      if (this.data.vibrate) { this.loopVibrate(2); }
    }
  }

  completed(): Promise<[void, void]> {
    let soundPromise = new Promise<void>((resolve): void => resolve());
    let vibratePromise = new Promise<void>((resolve): void => resolve());

    if (this.hasBeenInformed === false) {
      if (this.data.sound !== 0) { soundPromise = this.loopBeep(45); }
      if (this.data.vibrate) { vibratePromise = this.loopVibrate(45); }
    }

    return Promise.all([soundPromise, vibratePromise]);
  }

  private subscribe(value: BehaviorSubject<AppStorageData>): void {
    this.appSubjet = value;
    this.appSubjet.pipe(
      throttleTime(500)
    ).subscribe((val) => {
      // no need to set music volume first emission. and change only when sound property changes
      if (this.data && this.data.sound !== val.sound) {
        this.setMusicVolume(val.sound);
      }
      this.data = val;
    });
  }

  private loopVibrate(intervals: number): Promise<void> {
    const vibratePulse = 125;
    const totalDuration = intervals * vibratePulse;

    this.vibration.vibrate(Array(intervals).fill(vibratePulse));

    return AppUtils.delayPromise(totalDuration);
  }

  private async loopBeep(intervals: number): Promise<void> {
    // this value is roughly the length of `this.MP3` file.
    const beepBurst = 250;
    let interval = 1;
    const totalDuration = intervals * beepBurst;

    const loop = (): void => {
      if (interval <= intervals) {
        interval++;
        // Promise is settling to earlier and NativeAudio seems to be an inactive plugin for 
        // development. Circumventing  this issue by doing the same as its done in loopVibrate(),
        // that is, calculate the totalDuration of the sound sequence.
        // issue: https://github.com/floatinghotpot/cordova-plugin-nativeaudio/issues/147
        this.sound.play(this.MP3, loop);
      }
    };
    loop();

    return AppUtils.delayPromise(totalDuration);
  }

  private async setMusicVolume(value: number): Promise<void> {
    return await this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, value);
  }

  async inform(): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: '\r\nAIT is not allowed to change device\'s \'Do Not Disturb\' state. ' +
        'Go to \'AIT SETTINGS\' page and adjust accordingly if needed. Or change notification state.',
      duration: 10000,
      showCloseButton: true,
      position: 'top'
    });

    toast.present();
  }

  private settleRejection(reason): Promise<AppUtils.DeviceError> {
    if (reason.search('Do Not Disturb')) {
      if (this.hasBeenInformed === false) {
        this.hasBeenInformed = true;
        this.inform();
        return Promise.reject(AppUtils.DeviceError.DO_NOT_DISTURB);
      }
    }

    // if reason is unknown or hasBeenInformed is true, settle with Promise as resolved
    return Promise.resolve(AppUtils.DeviceError.UNKNOWN);
  }
}
