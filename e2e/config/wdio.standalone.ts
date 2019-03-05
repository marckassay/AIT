import { join } from 'path';
// NOTE: this is comment out to prevent tsc server from error
// import { remote } from 'webdriverio';
const remote = (val: any) => val;
/**
 * To be executed via CLI, by calling `wdio.standalone.js` which in-turn, calls this file. Do not
 * pass `wdio.standalone.js` into wdio executable, it will fail. Also, it seems that using the `remote`
 * needs to be imported from `webdriverio` and not `@wdio/sync`.
 *
 * Usage:
 *  `node ./e2e/config/wdio.standalone.js`
 */
(async () => {
    const options: any = {
        port: 4723,
        capabilities: {
            browserName: '',
            newCommandTimeout: 5000,
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
            // if automationName is set to 'Appium', then have autoWebview set to true
            // automationName: 'Appium',
            // autoWebview: true,
            // if automationName is set to 'UiAutomator2', then have autoWebview set to false
            automationName: 'UiAutomator2',
            autoWebview: false,
            autoWebviewTimeout: 10000
        },
        onComplete: function (exitCode, config, capabilities, results) {
            console.log(exitCode, config, capabilities, results);
        }
    };
    const browser = await remote(options);
})().catch((error) => {
    console.error('Standalone failed to start', error.stacktrace);
    process.exit(1);
});



