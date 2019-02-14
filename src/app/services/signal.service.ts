/**
    AiT - Another Interval Timer
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
    this.alreadyInformed = false;
    this._data = value;
  }

  private MP3 = 'beep';
  private subject: BehaviorSubject<AppStorageData>;

  /**
   * If the DO_NOT_DISTURB error occurs this is set to true, which is only set back to false when
   * the `data` property has changed. Intention with this boolean flag to prevent annoying the user
   */
  private alreadyInformed: boolean;
  private audioModePriorToChange: number | undefined;
  private volumePriorToChange: number | undefined;

  constructor(
    private vibration: Vibration,
    private sound: NativeAudio,
    public audioman: AudioManagement,
    private storage: AITStorage,
    private toastCtrl: ToastController) {
    // if app.module has 'useClass' prop set to the mock version which has storage, then set it
    if ('storage' in audioman) {
      (audioman as any).storage = this.storage;
    }
  }

  onInit(): void {
    if (this.data === undefined) {
      // "lock" data to prevent any others in here
      this.data = null;
      this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
        .then((val) => {
          this.subject = val;
          this.subject.subscribe((data) => { this.data = data; });
        })
        .then(() => {
          this.sound.preloadSimple(this.MP3, 'assets/sounds/beep.mp3');
        });
    }
  }

  /**
   * Called from app-settings page when 'remember alarm level' toggle is checked. In order to get
   * volume, it needs to set the audiomode to NORMAL. After that is set, it will retrieve device
   * volume for MUSIC and store it into AIT settings.
   */
  async storeCurrentDeviceVolume(): Promise<void> {
    await this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL);
    await this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
      .then((result) => {
        this.data.sound = result.volume as VolumeSet;
        this.subject.next(this.data);
      });
  }

  /**
   * Applies previous sound volume setting. This is intended to be called when the timer is entering
   * into its active state. And called after timer is active with `value` as `false` to revert the
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
  async enablePreferredVolume(value: boolean): Promise<void> {
    if (value && this.data.sound > 0) {

      // get the device's audio mode and if needed adjust it to the value of AudioMode.NORMAL
      await this.audioman.getAudioMode()
        .then((val) => {
          this.audioModePriorToChange = val.audioMode;
        });
      if (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL) {
        await this.audioman.setAudioMode(AudioManagement.AudioMode.NORMAL)
          .catch((reason) => {
            if (reason.search('Do Not Disturb')) {
              if (this.alreadyInformed === false) {
                this.alreadyInformed = true;
                this.inform();
                return Promise.reject('DO_NOT_DISTURB');
              }
            }
          });
      }

      // get the device's volume and if needed adjust it to data.sound
      await this.audioman.getVolume(AudioManagement.VolumeType.MUSIC)
        .then((val) => {
          this.volumePriorToChange = val.volume;
        });

      if (this.volumePriorToChange !== this.data.sound) {
        await this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.data.sound);
      }

    } else if (value === false) {
      // revert audio settings to what they were prior to running timer
      if (this.audioModePriorToChange && (this.audioModePriorToChange !== AudioManagement.AudioMode.NORMAL)) {
        await this.audioman.setAudioMode(this.audioModePriorToChange);
        this.audioModePriorToChange = undefined;
      }

      if (this.volumePriorToChange && (this.volumePriorToChange > 0)) {
        await this.audioman.setVolume(AudioManagement.VolumeType.MUSIC, this.volumePriorToChange);
        this.volumePriorToChange = undefined;
      }
    }
  }

  single(): void {
    if (this.data.sound !== 0) { this.loopBeep(1); }
    if (this.data.vibrate) { this.loopVibrate(1); }
  }

  double(): void {
    if (this.data.sound !== 0) { this.loopBeep(2); }
    if (this.data.vibrate) { this.loopVibrate(2); }
  }

  completed(): void {
    if (this.data.vibrate) { this.loopVibrate(33); }
    if (this.data.sound !== 0) { this.loopBeep(33); }
  }

  private loopVibrate(intervals: number): void {
    this.vibration.vibrate(Array(intervals).fill(125));
  }

  private async loopBeep(intervals: number): Promise<void> {
    let interval = 1;
    const loop = async (): Promise<void> => {
      if (interval <= intervals) {
        interval++;
        await this.sound.play(this.MP3, loop);
      }
    };
    await loop();
  }

  async inform(): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: 'AiT is not allowed to change device\'s \'Do Not Disturb\' state. ' +
        'Go to \'AiT Settings\' page and adjust accordingly if needed. Or change notification state.',
      duration: 10000,
      showCloseButton: true,
      position: 'top'
    });

    toast.present();
  }
}
