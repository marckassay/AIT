import { Injectable } from '@angular/core';
import { Brightness } from '@ionic-native/brightness/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AITStorage } from './storage/ait-storage.service';
import { BrightnessSet } from './storage/ait-storage.shapes';

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

  constructor(
    private brightness: Brightness,
    private orientation: ScreenOrientation,
    private statusBar: StatusBar,
    private splash: SplashScreen,
    private storage: AITStorage) { }

  /**
   * Sets the BrightnessSet value that the user has choosen. This value will be mapped to
   * DeviceBrightnessSet so that it will be available to be read by the device.
   *
   * @param value Any positive number enables ait's brightness feature, while any negative number
   *              disables it.
   */
  storeBrightnessOffset(): void {

    /*     const store = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID, true);

        store.promise.then((val) => {
          if (val.brightness !== value) {
            val.brightness = value;
          }

          store.subject.next(val);

          if (apply === true) {
            this.display.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(value));
          }
        }); */
  }

  retrieveBrightnessOffset(): any {
    /*
        const store = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID, true);

        return store.promise.then((value): BrightnessSet => {
          return value.brightness;
        }); */
  }

  /**
   * Retrieves ait's 'brightness' data field and if its defined (greater than 0), it will set the
   * device's brightness to that value.
   */
  applyBrightnessOffset(): void {
    /*     const store = this.storage.getPagePromiseAndSubject2<AppStorageData>(StorageDefaultData.APP_ID, true);

        store.promise.then((value) => {
          const lastBrightnessValue: BrightnessSet = value.brightness;
          if (lastBrightnessValue > 0) {
            this.display.setBrightness(BrightnessUtil.convertToDeviceBrightnessNumber(lastBrightnessValue));
          }
        }); */
  }

  /**
   * Sets the device's API brightness to -1, to remove our offset (if any) and return to the
   * brightness value prior to AiT being launched. Calling this method doesn't modify app's storage.
   */
  removeBrightnessOffset(): void {
    this.brightness.setBrightness(-1);
  }

  setKeepScreenOn(value: boolean): void {
    this.brightness.setKeepScreenOn(value);
  }

  showStatusBar(value: boolean): void {
    (value) ? this.statusBar.hide() : this.statusBar.show();
  }

  initScreen(): void {
    this.statusBar.styleDefault();
    this.splash.hide();
  }
}
