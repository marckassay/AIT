# Install

## Last known successful install

 ```shell
Remove-Item .\node_modules\, .\platforms\, .\plugins\, .\www\ -Force -Recurse
npm install
ionic cordova build android
ionic cordova build android --save
adb install -r platforms\android\app\build\outputs\apk\debug\app-debug.apk
ionic cordova plugin remove cordova-plugin-lottie-splashscreen
ionic cordova plugin list
ionic cordova plugin add cordova-plugin-lottie-splashscreen --save
ionic cordova build android
adb install -r platforms\android\app\build\outputs\apk\debug\app-debug.apk
npm run fix
ionic cordova build android --prod --release --buildConfig=temp/build.json
adb install -r platforms\android\app\build\outputs\apk\release\app-release.apk
```
