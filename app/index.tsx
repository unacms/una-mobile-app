import { useEffect, useRef, useState } from "react";
import { BackHandler, Platform, StyleSheet, View } from "react-native";
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { WebView, WebViewNavigation } from "react-native-webview";
import BottomTabs from "../components/bottom-tabs";
import Header from "../components/header";
import WebViewContainer from "../components/web-view";
import { ONESIGNAL_APP_ID } from "../constants/settings";
import { WebViewHandlers } from "../types/webview-handlers-type";
import { requestAndroidPermissions } from "../utils/android-permissins-request";

export default function App() {
    const webViewRef = useRef<WebView>(null);

    const [loggedin, setLoggedIn] = useState(false);
    const [title, setTitle] = useState("");
    const [loading, setLoadingState] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);
    const [data, setData] = useState<any>(null);
    const [backButtonEnabled, setBackButtonEnabled] = useState(true);

    // android permissions request
    useEffect(() => {
        requestAndroidPermissions();
    }, []);

    // OneSignal initialization
    useEffect(() => {        
        OneSignal.Debug.setLogLevel(LogLevel.Verbose);
        OneSignal.setConsentRequired(true);
        OneSignal.initialize(ONESIGNAL_APP_ID);

        OneSignal.Notifications.addEventListener('click', (event:any) => {
            console.log('OneSignal: notification clicked:', event);
            const url = event.notification?.additionalData?.url;
            if (url && webViewRef.current) {
                webViewRef.current.injectJavaScript(`window.location = '${url}';`);
            }            
        });
    }, []);

    // Android hardware back button
    useEffect(() => {        
        let backHandler: any;
        if (Platform.OS === "android") {
            backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
                if (backButtonEnabled && webViewRef.current) {
                    webViewRef.current.goBack();
                    return true;
                }
                return false;
            });
        }

        // cleanup
        return () => {
            if (Platform.OS === "android" && backHandler) {
                backHandler.remove();
            }
        };
    }, [backButtonEnabled]);

    // Handle navigation changes 
    const handleNavChange = (nav: WebViewNavigation) => {
        setCanGoBack(nav.canGoBack);
        setTitle(nav.title || ""); // replaced with 'handleTitleChange'
    };

    // All WebViewHandlers
    const webViewHandlers: WebViewHandlers = {      
        setLoading: (b:boolean) => {
            setLoadingState(b);
        },
        setData,
        setLoggedIn,
        onVideoCallStart: (uri, audio) => {
            console.log("Video call start:", uri, audio);
            // Add your actual video call logic here
        },
        endVideoCall: () => {
            console.log("Video call stop");
        },
        onRequestPurchase: (payload) => {
            console.log("Purchase request:", payload);
        },
        onRequestSubscription: (payload) => {
            console.log("Subscription request:", payload);
        },
        onHomeMenu: () => {
            console.log("Goto home");
            webViewRef.current?.reload(); // Example: reload home page
        },
        reload: () => {
            webViewRef.current?.reload();
        },
        onStateChange: handleNavChange,
        onLoadProgress: (progress) => setLoadingState(progress < 1),
        //onTitleChange: (newTitle) => setTitle(newTitle),
    };

    return (
      <View style={styles.container}>
        <Header
          title={title}
          loading={loading}
          canGoBack={canGoBack}
          onBack={() => webViewRef.current?.goBack()}
        />

        <WebViewContainer
          ref={webViewRef}
          {...webViewHandlers}
        />

        {loggedin === true && (
          <BottomTabs webViewRef={webViewRef} data={data} />
        )}
      </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

/*
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
*/