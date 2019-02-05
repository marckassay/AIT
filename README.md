# AiT

![AiT](resources\android\adaptiveicon\mipmap-xhdpi\ic_launcher.png)

Another interval timer (AiT) that targets mobile devices for your timing needs. This application has been intended for interval workouts, where there are active and inactive segments. There is a timer and stopwatch mode too.

[![Google Play Badge](resources/android/google-play-badge.png)](https://play.google.com/store/apps/details?id=github.marckassay.ait)

## Install

Below is an example on how to clone, build, and install a release apk on a connected device. Depending on other systems adjustments will be needed.
```shell
git clone https://github.com/marckassay/AIT.git
yarn install
yarn run add-spies
ionic cordova build android --prod --release --buildConfig=temp/build.json
adb install .\\platforms\\android\\app\\build\\outputs\\apk\\release\\app-release.apk
```

## About
This is an Ionic 4 project that is intended to target Android mobile devices.

## Feedback
Use the Issues section for questions, bugs or requests.

## Technical Info

```shell
$ ionic info

Ionic:

   ionic (Ionic CLI)             : 4.6.0
   Ionic Framework               : @ionic/angular 4.0.0-rc.0
   @angular-devkit/build-angular : 0.11.4
   @angular-devkit/schematics    : 7.1.4
   @angular/cli                  : 7.1.4
   @ionic/angular-toolkit        : 1.2.2

Cordova:

   cordova (Cordova CLI) : 8.1.2 (cordova-lib@8.1.1)
   Cordova Platforms     : android 7.1.4
   Cordova Plugins       : cordova-plugin-ionic-keyboard 2.0.5, cordova-plugin-ionic-webview 2.0.0, (and 9 other plugins)

System:

   Android SDK Tools : 26.1.1 (C:\Users\marck\AppData\Local\Android\Sdk)
   NodeJS            : v10.13.0 (C:\Program Files\nodejs\node.exe)
   npm               : 1.10.1
   OS                : Windows 10
```