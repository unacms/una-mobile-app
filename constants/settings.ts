
// base URL for the UNA mobile app
export const UNA_URL = "https://ci.una.io/test";

// OneSignal App ID for push notifications
export const ONESIGNAL_APP_ID = "";

// usually external URLs are opened in the device browser,
// but these exceptions are allowed to load within the WebView
export const EXCEPTION_URLS = [
    "redirect_uri=",
    "redirect_uri%",
    "redirectUri%",
    "signin/oauth",
    "signin%2Foauth",
    "/m/oauth2",
    "api.twitter.com",
];
