/**
 * Desired Capabilities are keys and values encoded in a JSON object, sent by Appium clients to the
 * server when a new automation session is requested. They tell the Appium drivers all kinds of important
 *  things about how you want your test to work. Each Appium client builds capabilities in a way
 * specific to the client's language, but at the end of the day, they are sent over to Appium as
 * JSON objects.
 *
 * Some important capabilities are demonstrated in the following example:
 ```typescript
  {
   "platformName": "iOS",
   "platformVersion": "11.0",
   "deviceName": "iPhone 7",
   "automationName": "XCUITest",
   "app": "/path/to/my.app"
  }
 ```
 * This set of Desired Capabilities expresses the desire for Appium to begin an automation session
 * on an iPhone 7 simulator with iOS 11, using the XCUITest Driver, with /path/to/my.app as the app
 * under test.
 *
 * There are many, many Capabilities that Appium supports. Capabilities also differ by driver,
 * though there are a standard set that most drivers pay attention to. What follows are a series of
 * tables outlining the various Desired Capabilities available in general and for specific drivers.
 *
 * @ref https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md
 * @ref http://appium.io/docs/en/writing-running-appium/caps/
 * @ref ./node_modules/webdriver/webdriver.d.ts
 */
export interface AppiumGeneralCapabilities extends WebDriver.DesiredCapabilities {
    /**
     * Which automation engine to use.
     *
     * Appium (default) or Selendroid or UiAutomator2 or Espresso for Android or XCUITest for
     * iOS or YouiEngine for application built with You.i Engine
     */
    automationName: 'Appium' | 'Selendroid' | 'UiAutomator2' | 'Espresso' | 'XCUITest' | 'YouiEngine';

    /**
     * Which mobile OS platform to use.
     */
    platformName: 'iOS' | 'Android' | 'FirefoxOS';

    /**
     * Mobile OS version.
     * 
     * This seems to required *exact match* of what version the phone has installed. May be in 
     * various formats, such as: 
     *  - '8.1.0'
     *  - '9'
     * 
     * But, respectively not in the form of:
     *  - '8.1'
     *  - '9.0.0'
     */
    platformVersion: string;

    /**
     * The kind of mobile device or emulator to use, e.g.; iPhone Simulator, iPad Simulator,
     * iPhone Retina 4-inch, Android Emulator, Galaxy S4, etc...
     *
     * On iOS, this should be one of the valid devices returned by instruments with
     * instruments -s devices.
     *
     * On Android this capability is currently ignored, though it remains
     * required.
     */
    deviceName: string;

    /**
     * The absolute local path or remote http URL to a .ipa file (IOS), .app folder (IOS Simulator),
     * .apk file (Android) or .apks file (Android App Bundle), or a .zip file containing one of
     * these (for .app, the .app folder must be the root of the zip file).
     *
     * Appium will attempt to install this app binary on the appropriate device first.
     *
     * Note that this capability is not required for Android if you specify appPackage and appActivity
     * capabilities (see below).
     *
     * Incompatible with browserName. See here about .apks file.
     */
    app: string;

    /**
     * Name of mobile web browser to automate. Should be an empty string if automating an app instead.
     */
    browserName: 'Safari' | 'Chrome' | 'Chromium' | 'Browser' | '';

    /**
     * How long (in seconds) Appium will wait for a new command from the client before assuming
     * the client quit and ending the session
     */
    newCommandTimeout: number;

    /**
     * Language to set for iOS (XCUITest driver only) and Android
     *
     * e.g. fr
     */
    language?: string;

    /**
     * Locale to set for iOS (XCUITest driver only) and Android. fr_CA format for iOS. CA format
     * (country name abbreviation) for Android.
     *
     * e.g. fr_CA, CA
     */
    locale?: string;

    /**
     * Unique device identifier of the connected physical device
     *
     * e.g. 1ae203187fc012g
     */
    udid?: string;

    /**
     * (Sim/Emu-only) start in a certain orientation
     */
    orientation?: 'LANDSCAPE' | 'PORTRAIT';

    /**
     * Move directly into Webview context.
     *
     * default: false
     */
    autoWebview?: boolean;

    /**
     * Don't reset app state before this session.
     *
     * @ref http://appium.io/docs/en/writing-running-appium/other/reset-strategies/index.html
     */
    noReset?: boolean;

    /**
     * Perform a complete reset.
     *
     * @ref http://appium.io/docs/en/writing-running-appium/other/reset-strategies/index.html
     */
    fullReset?: boolean;

    /**
     * Enable or disable the reporting of the timings for various Appium-internal events (e.g., the
     * start and end of each command, etc.). Defaults to false. To enable, use true. The timings are
     * then reported as events property on response to querying the current session.
     *
     * See the event timing docs for the the structure of this response:
     *
     * @ref http://appium.io/docs/en/advanced-concepts/event-timings/index.html
     */
    eventTimings?: boolean;

    /**
     * (Web and webview only) Enable Chromedriver's (on Android) or Safari's (on iOS) performance
     * logging.
     *
     * default: false
     */
    enablePerformanceLogging?: boolean;

    /**
     * When a find operation fails, print the current page source.
     *
     * default: false
     */
    printPageSourceOnFindFailure?: boolean;
}