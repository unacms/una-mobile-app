#!/bin/bash

SED="gsed"
DOMAIN="kookaburra.com"
URL="https://${DOMAIN}/"
TITLE="Kookaburra"
NAME="kookaburra"
PACKAGE="com.kookaburra.app"
PACKAGE2="kookaburra"
PACKAGE3="app"


${SED} -r -i "s%const BASE_URL = '(.*?)';%const BASE_URL = '${URL}';%g" ./App.js
${SED} -r -i "s%const TITLE = '(.*?)';%const TITLE = '${TITLE}';%g" ./App.js


${SED} -r -i "s%\"name\": \"(.*?)\",%\"name\": \"${NAME}\",%g" ./app.json
${SED} -r -i "s%\"displayName\": \"(.*?)\"%\"displayName\": \"${TITLE}\"%g" ./app.json


${SED} -r -i "s%\"name\": \"(.*?)\",%\"name\": \"${NAME}\",%g" ./package.json


${SED} -r -i "s%target '([a-z0-9]+)-tvOSTests' do%target '${NAME}-tvOSTests' do%g" ./ios/Podfile
${SED} -r -i "s%target '([a-z0-9]+)-tvOS' do%target '${NAME}-tvOS' do%g" ./ios/Podfile
${SED} -r -i "s%target '([a-z0-9]+)Tests' do%target '${NAME}Tests' do%g" ./ios/Podfile
${SED} -r -i "s%target '([a-z0-9]+)' do%target '${NAME}' do%g" ./ios/Podfile


${SED} -r -i "s%moduleName:@\"([a-z0-9]+)\"%moduleName:@\"${NAME}\"%g" ./ios/una/AppDelegate.m


${SED} -r -i "s%<string name=\"app_name\">(.*?)</string>%<string name=\"app_name\">${TITLE}</string>%g" ./android/app/src/main/res/values/strings.xml


p2=$(ls android/app/src/main/java/com)
p3=$(ls android/app/src/main/java/com/${p2})

${SED} -r -i "s%package ([a-z0-9\.]+);%package ${PACKAGE};%g" ./android/app/src/main/java/com/${p2}/${p3}/MainActivity.java
${SED} -r -i "s%    return \"([a-z0-9]+)\";%    return \"${NAME}\";%g" ./android/app/src/main/java/com/${p2}/${p3}/MainActivity.java

${SED} -r -i "s%package ([a-z0-9\.]+);%package ${PACKAGE};%g" ./android/app/src/main/java/com/${p2}/${p3}/MainApplication.java
${SED} -r -i "s%com.([a-z0-9]+).ReactNativeFlipper%com.${PACKAGE2}.ReactNativeFlipper%g" ./android/app/src/main/java/com/${p2}/${p3}/MainApplication.java

mv ./android/app/src/main/java/com/${p2}/${p3} ./android/app/src/main/java/com/${p2}/${PACKAGE3}
mv ./android/app/src/main/java/com/${p2} ./android/app/src/main/java/com/${PACKAGE2}


${SED} -r -i "s%package=\"([a-z0-9\.]+)\"%package=\"${PACKAGE}\"%g" ./android/app/src/main/AndroidManifest.xml
${SED} -r -i "s%android:label=\"(.*?)\"%android:label=\"${TITLE}\"%g" ./android/app/src/main/AndroidManifest.xml
${SED} -r -i "s%android:host=\"(.*?)\"%android:host=\"${DOMAIN}\"%g" ./android/app/src/main/AndroidManifest.xml


${SED} -r -i "s%package = \"([a-z0-9\.]+)\"%package = \"${PACKAGE}\"%g" ./android/app/_BUCK


${SED} -r -i "s%applicationId \"([a-z0-9\.]+)\"%applicationId \"${PACKAGE}\"%g" ./android/app/build.gradle


echo "Basic rebranding has been completed, please proceed with manual changes in XCode and grpahics changing..."

