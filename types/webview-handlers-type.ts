
import { WebViewNavigation } from "react-native-webview";

export type WebViewHandlers = {
    setLoading: (loading: boolean) => void;
    setData: (data: any) => void;
    setLoggedIn: (b: boolean) => void;

    onVideoCallStart: (uri: string, audio: boolean) => void;
    endVideoCall: () => void;

    onRequestPurchase: (payload: any) => void;
    onRequestSubscription: (payload: any) => void;

    onHomeMenu: () => void;
    reload: () => void;
    onStateChange: (state: WebViewNavigation) => void;
    
    onLoadProgress: (progress: number) => void;
    onTitleChange?: (title: string) => void;
};