import * as spawnAsync from '@expo/spawn-async';

let deployToDeviceSwitch = false;

async function call(command: string) {
    let resultPromise = spawnAsync(command);
    let spawnedChildProcess = resultPromise.child;
    spawnedChildProcess.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    spawnedChildProcess.stderr.on('data', (data) => {
        console.error(`${data}`);
    });
    try {
        let {
            pid,
            stdout,
            stderr,
            status,
            signal,
        } = await resultPromise;
    } catch (e) {
        console.error(e.stack);
        // The error object also has the same properties as the result object
    }
};

(async function () {
    for (let j = 0; j < process.argv.length; j++) {
        if (process.argv[j] === '--device') {
            deployToDeviceSwitch = true;
        }
    }

    await call('ionic cordova build android --prod --release --buildConfig=temp/build.json');

    if (deployToDeviceSwitch) {
        await call('adb install -r ./platforms/android/app/build/outputs/apk/release/app-release.apk');
    }
})();