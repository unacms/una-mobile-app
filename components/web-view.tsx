import { forwardRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { UNA_URL } from "../constants/settings";
import injectedJS from "../injected/webview-injected"; // string, bundled at compile time
import { WebViewHandlers } from "../types/webview-handlers-type";
import { handleWebViewMessage } from "../utils/webview-message-handler";
import { renderWebViewError } from "./web-view-error-screen";
import { shouldStartLoadWithRequest } from "./web-view-load-with-request";

const WebViewContainer = forwardRef<WebView, WebViewHandlers>((handlers, ref) => {
    return (
      <View style={styles.container}>
        <WebView
            ref={ref}
            source={{ uri: UNA_URL }}
            userAgent={"UNAMobileApp/Mobile (" + Platform.OS + ")"}
            injectedJavaScript={injectedJS}

            useWebKit={true}
            allowFileAccess={true}
            startInLoadingState={false}
            setSupportMultipleWindows={false}
            hideKeyboardAccessoryView={true}
            allowsLinkPreview={true}

            javaScriptEnabled
            geolocationEnabled
            domStorageEnabled
            pullToRefreshEnabled // iOS only
            webviewDebuggingEnabled

            onNavigationStateChange={handlers.onStateChange}
            onLoadProgress={(e: any) => handlers.onLoadProgress(e.nativeEvent.progress)}
            onMessage={handleWebViewMessage(handlers)}
            onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
            renderError={(errorDomain, errorCode, errorDesc) =>
                renderWebViewError(handlers, errorDomain, errorCode, errorDesc)
            }
        />
      </View>
    );
  }
);

export default WebViewContainer;

const styles = StyleSheet.create({  
  container: { flex: 1 },
});
