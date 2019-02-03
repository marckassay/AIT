import { Injectable } from '@angular/core';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { StorageDefaultData } from './storage/ait-storage.defaultdata';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData } from './storage/ait-storage.shapes';

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
    if (this.data.sound !== 0) { this.singleBeep(); }
    if (this.data.vibrate) { this.singleVibrate(); }
  }

  double(): void {
    if (this.data.sound !== 0) { this.tripleBeep(); }
    if (this.data.vibrate) { this.doubleVibrate(); }
  }

  triple(): void {
    if (this.data.sound !== 0) { this.completeBeep(); }
    if (this.data.vibrate) { this.tripleVibrate(); }
  }

  private singleVibrate(): void {
    this.vibration.vibrate(500);
  }

  private doubleVibrate(): void {
    this.vibration.vibrate([500, 500, 500]);
  }

  private tripleVibrate(): void {
    this.vibration.vibrate([1000, 500, 1000]);
  }

  private async singleBeep(): Promise<void> {
    await this.sound.play(this.MP3);
  }

  private async tripleBeep(): Promise<void> {
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
  }

  private async completeBeep(): Promise<void> {
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
    await this.sound.play(this.MP3);
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
