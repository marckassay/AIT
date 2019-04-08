import { join } from 'path';

/**
 * Make sure this value is exact, according to `AppiumGeneralCapabilities.platformVersion` comment.
 *
 * @see AppiumGeneralCapabilities.platformVersion
 */
export const PLATFORM_VERSION = '9';

/**
 * Required, but ignored for Android capabilities.
 *
 * @see AppiumGeneralCapabilities.deviceName
 */
export const DEVICE_NAME = 'PL2GARH860103131';
export const LOG_PATH = join(process.cwd(), './out');

/**
 * The `Path` field is where `ionic cordova build ...` outputs the APK file.
 * The `Package` and `Activity` fields can be determined when app is running on an Android device
 * and executing the following CLI command:
 *  `$ adb shell dumpsys window windows`
 *
 * This CLI command will list all current 'Window' instances on an Android device. Find the app that
 * is to be under test in this list. The data to retrieve will have, for an example, the following
 * format `<Package>/.<Activity>`. For an example:
 *  `github.marckassay.ait/.MainActivity`
 */
export const APP = {
    Path: join(process.cwd(), './platforms/android/app/build/outputs/apk/debug/app-debug.apk'),
    Package: 'github.marckassay.ait',
    Activity: '.MainActivity'
};
