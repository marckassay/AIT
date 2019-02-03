import { Injectable } from '@angular/core';
import { Brightness } from '@ionic-native/brightness/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BehaviorSubject } from 'rxjs';

import { StorageDefaultData } from './storage/ait-storage.defaultdata';
import { AITStorage } from './storage/ait-storage.service';
import { AppStorageData, BrightnessSet } from './storage/ait-storage.shapes';

export class BrightnessUtil {
  static convertToDeviceBrightnessNumber(value: BrightnessSet): number {
    return (value / 100) as number;
  }

  static reverseSign(value: BrightnessSet): BrightnessSet {
    return (value * -1) as BrightnessSet;
  }

  static absolute(value: BrightnessSet): BrightnessSet {
    return Math.abs(value as number) as BrightnessSet;
  }
}

/**
 * Sets ait's 'brightness' data field [-100,100] in intervals of tens. This value is stored as-is
 * however the device's brightness value uses a different numbering set. The following is their
 * statement:
 *
 *  "A value of less than 0, the default, means to use the preferred screen brightness. 0 to 1
 * adjusts the brightness from dark to full bright."
 *
 * If ait's 'brightness' value is -100, it means that the default value is being used. The default
 * value is having this brightness feature disabled. If the value is between [10, 100], it means the
 * brightness feature is enabled. In so many words, apps will never know what brightness value the
 * user has the device brightness set to. Hence the term 'brightnessOffset' is used versus 'brightness'
 * which implies an absolute value.
 *
 * When ait is no longer active app and its brightness feature is enabled, the device will return
 * to its default value. This is done by Android and not AiT.
 */
@Injectable()
export class ScreenService {
  private _data: AppStorageData;
  public get data(): AppStorageData {
    return this._data;
  }
  public set data(value: AppStorageData) {
    this._data = value;
  }

  private subject: BehaviorSubject<AppStorageData>;

  constructor(
    private brightness: Brightness,
    private statusBar: StatusBar,
    private splash: SplashScreen,
    private storage: AITStorage) { }

  onInit(): void {
    if (this.data === undefined) {
      // "lock" data to prevent any others in here
      this.data = null;
      this.storage.getPromiseSubject<AppStorageData>(StorageDefaultData.APP_ID)
        .then((val) => {
          this.subject = val;
          this.subject.subscribe((data) => { this.data = data; });
        });
    }
  }

  initScreen(): void {
    this.splash.hide();
  }

  setScreenToRunningMode(value: boolean): void {
    this.setKeepScreenOn(value);
    this.showStatusBar(!value);
    if (value) {
      this.applyBrightnessOffset();
    } else {
      this.revertBrightnessOffset();
    }
  }

  /**
   * Retrieves ait's 'brightness' data field and if its defined (greater than 0), it will set the
   * device's brightness to that value.
   */
  private applyBrightnessOffset(): void {
    const lastBrightnessValue = this.data.brightness;
    if (lastBrightnessValue > 0) {
      this.brightness.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(lastBrightnessValue));
    }
  }

  /**
   * Sets the device's API brightness to -1, to remove our offset (if any) and return to the
   * brightness value prior to AiT being launched.
   */
  private revertBrightnessOffset(): void {
    this.brightness.setBrightness(-1);
  }

  private setKeepScreenOn(value: boolean): void {
    this.brightness.setKeepScreenOn(value);
  }

  private showStatusBar(value: boolean): void {
    (value === true) ? this.statusBar.show() : this.statusBar.hide();
  }
}
