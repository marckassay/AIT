import { IonicNativePlugin } from '@ionic-native/core';

// tslint:disable-next-line: ordered-imports
import { AndroidSystemUiFlags } from '@ionic-native/android-full-screen/ngx';

export class AndroidFullScreenMock extends IonicNativePlugin {
    /**
     * Is this plugin supported?
     * @return {Promise<void>}
     */
    isSupported(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Is immersive mode supported?
     * @return {Promise<void>}
     */
    isImmersiveModeSupported(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * The width of the screen in immersive mode.
     * @return {Promise<number>}
     */
    immersiveWidth(): Promise<number> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(500), 250);
        });
    }
    /**
     * The height of the screen in immersive mode.
     * @return {Promise<number>}
     */
    immersiveHeight(): Promise<number> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(500), 250);
        });
    }
    /**
     * Hide system UI until user interacts.
     * @return {Promise<void>}
     */
    leanMode(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Show system UI.
     * @return {Promise<void>}
     */
    showSystemUI(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Extend your app underneath the status bar (Android 4.4+ only).
     * @return {Promise<void>}
     */
    showUnderStatusBar(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Extend your app underneath the system UI (Android 4.4+ only).
     * @return {Promise<void>}
     */
    showUnderSystemUI(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Hide system UI and keep it hidden (Android 4.4+ only).
     * @return {Promise<void>}
     */
    immersiveMode(): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
    /**
     * Manually set the the system UI to a custom mode. This mirrors the Android method of the same name. (Android 4.4+ only).
     * @see https://developer.android.com/reference/android/view/View.html#setSystemUiVisibility(int)
     * @param {AndroidSystemUiFlags} visibility Bitwise-OR of flags in AndroidSystemUiFlags
     * @return {Promise<void>}
     */
    setSystemUiVisibility(visibility: AndroidSystemUiFlags): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout(() => resolve(), 250);
        });
    }
}
