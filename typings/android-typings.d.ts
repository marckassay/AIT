import { AppiumGeneralCapabilities } from "./appium-typings";

/**
 * This currently is only a "partial interface" with what is defined in the ref link below.
 *
 * @ref ./node_modules/appium-android-driver/build/lib/desired-caps.js
 * @ref https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md#android-only
 */
export interface AndroidCapabilities extends AppiumGeneralCapabilities {
    /**
     * systemPort used to connect to appium-uiautomator2-server or appium-espresso-driver. The
     * default is 8200 in general and selects one port from 8200 to 8299 for appium-uiautomator2-server,
     * it is 8300 from 8300 to 8399 for appium-espresso-driver. When you run tests in parallel, you
     * must adjust the port to avoid conflicts. Read Parallel Testing Setup Guide for more details.
     */
    systemPort?: number;

    /**
     * Have Appium automatically determine which permissions your app requires and grant them to 
     * the app on install. 
     * 
     * Defaults to false. If noReset is true, this capability doesn't work.
     */
    autoGrantPermissions?: boolean;

    /**
     * Skip checking and signing of app with debug keys, will work only with UiAutomator and not 
     * with selendroid.
     * 
     * default false
     */
    noSign: boolean;

    /**
     * Java package of the Android app you want to run. 
     * 
     * By default this capability is received from the package manifest (@package attribute value)
     */
    appPackage: string;

    /**
     * Activity name for the Android activity you want to launch from your package. This often needs
     * to be preceded by a . (e.g., .MainActivity instead of MainActivity). 
     * 
     * By default this capability is received from the package manifest (action: android.intent.action.MAIN , category: android.intent.category.LAUNCHER)
     */
    appActivity: string;

    /**
     * Java package of the Android app you want to wait for. 
     * 
     * By default the value of this capability is the same as for appActivity
     */
    appWaitPackage?: string;

    /**
     * Activity name/names, comma separated, for the Android activity you want to wait for. By 
     * default the value of this capability is the same as for appActivity. You must set it to the 
     * very first focused application activity name in case it is different from the one which is 
     * set as appActivity if your capability has appActivity and appPackage.
     */
    appWaitActivity?: string;

    /**
     * Amount of time to wait for Webview context to become active, in ms. 
     * 
     * defaults to 2000
     */
    autoWebviewTimeout?: number;
}
