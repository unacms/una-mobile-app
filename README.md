# UNA Mobile Apps

This is source code of UNA mobile apps for iOS and Android based on ReactNative.

## Run

You need to have npm, react-native along with Android SDK and/or XCode installed to build apps.

After downloading source code, unpacking it, run:
```bash
npm install 
```
Then you can already try to run Andoid app with the following commands (Android emulator must be already running):
```bash
export ANDROID_HOME=/path/to/android/sdk
react-native run-android
```
or iOS app (on Max OSX only):
```
react-native run-ios
```

## Changing display name and bundle identifier

Lest assume that you want to rename app to **Kookaburra** and site name is **kookaburra.io**.   
Then you need to change the following strings:
```
UNA.IO => Kookaburra
com.una.android => com.kookaburra.android
com.una.ios => com.kookaburra.ios
una.io => kookaburra.io
```

In the following files and some files need to be renamed:
```
App.js
app.json

android/app/src/main/res/values/strings.xml
android/app/src/main/java/com/una/android/MainActivity.java => android/app/src/main/java/com/kookaburra/android/MainActivity.java
android/app/src/main/java/com/una/android/MainApplication.java => android/app/src/main/java/com/kookaburra/android/MainApplication.java
android/app/src/main/AndroidManifest.xml
android/app/BUCK
android/app/build.gradle
```

The files below better to not change directly, but change in in XCode instead
TODO: image here


## Change images to your own

Change all images to your own in `/img/` folder, leaving the same images dimensions.  

To change launcher and icons for iOS and Android apps it's recommended to use special script, it can installed using the following command:
```bash
npm install -g yo generator-rn-toolbox
```
Then you can generate launcher images using the following commands from your app folder:
```bash
yo rn-toolbox:assets --splash ./img/background.png --android
yo rn-toolbox:assets --splash ./img/background.png --ios
```

Icons for iOS app can be generated using the following command:
```bash
yo rn-toolbox:assets --icon ./img/icon.png --ios
```

To generate Icons for Android export project (from `/android/` folder) in Android Studio then:
- Right click on the app/res folder, then click on **New** and then click on **Image Asset**
- In the Icon Type field select **Launcher Icons (Adaptive and Legacy)**
- In the path field, select `logo_android.png` file which is in `/img/` folder
- Once done, click on the **Next** button and then on the **Finish** button



