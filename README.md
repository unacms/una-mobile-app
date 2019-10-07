# UNA Mobile Apps

This is source code of UNA mobile apps for iOS and Android based on ReactNative.   
Mobile apps need to have **Nexus** UNA app installed.

## Run

You need to have [npm](https://www.npmjs.com), [react-native](https://facebook.github.io/react-native/) along with [Android SDK](https://developer.android.com/studio) and/or [XCode](https://developer.apple.com/xcode/) along withg [CocoaPods](https://cocoapods.org/) installed to build apps.

After downloading source code, unpacking it, then run:
```bash
npm install 
```
Then you can already try to run Andoid app with the following commands (Android emulator must be already running):
```bash
export ANDROID_HOME=/path/to/android/sdk
react-native run-android
```
or iOS app (on Mac OSX only):
```
cd ios; pod install; cd ..
react-native run-ios --simulator "iPhone 8"
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

In XCode change the following (make sure to open `una.xcworkspace`):

![](https://raw.githubusercontent.com/wiki/unaio/una/images/mobile-apps/change-name-ios.png)

It will change the following files (don't edit these files directly):
```
ios/una/Info.plist
ios/una.xcodeproj/project.xcworkspace/xcuserdata/alex.xcuserdatad/UserInterfaceState.xcuserstate
ios/una.xcodeproj/project.pbxproj
```

## Change images to your own

Change all images to your own in `/img/` folder, leaving the same images dimensions.  

To change launcher and icons for iOS and Android apps it's recommended to use special script, it can installed using the following command:
```bash
npm install -g yo generator-rn-toolbox
```
Then you can generate launcher images using the following commands:
```bash
yo rn-toolbox:assets --splash ./img/background.png --android
yo rn-toolbox:assets --splash ./img/background.png --ios
```

Icons for iOS app can be generated using the following command:
```bash
yo rn-toolbox:assets --icon ./img/icon.png --ios
```

To generate Icons for Android - export project (from `/android/` folder) in Android Studio then:
- Right click on the app/res folder, then click on **New** and then click on **Image Asset**
- In the Icon Type field select **Launcher Icons (Adaptive and Legacy)**
- In the path field, select `logo_android.png` file which is in `/img/` folder
- Once done, click on the **Next** button and then on the **Finish** button

## 3rd-party guides

- from [cnayl](https://una.io/page/view-persons-profile?id=18944) - https://punya.co.uk/blog/9-development/16-una-mobile-app-development 
