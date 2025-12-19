import { Linking, Platform } from "react-native";
import { EXCEPTION_URLS, UNA_URL } from "../constants/settings";

export function shouldStartLoadWithRequest(event: {
    url: string;
    navigationType?: string;
}): boolean {

    const url = event.url;

    // block blank pages
    if (url === "about:blank") return false;

    // check for exception URLs
    const isException = EXCEPTION_URLS.some(e => {
        url.indexOf(e) !== -1
    });

    // allow internal URLs
    const isInternal = url.indexOf(UNA_URL) !== -1;

    // special Android/iOS conditions
    const isAndroid = Platform.OS === "android";
    const isIosClick = Platform.OS === "ios" && event.navigationType === "click";

    // block & open external URLs
    if ((url.indexOf("http") !== 0 || (!isException && !isInternal && (isAndroid || isIosClick))) 
        || url.indexOf("calendar_sync") !== -1) {

        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.warn("Don't know how to open URI:", url);
                }
            })
            .catch(err => console.warn("Error opening URL:", url, err));

        return false; // prevent WebView from loading
    }

    return true; // allow WebView to load
}