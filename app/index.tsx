import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect, useRef, useState } from "react";
import { BackHandler, Platform, StyleSheet } from "react-native";
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { WebView, WebViewNavigation } from "react-native-webview";
import BottomTabs from "../components/bottom-tabs";
import Header from "../components/header";
import WebViewContainer from "../components/web-view";
import { ONESIGNAL_APP_ID } from "../constants/settings";
import { WebViewHandlers } from "../types/webview-handlers-type";
import { requestAndroidPermissions } from "../utils/android-permissins-request";

export default function App() {
    const colorScheme = useColorScheme();
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThemedView style={styles.container}>
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
      </ThemedView>
      </ThemeProvider>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});