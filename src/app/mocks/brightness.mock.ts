import { Injectable } from '@angular/core';
import { IonicNativePlugin } from '@ionic-native/core';

@Injectable()
export class BrightnessMock extends IonicNativePlugin {
    /**
     * Sets the brightness of the display.
     *
     * @param {number} value Floating number between 0 and 1 in which case 1 means 100% brightness and 0 means 0% brightness.
     * @returns {Promise<any>} Returns a Promise that resolves if setting brightness was successful.
     */
    setBrightness(value: number): Promise<any> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Reads the current brightness of the device display.
     *
     * @returns {Promise<any>} Returns a Promise that resolves with the
     * brightness value of the device display (floating number between 0 and 1).
     */
    getBrightness(): Promise<any> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Keeps the screen on. Prevents the device from setting the screen to sleep.
     * @param {boolean} value
     */
    setKeepScreenOn(value: boolean): void {
        return;
    }
}
