import * as spawnAsync from '@expo/spawn-async';
import { pathExists, remove } from 'fs-extra';

/**
 * The `json` file that contains a path to `.keystore` file. This `json` file also needs passwords
 * since nodejs when spawned doesnt prompt user for password (at least that seems to be the case).
 *
 * Below is what is expected:
```
{
  "android": {
    "debug": {
      "keystore": "C:\\Users\\marck\\.android\\debug.keystore",
      "storePassword": "android",
      "alias": "androiddebugkey",
      "password": "android",
      "keystoreType": ""
    },
    "release": {
      "keystore": "C:\\MTK-mobileapps.keystore",
      "storePassword": "123abc",
      "alias": "MTKmobileapps",
      "password": "123abc",
      "keystoreType": ""
    }
  }
}
```
 */
const buildFilePath = 'temp/build.json';

/**
 * After a build this artifact destroyed since credentials are writen in it.
 */
const releaseSigningArtifact = './platforms/android/release-signing.properties';

/**
 * If true `--release` switch is used, otherwize `--debug` switch will be used
 */
let releaseBuildSwitch = false;

/**
 * Deploys apk to the connected phone
 */
let deployToDeviceSwitch = false;

/**
 * Asynchronous spawns a CLI command. This is function is copied from `spawn-async` homepage example.
 *
 * @param command same as if typed in the CLI
 */
async function call(command: string): Promise<number> {
    console.log('[ait] scripts/apk.ts:', command);
    const resultPromise = spawnAsync(command);
    const spawnedChildProcess = resultPromise.child;

    spawnedChildProcess.stdout.on('data', (data) => {
        console.log(`${data}`);
    });

    spawnedChildProcess.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    try {
        await resultPromise;
        return 0;
    } catch (e) {
        console.error(e.stack);
        // The error object also has the same properties as the result object
        return 1;
    }
}

(async function (): Promise<void> {
    const buildFileExists = await pathExists(buildFilePath);
    if (buildFileExists) {
        for (let j = 0; j < process.argv.length; j++) {
            if (process.argv[j] === '--release') {
                releaseBuildSwitch = true;
            } else if (process.argv[j] === '--device') {
                deployToDeviceSwitch = true;
            }
        }

        if (releaseBuildSwitch) {
            const status = await call('ionic cordova build android --prod --release --buildConfig=' + buildFilePath);

            if (status === 0 && deployToDeviceSwitch) {
                await call('adb install -r ./platforms/android/app/build/outputs/apk/release/app-release.apk');
            }

        } else {
            const status = await call('ionic cordova build android --debug');

            if (status === 0 && deployToDeviceSwitch) {
                await call('adb install -r ./platforms/android/app/build/outputs/apk/debug/app-debug.apk');
            }
        }


        if (releaseBuildSwitch) {
            try {
                const artifactExits = await pathExists(releaseSigningArtifact);
                if (artifactExits) {
                    console.log('Deleting Build Artifact');
                    await remove(releaseSigningArtifact);
                    console.log('Success');
                    console.log();
                } else {
                    console.log('Unable to find the following file for deletion:', releaseSigningArtifact);
                }
            } catch (err) {
                console.error(err);
            }
        }

    } else {
        console.error('Unable to find the build path:', buildFilePath);
    }
})();
