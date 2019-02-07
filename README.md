# AiT

![AiT](resources/icon.png)

Another interval timer (AiT) that targets mobile devices for your timing needs. This application has been intended for interval workouts, where there are active and inactive segments. There is a timer and stopwatch mode too.

![Wall](resources/media/1024x500.png)

[![Google Play Badge](resources/android/google-play-badge.png)](https://play.google.com/store/apps/details?id=github.marckassay.ait)

## Install

The commands below demostrates on how to clone, build, and install a release apk on a connected device. As its being a release build, it would need to be signed by your Google Play private key. Depending on other systems adjustments will be needed.

```shell
git clone https://github.com/marckassay/AIT.git
yarn install
yarn run add-spies
ionic cordova build android --prod --release --buildConfig=temp/build.json
adb install .\\platforms\\android\\app\\build\\outputs\\apk\\release\\app-release.apk
```

As stated above on this webpage, this software is licensed under the

"GNU General Public License v3.0".

## About

This is an Ionic 4 project that is intended to target Android mobile devices. The view framework of choice is Angular 7, which uses RxJS 6. AiT leverages all 3 of these frameworks heavily.

In an addition to those frameworks, I have also developed: a couple of JS modules, a TypeScript typing file and an ionic-native plugin. Below are those contribuations:

- [`sots`](https://github.com/marckassay/sots) - AiT's timer component is powered by this JS module. Developed in TypeScript, utilizing RxJS 5.

- [`spypkg`](https://github.com/marckassay/spypkg) - this was developed out of a slight annoyance fueled by a development challenge. As of now, this is still used and effective. Although, an unepxected change from Cordova can break this modules objective.

- [`audio-management`](https://github.com/ionic-team/ionic-native/tree/master/src/%40ionic-native/plugins/audio-management) - AiT's manages audio mode and volume level for the device via a Cordova plugin developed by [clovelCed](https://github.com/clovelCed). With this plugin I created an ionic-native plugin.

- [`ionic-native-dev-util`](https://github.com/marckassay/ionic-native-dev-util) - To assit in developing ionic-native plugins.

- [`clovelced-plugin-audiomanagement`](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/clovelced-plugin-audiomanagement) - In an addition to creating an ionic-native plugin, a TypeScript typing is now available.

Media content that I created for Google Play, I used Gimp.

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