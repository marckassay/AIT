# AIT

![AIT](resources/icon.png)

An interval timer designed to be read and heard from a distance.

![AIT's GitHub Feature Graphic](resources/media/1024x500.png)

Another Interval Timer (AIT) that targets devices for your timing needs. This application has been intended for interval activities, where there are active and inactive segments. There is also a timer and stopwatch mode too. Designed by inspiration from tactical racing instruments for yacht racing where such devices are needed to be read just by a glance from a distance.

The 3 timing modes for this application are: Interval, Timer and Stopwatch. Each of these modes has its own setting modes to program its timer and options for audible or warnings.

‘AIT Settings’ gives you the option to control vibration, sound, brightness, themes and screen orientation.

- About Brightness Feature:

  When the brightness is enabled, you’re telling AIT to remember the desired brightness level to be used when AIT is running an active timer. When you adjust the brightness level by the ‘brightness level’ component, it will adjust the device’s brightness momentary for a couple of seconds. This is intended so you can determine if the level is ideal for the environment where the device will be located. Afterwards the device’s brightness will revert to previous level.

- About Sound Feature:

  Similarly to the brightness feature, the sound or specifically the alarm can be set to be remembered when AIT is running an active timer. When the ‘remember alarm volume’ is enabled, you adjust the level by the ‘alarm volume’ component. You may notice that the device’s volume menu will appear and will set the alarm level you have chosen when the preview alarm is played. Immediately after the alarm is played, it will revert your device to previous level as it only sets the level when the AIT is running an active timer.
If your device, is in the ‘Do Not Disturb’ state while attempting to adjust alarm volume, a notification will appear stating it will not adjust the volume.

[![Google Play Badge](resources/android/google-play-badge.png)](https://play.google.com/store/apps/details?id=github.marckassay.ait)

## Install

The shell commands below demonstrates on how to clone, build, and install a release apk on a connected device. As its being a release build, it would need to be signed by your Google Play private key. Adjustments may be needed depending on your system and/or desires.

```shell
git clone https://github.com/marckassay/AIT.git
yarn install
yarn run add-spies
ionic cordova build android --prod --release --buildConfig=temp/build.json
adb install .\\platforms\\android\\app\\build\\outputs\\apk\\release\\app-release.apk
```

As stated on this webpage, this software is licensed under the "GNU General Public License v3.0".

## About

This is an Ionic 4 project that is intended to target Android mobile devices. The view framework of choice is Angular 7, which uses RxJS 6. AIT leverages all 3 of these frameworks heavily.

In an addition to those frameworks, I have also developed: a couple of JS modules, a TypeScript typing file and an ionic-native plugin. Below are those contributions:

- [`sots`](https://github.com/marckassay/sots) - AIT's timer component is powered by this JS module. Developed in TypeScript, utilizing RxJS 5.

- [`spypkg`](https://github.com/marckassay/spypkg) - this was developed out of slight annoyance of having a specific package manager installed. As of now, this is still used and effective. Although, an unexpected change from Cordova can break this modules objective.

- [`audio-management`](https://github.com/ionic-team/ionic-native/tree/master/src/%40ionic-native/plugins/audio-management) - AIT's manages audio mode and volume level for the device via a Cordova plugin developed by [clovelCed](https://github.com/clovelCed). With this plugin I created an ionic-native plugin to be integrated into AIT.

- [`ionic-native-dev-util`](https://github.com/marckassay/ionic-native-dev-util) - to assist in developing ionic-native plugins.

- [`clovelced-plugin-audiomanagement`](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/clovelced-plugin-audiomanagement) - in an addition to creating an ionic-native plugin, a TypeScript typing is now available for this Cordova plugin.

[GIMP](https://www.gimp.org/) was used for media content that I created for Google Play and GitHub.

## Technical Info

```shell
$ ionic info

Ionic:

  ionic (Ionic CLI)             : 4.10.2
  Ionic Framework               : @ionic/angular 4.0.1
  @angular-devkit/build-angular : 0.13.1
  @angular-devkit/schematics    : 7.3.1
  @angular/cli                  : 7.3.1
  @ionic/angular-toolkit        : 1.3.0

Cordova:

  cordova (Cordova CLI) : 8.1.2 (cordova-lib@8.1.1)
  Cordova Platforms     : android 7.1.4
  Cordova Plugins       : cordova-plugin-ionic-keyboard 2.1.3, cordova-plugin-ionic-webview 3.1.2, (and 9 other plugins)

System:

  Android SDK Tools : 26.1.1 (C:\Users\marck\AppData\Local\Android\Sdk)
  NodeJS            : v10.13.0 (C:\Program Files\nodejs\node.exe)
  yarn              : 1.13.0
  OS                : Windows 10
```

## Feedback

Use the Issues section for questions, bugs or requests.
