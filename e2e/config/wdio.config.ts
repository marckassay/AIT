import { join } from 'path';
import { Config } from '@wdio/sync';

/**
 * @ref https://github.com/webdriverio/webdriverio/blob/master/docs/Options.md
 * @ref https://webdriver.io/docs/configurationfile.html
 */
declare interface AppiumConfig extends Config {
    capabilities?: AppiumCapabilities[];
    specFileRetries?: number;
    /**
     * Not sure if this is property is implemented, but just in case. Followed example:
     *
     * https://github.com/webdriverio/appium-boilerplate/blob/master/config/wdio.shared.conf.js
     */
    sync?: boolean;
    debug?: boolean;
    deprecationWarnings: boolean;
}

// TODO: convert to generic, ambient, or mixin... noReset, fullReset are mutually exclusive
/**
 * @ref https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/caps.md
 */
declare interface AppiumCapabilities extends WebDriver.DesiredCapabilities {
    newCommandTimeout: number;

    /**
     * systemPort used to connect to appium-uiautomator2-server or appium-espresso-driver. The
     * default is 8200 in general and selects one port from 8200 to 8299 for appium-uiautomator2-server,
     * it is 8300 from 8300 to 8399 for appium-espresso-driver. When you run tests in parallel, you
     * must adjust the port to avoid conflicts. Read Parallel Testing Setup Guide for more details.
     */
    systemPort?: number;
    orientation: 'LANDSCAPE' | 'PORTRAIT';
    autoGrantPermissions: boolean;
    deviceName: string;
    noSign: boolean;
    fullReset?: boolean;
    app: string;
    browserName: string;
    appPackage?: string;
    appActivity?: string;
    appWaitPackage?: string;
    appWaitActivity?: string;
    platformVersion: string;
    platformName: string;
    automationName: string;
    noReset?: boolean;
    autoWebview: boolean;
    autoWebviewTimeout: number;
}

export const config: AppiumConfig = {
    port: 4723,
    sync: true,
    debug: true,
    runner: 'local',
    framework: 'jasmine',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 10000,
        stopOnSpecFailure: false
    },
    bail: 0,
    deprecationWarnings: true,
    specFileRetries: 0,
    baseUrl: 'http://localhost:8200/wd/hub/',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    reporters: ['spec'],
    specs: [
        './e2e/src/**/*spec.ts',
    ],
    logLevel: 'debug',
    outputDir: './temp',
    capabilities: [{
        // systemPort: 8201,
        // Name of mobile web browser to automate. Should be an empty string if automating an app instead.
        browserName: '',
        newCommandTimeout: 240,
        noSign: true,
        noReset: true,
        fullReset: false,
        orientation: 'PORTRAIT',
        deviceName: 'PL2GARH860103131',
        platformVersion: '8.1.0',
        platformName: 'Android',
        maxInstances: 1,
        app: join(process.cwd(), './platforms/android/app/build/outputs/apk/debug/app-debug.apk'),
        appPackage: 'io.ionic.starter',
        appActivity: '.MainActivity',
        appWaitPackage: 'io.ionic.starter',
        appWaitActivity: '.MainActivity',
        autoGrantPermissions: true,
        automationName: 'UiAutomator2',
        autoWebview: true,
        autoWebviewTimeout: 4000
    }],
    onPrepare: () => {
        require('ts-node').register({ files: true });
    }
};
