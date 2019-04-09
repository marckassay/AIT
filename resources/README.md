# Resource How-Tos

- Remove and add platform without Ionic generating icons:

```shell
ionic cordova platform remove android
ionic cordova platform add android --no-resources
```

- Edit config.xml is someway related to icons. Perhaps that will force a change.

## How to set SplashScreen

```shell
node plugins/cordova-plugin-lottie-splashscreen/hooks/android/copy_build_extras.js
ionic cordova plugin add cordova-plugin-lottie-splashscreen
```

When building apk, disregard the CLI output message that starts with:

  "Explanation for issues of type "MissingDefaultResource":"

## How to Generate Icons for Ionic for Android

The gist of this procedure is to use Android Studio to genrate icons and then to copy those files into
this Ionic project's `resources/android` directory.

- Step Zero

  - What I did:

    - I used Android Studio
      - Because I wanted to use software that is updated to prevent version alignment issues.

  - What I didn't do:

    - I did't used [AndroidAssetStudio](https://romannurik.github.io/AndroidAssetStudio/)
      - Because I want to avoid risk of using outdated software/service in this procedure

    - I did't use `ionic cordova resources`
      - Because I want to avoid risk of using outdated software/service in this procedure

- Step One

  - What I did:

    - Created new Android Project with Android Studio

  - What I didn't do:

    - I didn't import existing project (Ionic) into Android Studio.
      - Because I'm not familar with importing existing project into Android Studio and avoid any conflicts with existing files.

- Step Two

  - What I did:

    - Used Android Studio's 'Vector Asset' feature
      - Righted click on `app/src/main/res/` to create a vector for my foreground (blue dot)
      - Name it unique to reference in Step Three

  - What I didn't do:

    - I didn't used Android Studio's 'Image Asset' feature
      - Because I couldnt change the color

- Step Three

  - What I did:

    - I used Android Studio's 'Image Asset' feature
      - Righted click on `app/src/main/res/` to create a icons (png and vector)
      - Name it unique to prevent mix-up with the default names.
        - Give unique value for Name, foreground and background
      - Generate files by finishing this 'Image Asset' procedure

- Step Four

  - What I did:

    - Copied all files, excluding `java` folder, from `app/src/main`
    - Pasted these files and folders into `resources/android` folder of this Ionic project.
    - Renamed `res` to `icon`

- Step Five

  - What I did:

    - Modified `config.xml` file
    - change all icon related tags in `<platform>` to:

    ```xml
    <icon background="resources/android/icon/values/ic_ait_launcher_background.xml" density="mdpi" foreground="resources/android/icon/drawable/ic_ait_launcher_foreground.xml" src="resources/android/icon/mipmap-mdpi/ic_ait_launcher.png" />
    <icon background="resources/android/icon/values/ic_ait_launcher_background.xml" density="hdpi" foreground="resources/android/icon/drawable/ic_ait_launcher_foreground.xml" src="resources/android/icon/mipmap-hdpi/ic_ait_launcher.png" />
    <icon background="resources/android/icon/values/ic_ait_launcher_background.xml" density="xhdpi" foreground="resources/android/icon/drawable/ic_ait_launcher_foreground.xml" src="resources/android/icon/mipmap-xhdpi/ic_ait_launcher.png" />
    <icon background="resources/android/icon/values/ic_ait_launcher_background.xml" density="xxhdpi" foreground="resources/android/icon/drawable/ic_ait_launcher_foreground.xml" src="resources/android/icon/mipmap-xxhdpi/ic_ait_launcher.png" />
    <icon background="resources/android/icon/values/ic_ait_launcher_background.xml" density="xxxhdpi" foreground="resources/android/icon/drawable/ic_ait_launcher_foreground.xml" src="resources/android/icon/mipmap-xxxhdpi/ic_ait_launcher.png" />
    ```

- Step Six

  - What I did:

    - Removed previous workaround:

    ```xml
        <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application">
            <application android:icon="@mipmap/ic_launcher" android:roundIcon="@mipmap/ic_launcher_round" />
        </edit-config>
    ```

- Step Seven

  - What i did:

    - excuted `ionic cordova prepare android`
    - then execute `npm run release:device` ('`ionic cordova build android && adb install -r <path-to-apk>`')
