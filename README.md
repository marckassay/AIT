# AIT

![AIT](resources/icon.png)

An interval timer designed to be read and heard from a distance.

![AIT's GitHub Feature Graphic](resources/media/readme/1024x350.png)

Another Interval Timer (AIT) that targets devices for your timing needs. This application has been intended for interval activities, where there are active and inactive segments. There is also a timer and stopwatch mode too. Designed by inspiration from tactical racing instruments for yacht racing where such devices are needed to be read just by a glance from a distance.

The 3 timing modes for this application are: Interval, Timer and Stopwatch. Each of these modes has its own setting modes to program its timer and options for audible or warnings.

- About Interval Settings:

  In this menu, you program Interval timer and set audible warnings. In the 'Countdown Audible' section, you can set the option of having an audible at the final: fifteenth, tenth and/or fifth second of the time segment. These options only apply to the active time segment of the interval timer. In an addition, an audible at the second, first and zero second are applied to all active, rest and countdown segments.

‘AIT Settings’ gives you the option to control vibration, sound, brightness, themes and screen orientation.

- About Brightness Feature:

  When the brightness is enabled, you’re telling AIT to remember the desired brightness level to be used when AIT is running an active timer. When you adjust the brightness level by the ‘brightness level’ component, it will adjust the device’s brightness momentary for a couple of seconds. This is intended so you can determine if the level is ideal for the environment where the device will be located. Afterwards the device’s brightness will revert to previous level.

- About Sound Feature:

  Similarly to the brightness feature, the sound or specifically the alarm can be set to be remembered when AIT is running an active timer. When the ‘remember alarm volume’ is enabled, you adjust the level by the ‘alarm volume’ component. You may notice that the device’s volume menu will appear and will set the alarm level you have chosen when the preview alarm is played. Immediately after the alarm is played, it will revert your device to previous level as it only sets the level when the AIT is running an active timer.
  
  If your device, is in the ‘Do Not Disturb’ state while attempting to adjust alarm volume, a notification will appear stating it will not adjust the volume.

## Install

- Option 1:

  [![Google Play Badge](resources/media/readme/google-play-badge.png)](https://play.google.com/store/apps/details?id=github.marckassay.ait)

- Option 2 - Download any of the original APK file and install it with `adb`:

  | AIT APK | MD5 Checksum |
  | ----------- | ----------- |
  | [2.1.9](https://github.com/marckassay/AIT/raw/master/releases/219.apk) | `1C5644579B418CCE154BF28AA4910C27` |
  | [2.1.8](https://github.com/marckassay/AIT/raw/master/releases/218.apk) | `CD7AF99F9E010F470DE8FE743E8C4C79` |
  | [2.1.7](https://github.com/marckassay/AIT/raw/master/releases/217.apk) | `B75BC1F17F1886CDF1D2570CF0143988` |
  | [2.1.6](https://github.com/marckassay/AIT/raw/master/releases/216.apk) | `828467AFA53BEB7A4291242D049627E1` |
  | [2.1.5](https://github.com/marckassay/AIT/raw/master/releases/215.apk) | `F80E7C0B38FC9C2AD09066253B52E07E` |
  | [2.1.4](https://github.com/marckassay/AIT/raw/master/releases/214.apk) | `D5B240CFC0E78BBE23B771AFF43FE646` |
  | [2.1.2](https://github.com/marckassay/AIT/raw/master/releases/212.apk) | `3F7E085AF9CFEBBD9F5E48050B14C958` |
  | [2.1.1](https://github.com/marckassay/AIT/raw/master/releases/211.apk) | `82CBFB75EE4197D93A3D8EFD6BA6ECE8` |

- Option 3 - The shell commands below demonstrates on how to clone, build, and install a release apk on a connected device. As it's being a release build, it would need to be signed by your Google Play private key that needs to be referenced in the build.json file. Removing and adding `cordova-plugin-lottie-splashscreen` is to circumvent an issue that may be limited to my system. Adjustments may be needed depending on your system and/or desires.

  ```shell
  git clone https://github.com/marckassay/AIT.git
  npm install
  ionic cordova build android
  ionic cordova plugin remove cordova-plugin-lottie-splashscreen
  ionic cordova plugin add cordova-plugin-lottie-splashscreen --save
  npm run fix
  ionic cordova build android --prod --release --buildConfig=./build.json
  adb install -r .\platforms\android\app\build\outputs\apk\release\app-release.apk
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

   ionic (Ionic CLI)             : 4.12.0 (C:\Users\marck\AppData\Roaming\nvm\v11.0.0\node_modules\ionic)
   Ionic Framework               : @ionic/angular 4.1.2
   @angular-devkit/build-angular : 0.13.7
   @angular-devkit/schematics    : 7.2.4
   @angular/cli                  : 7.3.7
   @ionic/angular-toolkit        : 1.4.1

Cordova:

   cordova (Cordova CLI) : 9.0.0
   Cordova Platforms     : android 8.0.0
   Cordova Plugins       : cordova-plugin-ionic-webview 3.1.2, (and 9 other plugins)

System:

   Android SDK Tools : 26.1.1 (C:\Users\marck\AppData\Local\Android\Sdk)
   NodeJS            : v11.0.0 (C:\Program Files\nodejs\node.exe)
   npm               : 6.9.0
   OS                : Windows 10

```

```shell
$ ionic cordova plugin list

clovelced-plugin-audiomanagement 1.0.2 "AudioManagement"
cordova-plugin-brightness 0.1.5 "Brightness"
cordova-plugin-device 2.0.2 "Device"
cordova-plugin-fullscreen 1.1.0 "cordova-plugin-fullscreen"
cordova-plugin-ionic-webview 3.1.2 "cordova-plugin-ionic-webview"
cordova-plugin-lottie-splashscreen 0.5.0 "LottieSplashScreen"
cordova-plugin-nativeaudio 3.0.9 "Cordova Native Audio"
cordova-plugin-screen-orientation 3.0.1 "Screen Orientation"
cordova-plugin-vibration 3.1.0 "Vibration"
cordova-plugin-whitelist 1.3.3 "Whitelist"
es6-promise-plugin 4.2.2 "Promise"

```

## Feedback

Use the Issues section for questions, bugs and requests.
