import React, { ReactNode } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { WebViewHandlers } from "../types/webview-handlers-type";

/**
 * Render error screen for WebView
 * @param handlers WebViewHandlers to access reload and other functions
 * @param errorDomain error domain provided by WebView
 * @param errorCode error code provided by WebView
 * @param errorDesc error description
 */
export function renderWebViewError(
    handlers: WebViewHandlers,
    errorDomain: any,
    errorCode: any,
    errorDesc: string
): ReactNode {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Oops! Something went wrong.</Text>
            <Text style={styles.errorDesc}>{errorDesc}</Text>
            <Button title="Reload" onPress={handlers.reload} />
        </View>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 9999999,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    errorText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    errorDesc: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
});