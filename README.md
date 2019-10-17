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
una => kookaburra
```

In the following files and some files need to be renamed:
```
App.js
app.json
package.json

ios/Podfile
ios/una/AppDelegate.m
ios/winci.xcodeproj/xcshareddata/xcschemes/una.xcscheme => ios/winci.xcodeproj/xcshareddata/xcschemes/kookaburra.xcscheme

android/app/src/main/res/values/strings.xml
android/app/src/main/java/com/una/android/MainActivity.java => android/app/src/main/java/com/kookaburra/android/MainActivity.java
android/app/src/main/java/com/una/android/MainApplication.java => android/app/src/main/java/com/kookaburra/android/MainApplication.java
android/app/src/main/AndroidManifest.xml
android/app/BUCK
android/app/build.gradle
```

In XCode change the following (make sure to open `una.xcworkspace`):

![](https://raw.githubusercontent.com/wiki/unaio/una/images/mobile-apps/change-name-ios.png)


## Change images to your own

Change all images to your own in `/img/` folder, leaving the same images dimensions.  

To change launcher and icons for iOS and Android apps it's recommended to use special script, it can be installed using the following command:
```bash
npm i -D @bam.tech/react-native-make
```

Then you can generate app icons for Android using the following command:
```bash
react-native set-icon --platform android --path ./img/icon-android.png
```

To generate splash for Android, some trick is needed (make sure that you replace Kookaburra with your own app name):  
Change `"name": "kookaburra"` in `package.json` file to `"name": "kookaburra/android"`.   
Then run the following command:  
```bash
react-native set-splash --platform android --path ./img/background.png --resize contain
```
Then change `"name": "kookaburra/android"` back to `"name": "kookaburra"` in `package.json` file.  

Changing splash and app icon for iOS app requires similar trick:  
Change `"name": "kookaburra"` in `package.json` file to `"name": "una"`.   
Then run the following commands:  
```bash
react-native set-icon --platform ios --path ./img/icon.png
react-native set-splash --platform ios --path ./img/background.png --resize contain
```
Then change `"name": "una"` back to `"name": "kookaburra"` in `package.json` file.  


## 3rd-party guides

- https://punya.co.uk/blog/9-development/16-una-mobile-app-development from [cnayl](https://una.io/page/view-persons-profile?id=18944)

