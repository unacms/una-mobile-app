# UNA Mobile Apps

This is source code of UNA mobile apps for iOS and Android based on ReactNative.   
Mobile apps need to have **Nexus** UNA app installed.

## Run

You need to have [Node.js](https://nodejs.org/), [Android SDK](https://developer.android.com/studio) for Android Apps and [XCode](https://developer.apple.com/xcode/) for iOS apps along withg [CocoaPods](https://cocoapods.org/) installed to build apps.

After downloading source code, unpacking it, then run:
```bash
npm install 
```
Then you can already try to run Andoid app with the following commands (Android emulator must be already running):
```bash
export ANDROID_HOME=/path/to/android/sdk
npx react-native run-android
```
or iOS app (on Mac OSX only):
```
cd ios; pod install; cd ..
npx react-native run-ios
```

## Changing display name and bundle identifier

There is `rebrand.sh` script to help with below changes, just change variables in the beginning of the file and run it, or proceed with the manual actions below:

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

android/app/src/main/res/values/strings.xml
android/app/src/main/java/com/una/android/MainActivity.java => android/app/src/main/java/com/kookaburra/android/MainActivity.java
android/app/src/main/java/com/una/android/MainApplication.java => android/app/src/main/java/com/kookaburra/android/MainApplication.java
android/app/src/main/AndroidManifest.xml
android/app/BUCK
android/app/build.gradle
```

In XCode change the following (make sure to open `una.xcworkspace`):

![](https://raw.githubusercontent.com/wiki/unaio/una/images/mobile-apps/change-name-ios.png)

Then rename the following file:
```
ios/kookaburra.xcodeproj/xcshareddata/xcschemes/una.xcscheme => ios/kookaburra.xcodeproj/xcshareddata/xcschemes/kookaburra.xcscheme
```

## Change images to your own

Change all images to your own in `/img/` folder, leaving the same images dimensions.  

To change launcher and icons for iOS and Android apps it's recommended to use special script, it can be installed using the following command:
```bash
npm i -D @bam.tech/react-native-make
```

Then you can generate app icons and splash for Android using the following command:
```bash
npx react-native set-icon --platform android --path ./img/icon-android.png
npx react-native set-splash --platform android --path ./img/background.png --resize contain
```

Before generating splash and app icon of iOS app rename `ios/una` folder to `ios/kookaburra`:
```bash
npx react-native set-icon --platform ios --path ./img/icon.png
npx react-native set-splash --platform ios --path ./img/background.png --resize contain
```
After images are generated rename it back `ios/kookaburra` to `ios/una`.
Then open `kookaburra.xcworkspace` in XCode and add `SplashScreen.storyboard` file to the project to use it as splash.

## 3rd-party guides

- https://punya.co.uk/blog/9-development/16-una-mobile-app-development from [cnayl](https://una.io/page/view-persons-profile?id=18944)

