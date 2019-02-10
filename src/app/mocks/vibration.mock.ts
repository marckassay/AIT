import { IonicNativePlugin } from '@ionic-native/core';

export class VibrationMock extends IonicNativePlugin {
    /**
     * Vibrates the device for given amount of time.
     *
     * @param time {number|number[]} Milliseconds to vibrate the device. If passed an array of
     * numbers, it will define a vibration pattern. Pass 0 to stop any vibration immediately.
     */
    vibrate(time: number | number[]): void {

    }
}
