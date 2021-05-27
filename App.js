/**
 * Copyright (c) UNA, Inc - https://una.io
 * MIT License - https://opensource.org/licenses/MIT
 */

import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';
import { WebView } from 'react-native-webview';
import {
    Platform,
    StyleSheet,
    StyleProvider,
    Image,
    Linking,
    BackHandler,
    ActivityIndicator,
    Dimensions,
    Alert,
    Appearance,
    PermissionsAndroid,
} from 'react-native';
import { 
    View,
    Container, Content,
    Header, Title, Left, Body, Right, Item, Input,
    Footer, FooterTab, Badge, 
    Text, Icon, Button,
    Drawer,
} from 'native-base';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError
} from 'react-native-iap';

import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import VideoCall from './VideoCall';
import ErrorPage from './ErrorPage';
import { themeDark, themeLight, useTheme } from './Theme';

import { version } from './package.json';

type Props = {};

const BASE_URL = 'https://una.io/'; // site URL
const MIX_LIGHT = '12'; // template styles mix for light mode
const MIX_DARK = '13'; // template styles mix for dark mode
const TEMPLATE = 'protean'; // template name
const TITLE = 'UNA.IO | Community Management System'; // homepage title
const ONESIGNALAPPID = ''; // you can obtain one from https://onesignal.com/
const PAYMENTS_CALLBACK = ''; // empty string means payment functionality is disabled

const requestPermissions = async () => {
    try {
        const oGranted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]);
        
        for (const [sKey, sValue] of Object.entries(oGranted)) {
            console.log(`Permission - ${sKey}: ${sValue}`);
        }
    } catch (err) {
        console.warn(err);
    }
};

export default class App extends Component<Props> {

    loading = false;
    videoCallAudio = false;
    purchaseUpdateSubscription = null;
    purchaseErrorSubscription = null;
    products = {};

    constructor(props) {
        super(props);

        var colorScheme = Appearance.getColorScheme();

        this.state = {
            url: `${BASE_URL}?skin=${TEMPLATE}&mix=${'dark' === colorScheme ? MIX_DARK : MIX_LIGHT}`,
            status: '',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: this.loading,
            data: {},
            searchbar: false,
            key: 1,
            videoCall: 0,
            videoCallUri: false,
            colorScheme: colorScheme,
        };

        this.onBack.bind(this);
        this.onMainMenu.bind(this);

        this.onConferenceTerminated = this.onConferenceTerminated.bind(this);
        this.onConferenceJoined = this.onConferenceJoined.bind(this);
        this.onConferenceWillJoin = this.onConferenceWillJoin.bind(this);

        this.onVideoCallStart = this.onVideoCallStart.bind(this);        
    }

    async onRequestPurchase (sku: string) {
        if ('ios' === Platform.OS)
            RNIap.clearTransactionIOS();
        try {
            await RNIap.requestPurchase(sku, false);
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }

    async onRequestSubscription (sku: string) {
        if ('ios' === Platform.OS)
            RNIap.clearTransactionIOS();
        try {            
            await RNIap.requestSubscription(sku);
        } catch (err) {
            console.warn(err.code, err.message);
            Alert.alert(err.message);
        }
    }

    onConferenceTerminated(e) {
        this.endVideoCall();        
        this.injectJavaScript("bx_mobile_apps_video_terminated(" + JSON.stringify(e.nativeEvent) + ")");
    }

    onConferenceJoined(e) {
        this.injectJavaScript("bx_mobile_apps_video_joined(" + JSON.stringify(e.nativeEvent) + ")");
    }

    onConferenceWillJoin(e) {
        this.injectJavaScript("bx_mobile_apps_video_will_join(" + JSON.stringify(e.nativeEvent) + ")");
    }

    endVideoCall() {
        this.videoCallAudio = false;
        this.setState ({
            videoCall: 0,
            videoCallUri: false,
        });
        JitsiMeet.endCall();
    }    

    onVideoCallStart(sUri, bAudioOnly = false) {
        if (!this.state.videoCall) {
            this.videoCallAudio = bAudioOnly;
            this.setState ({
                videoCall: 1,
                videoCallUri: sUri,
            });
        }
    }

    onVideoCallToggle() {
        if (this.state.videoCall) {
            this.endVideoCall();
        }
        else {
            this.onVideoCallStart('testing-egr58t32g2');
        }
    }

    onBack() {
        this.endVideoCall();
        if (this.state.backButtonEnabled) {
    
            if ('android' === Platform.OS)
                this.onWebViewLoadStart(); // show loading screen
            
            this.refs.webView1.goBack();
            // this.injectJavaScript("window.history.go(-1)");
            return true;
        }
        return false;
    }
    
    onMainMenu() {
        this.endVideoCall();
        if (this.state.data.loggedin)
            this.injectJavaScript("bx_mobile_apps_show_main_menu()");
        else
            this.drawerOpen();
    }

    onBackAndMainMenu() {
        if (this.state.backButtonEnabled) {
            return this.onBack();
        }
        else {
            return this.onMainMenu();
        }
    }

    onProfileMenu() {
        this.endVideoCall();
        this.injectJavaScript("bx_mobile_apps_show_profile_menu()");
        return true;
    }

    onAddMenu() {
        this.endVideoCall();
        this.injectJavaScript("bx_mobile_apps_show_add_menu()");
        return true;
    }
    
    onNotificationsMenu() {
        this.endVideoCall();
        this.injectJavaScript("bx_mobile_apps_show_notifications_menu()");
        return true;
    }
    
    onMessengerMenu() {
        this.endVideoCall();
        this.injectJavaScript("bx_mobile_apps_show_messenger_menu()");
        return true;
    }
    
    onHomeMenu() {
        this.endVideoCall();
        if (`${BASE_URL}` == this.state.url || this.state.url.startsWith(`${BASE_URL}?skin=${TEMPLATE}`) || `${BASE_URL}index.php` == this.state.url) {        
            this.injectJavaScript("bx_mobile_apps_close_sliding_menus()");
        } else {
            this.setState ({
                url: `${BASE_URL}?skin=${TEMPLATE}&mix=${'dark' == this.state.colorScheme ? MIX_DARK : MIX_LIGHT}`,
                status: '',
                searchbar: false,
                key: this.state.key + 1,
            });
        }

        return true;
    }

    onSearch(event) {
        this.onSearchCancelMenu();        
        this.injectJavaScript(`window.location = '${BASE_URL}searchKeyword.php?keyword=${event.nativeEvent.text}';`);
    }

    onSearchCancelMenu() {
        this.setState ({
            loading: this.loading,
            searchbar: false,
        });
        return true;
    }

    onSearchMenu() {
        this.endVideoCall();
        this.setState ({
            loading: this.loading,
            searchbar: true,
        });
        return true;
    }

    onDrawerLoginMenu() {
        this.onHomeMenu();
        this.drawerClose();
        return true;
    }

    onDrawerJoinMenu() {
        this.injectJavaScript(`window.location = '${BASE_URL}page/create-account';`);
        this.drawerClose();
        return true;
    }
    
    onDrawerForgotMenu() {
        this.injectJavaScript(`window.location = '${BASE_URL}page/forgot-password';`);
        this.drawerClose();
        return true;
    }

    onWebViewNavigationStateChange(navState) {

        if (-1 != navState.url.indexOf('#') && this.state.url == navState.url.substring(0, navState.url.indexOf('#'))) {
            this.onWebViewLoadEnd();
            return;   
        }

        this.setState ({
            url: navState.url,
            status: navState.title,
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            searchbar: false,
        });
    }

    onWebViewLoadStart (syntheticEvent) {

        if (-1 == this.state.url.indexOf(`${BASE_URL}`)) { // loading indicator is supported on original domains only
            this.onWebViewLoadEnd(syntheticEvent);
            return;
        }
        this.loading = true;
        this.setState ({
            loading: this.loading,
            searchbar: false,
        });
    }
    
    onWebViewLoadEnd (syntheticEvent) {

        this.loading = false;
        this.setState ({
            loading: this.loading,
            searchbar: false,
        });
    }

    onWebViewRenderError () {
        return (
            <ErrorPage onReload={() => (this.reload())}></ErrorPage>
        );
    }

    reload() {
        this.refs.webView1.reload();
    }

    postMessage (data) {
        // posts a message to web view
        this.refs.webView1.postMessage(data);
    }

    injectJavaScript (script) {
        // executes JavaScript immediately in web view
        this.refs.webView1.injectJavaScript(script);
    }

    onWebViewShouldStartLoadWithRequest (event) {

        var aExceptionsUrls = [
            'redirect_uri=', 'redirect_uri%', 'redirectUri%', // Facebook/LinkedIn Connect and other Connect apps
            'signin/oauth', 'signin%2Foauth', // Google Connect
            '/m/oauth2', // Dolphin/UNA Connect
            'api.twitter.com', // Twitter Connect
        ];
        var bExceptionUrl = aExceptionsUrls.some(e => {
            return -1 !== event.url.indexOf(e);
        });

        if ('about:blank' === event.url)
            return false;

        if (0 != event.url.indexOf('http') || (!bExceptionUrl && -1 == event.url.indexOf(`${BASE_URL}`) && ('android' === Platform.OS || ('click' == event.navigationType && 'ios' === Platform.OS)))) {

            Linking.canOpenURL(event.url).then(supported => {
                if (supported) {
                    Linking.openURL(event.url);
                } 
                else {
                    console.log('Don\'t know how to open URI: ' + event.url);
                }
                return false;
            });
            return false;
        }

        if ('android' === Platform.OS)
            this.onWebViewLoadStart(); // show loading screen

        return true;
    }
  
    javascriptToInject () { 
        return 'glBxNexusApp = ' + JSON.stringify({ver:version});
    }

    componentDidCatch(error, info) {
        SplashScreen.hide();
    }

    async componentDidMount() {

        Appearance.addChangeListener(({ colorScheme }) => { // not working in Android :(
            var s = Appearance.getColorScheme(); // colorScheme param is working incorrect in iOS13, so we need to get it explicitly
            if (s != this.state.colorScheme) {
                var sUrl = this.state.url;
                var sUri = `skin=${TEMPLATE}&mix=${'dark' === s ? MIX_DARK : MIX_LIGHT}`;
                sUrl += (-1 === sUrl.indexOf('?') ? '?' : '&') + sUri;
                this.setState ({
                    colorScheme: s,
                    url: sUrl,
                });
            }
        });

        OneSignal.setLogLevel(6, 0);
        OneSignal.setAppId(ONESIGNALAPPID);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            console.log("OneSignal Prompt response:", response);
        });
        OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
            console.log("OneSignal: notification in foreground:", notificationReceivedEvent);
        });

        OneSignal.setNotificationOpenedHandler(openResult => {
            console.log("OneSignal: notification opened:", openResult);

            if ('undefined' !== typeof(openResult.notification.additionalData) && 'undefined' !== typeof(openResult.notification.additionalData.url)) {
                this.injectJavaScript(`window.location = '${openResult.notification.additionalData.url}';`);
            }            
        });

        const deviceState = await OneSignal.getDeviceState();
        this.setState({
            isSubscribed : deviceState.isSubscribed
        });

        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.state.backButtonEnabled) {
                    this.onBack(); // works best when the goBack is async
                    return true;
                }
                else {
                    return false;
                }
            });
        }        

        if (PAYMENTS_CALLBACK != '') {
            var _self = this;
            try {
                await RNIap.initConnection();
                const sProducts = await fetch(BASE_URL + 'modules/?r=oauth2/com/get_products_names&module=system&class=BaseServices');
                _self.products = await sProducts.json();
                await RNIap.getSubscriptions(Object.keys(_self.products));
                await RNIap.getProducts(Object.keys(_self.products));
            } catch(err) {
                console.warn(err);
            }

            purchaseUpdateSubscription = purchaseUpdatedListener(async (oPurchaseData: ProductPurchase) => {
                console.log('purchaseUpdatedListener', oPurchaseData);

                if ('undefined' !== typeof(oPurchaseData.transactionId) && _self.state.data.loggedin != 0) {
                    var sProductName = 'undefined' !== typeof(oPurchaseData.productId) ? oPurchaseData.productId : null;
                    var sTxId = 'undefined' !== typeof(oPurchaseData.transactionId) ? oPurchaseData.transactionId : '';
                    var sTxIdOriginal = 'undefined' !== typeof(oPurchaseData.originalTransactionIdentifierIOS) ? oPurchaseData.originalTransactionIdentifierIOS : '';

                    await fetch(PAYMENTS_CALLBACK, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'User-Agent': "UNAMobileApp/Mobile (" + Platform.OS + ")",
                        },
                        body: JSON.stringify({
                            notification_type: 'INITIAL_BUY_CUSTOM',
                            module: 'undefined' !== typeof(_self.products[sProductName]) ? _self.products[sProductName] : null,
                            product: sProductName,
                            count: 1,
                            original_transaction: sTxIdOriginal,
                            transaction: sTxId,
                            profile_id: _self.state.data.loggedin ? _self.state.data.user_info.id : 0,
                            original_data: oPurchaseData,
                        })
                    });
    
                    if ('ios' === Platform.OS)
                        RNIap.finishTransactionIOS(sTxId);
                }
            });
            purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
                console.log('purchaseErrorListener', error);
            }); 
        }

        requestPermissions();

        SplashScreen.hide();
    }
    
    componentWillUnmount() {

        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }

        if (Platform.OS === 'android') {
            this.backHandler.remove();
        }
    }
        
    onWebViewMessage(event) {

        let oMsgData;
        try {
            oMsgData = JSON.parse(event.nativeEvent.data);
        }
        catch(err) {
            console.warn(err);
            return;
        }

        if ('undefined' !== typeof(oMsgData.loggedin)) {
            this.setState ({
                loading: this.loading,
                data: oMsgData,
                searchbar: false,
                key: 'undefined' === typeof(this.state.data.loggedin) || this.state.data.loggedin != oMsgData.loggedin ? this.state.key + 1 : this.state.key,
            });
        }

        if ('undefined' !== typeof(oMsgData['push_tags']) && oMsgData['push_tags'] !== false) {
            if ('undefined' !== typeof(oMsgData['push_tags']['email']) && oMsgData['push_tags']['email'].length) {
                OneSignal.setEmail(oMsgData['push_tags']['email'], oMsgData['push_tags']['email_hash'], (sError) => {
                    if ('undefined' !== typeof(sError))
                        console.warn("OneSignal set email error: " + sError);
                });
                delete oMsgData['push_tags']['email'];
                delete oMsgData['push_tags']['email_hash'];
            }
            OneSignal.sendTags(oMsgData['push_tags']);
        }

        if ('undefined' !== typeof(oMsgData['stop_loading']) && oMsgData['stop_loading']) {
            // this.onWebViewLoadEnd (event);
        }

        if ('undefined' !== typeof(oMsgData['video_call_start'])) {
            this.onVideoCallStart (oMsgData['video_call_start']['uri'], 'undefined' === typeof(oMsgData['video_call_start']['audio']) ? false : oMsgData['video_call_start']['audio']);
        }
        if ('undefined' !== typeof(oMsgData['video_call_stop']) && oMsgData['video_call_stop']) {
            this.endVideoCall ();
        }

        if ('undefined' !== typeof(oMsgData['request_purchase']) && oMsgData['request_purchase']) {
            this.onRequestPurchase (oMsgData['request_purchase']);
        }
        if ('undefined' !== typeof(oMsgData['request_subscription']) && oMsgData['request_subscription']) {
            this.onRequestSubscription (oMsgData['request_subscription']);
        }

        if ('undefined' !== typeof(oMsgData['goto_home']) && oMsgData['goto_home']) {
            this.onHomeMenu ();
        }
        if ('undefined' !== typeof(oMsgData['reload']) && oMsgData['reload']) {
            this.reload ();
        }
    }

    drawerClose () {
        this.refs.drawer._root.close()
    }
    
    drawerOpen () {
        this.refs.drawer._root.open()
    }
    
    render() {
        var sWebview = (
                <WebView
                    useWebKit={true}

                    ref="webView1"
                    key={this.state.key}
                    geolocationEnabled={true}
                    builtInZoomControls={false}
                    decelerationRate="normal"
                    cacheEnabled={true}
                    allowsLinkPreview={true}
                    hideKeyboardAccessoryView={true}
                    injectedJavaScript={this.javascriptToInject()}
                    onShouldStartLoadWithRequest={this.onWebViewShouldStartLoadWithRequest.bind(this)}
                    onNavigationStateChange={this.onWebViewNavigationStateChange.bind(this)}
                    style={styles.webview}
                    source={{uri: this.state.url }}
                    userAgent={"UNAMobileApp/Mobile (" + Platform.OS + ")"}
                    onMessage={this.onWebViewMessage.bind(this)}
                    allowFileAccess={true}
                    onLoad={this.onWebViewLoadEnd.bind(this)}
                    onLoadStart={this.onWebViewLoadStart.bind(this)}
                    renderError={this.onWebViewRenderError.bind(this)}
                    startInLoadingState={true}
                    renderLoading={() => <View style={styles.webviewFirstLoad}><ActivityIndicator size="large" color={useTheme('colors.activityIndicator')} style={styles.webviewFirstLoadIndicator} /></View>}
                />
        );
        return (
            <Container> 
            <Drawer ref="drawer" content={<UnaDrawer onLogin={this.onDrawerLoginMenu.bind(this)} onJoin={this.onDrawerJoinMenu.bind(this)} onForotPassword={this.onDrawerForgotMenu.bind(this)} onClose={this.drawerClose.bind(this)} />} onClose={this.drawerClose.bind(this)}>
            <UnaApp 
                webview={sWebview}
                state={this.state}
                videoCallAudio={this.videoCallAudio}
                onSearch={this.onSearch.bind(this)}
                onSearchCancelMenu={this.onSearchCancelMenu.bind(this)}
                onMainMenu={this.onMainMenu.bind(this)}
                onBackAndMainMenu={this.onBackAndMainMenu.bind(this)}
                onHomeMenu={this.onHomeMenu.bind(this)}
                onAddMenu={this.onAddMenu.bind(this)}
                onSearchMenu={this.onSearchMenu.bind(this)}
                onNotificationsMenu={this.onNotificationsMenu.bind(this)}
                onMessengerMenu={this.onMessengerMenu.bind(this)}
                onProfileMenu={this.onProfileMenu.bind(this)}
                onVideoCallToggle={this.onVideoCallToggle.bind(this)}
                onRequestSubscription={this.onRequestSubscription} 
                onRequestPurchase={this.onRequestPurchase} 
                onConferenceTerminated={this.onConferenceTerminated}
                onConferenceJoined={this.onConferenceJoined}
                onConferenceWillJoin={this.onConferenceWillJoin} />
            </Drawer>
            </Container>
        );
    }
}

function UnaApp(o) {
        return (<Container>

                {o.state.searchbar ? (
                    <UnaToolbarSearch onSearch={o.onSearch} onSearchCancel={o.onSearchCancelMenu} />
                ) : (
                    <UnaToolbar loading={o.state.loading} loggedin={o.state.data.loggedin} backButtonEnabled={o.state.backButtonEnabled} onMainMenu={o.onMainMenu} onHomeMenu={o.onHomeMenu} onSearchMenu={o.onSearchMenu} onBackAndMainMenu={o.onBackAndMainMenu} title={o.state.status} url={o.state.url} />
                ) }

                {o.state.videoCall && o.state.videoCallUri ? (
                    <View style={styles.containerVideoCall}><VideoCall onConferenceTerminated={o.onConferenceTerminated} onConferenceJoined={o.onConferenceJoined} onConferenceWillJoin={o.onConferenceWillJoin} conferenceUri={o.state.videoCallUri} audio={o.videoCallAudio} userInfo={o.state.data.user_info} /></View>
                ) : (
                    <View />
                )}

                {o.webview}

                {o.state.data.loggedin && (
                    <UnaFooter bubblesNum={o.state.data.bubbles_num} bubbles={o.state.data.bubbles} onMainMenu={o.onMainMenu} onNotificationsMenu={o.onNotificationsMenu} onVideoCallToggle={o.onVideoCallToggle} onRequestPurchase={o.onRequestPurchase} onRequestSubscription={o.onRequestSubscription} onAddMenu={o.onAddMenu} onMessengerMenu={o.onMessengerMenu} onProfileMenu={o.onProfileMenu} />
                )}

                </Container>
        );
}

function UnaFooter(o) {
    return (
        <Footer style={styles.footer}>
            {!('decorous' == TEMPLATE && Platform.isPad) &&
                (<FooterTab style={styles.footerTab}>
                    <Button vertical onPress={o.onMainMenu}>
                        <Icon style={styles.footerIcon} name="apps-outline" type="Ionicons" />
                    </Button>
                </FooterTab>)
            }
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onNotificationsMenu} badge={o.bubbles['notifications-preview'] > 0 ? true : false}>
                    {o.bubbles['notifications-preview'] > 0 && 
                        (<Badge><Text>{o.bubbles['notifications-preview']}</Text></Badge>)
                    }
                    <Icon style={styles.footerIcon} name="notifications-outline" type="Ionicons" solid />
                </Button>
            </FooterTab>
{/*
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onVideoCallToggle}>
                    <Icon style={styles.footerIcon} name="videocam-outline" type="Ionicons" solid />
                </Button>
            </FooterTab>
*/}
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onAddMenu}>
                    <Icon style={styles.footerIcon} name="add-circle-outline" type="Ionicons" solid />
                </Button>
            </FooterTab>
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onMessengerMenu} badge={o.bubbles['notifications-messenger'] > 0 ? true : false}>
                    {o.bubbles['notifications-messenger'] > 0 && 
                        (<Badge><Text>{o.bubbles['notifications-messenger']}</Text></Badge>)
                    }
                    <Icon style={styles.footerIcon} name="chatbubbles-outline" type="Ionicons" solid />
                </Button>
            </FooterTab>                    
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onProfileMenu} badge={o.bubbles['account'] > 0 ? true : false}>
                    {o.bubbles['account'] > 0 && 
                        (<Badge><Text>{o.bubbles['account']}</Text></Badge>)
                    }
                    <Icon style={styles.footerIcon} name="person-circle-outline" type="Ionicons" solid />
                </Button>
            </FooterTab>
        </Footer>
    );
}

function UnaToolbar(o) {
    return (
        <Header androidStatusBarColor={useTheme('colors.statusBar')} transparent={false} iosBarStyle={useTheme('iosBarStyle')} style={styles.header}>
            <Left>
            {o.loading ? (
                <ActivityIndicator size="small" color={useTheme('colors.activityIndicator')} style={styles.loadingIndicator} />
            ):(
                o.loggedin ? (
                    (o.backButtonEnabled || Platform.OS === 'android') && 
                        (<Button style={Platform.OS === 'android' ? styles.buttonLeftTopAndroid : styles.buttonLeftTopIos} transparent disabled={!o.backButtonEnabled} onPress={o.onBackAndMainMenu}>
                        <Icon name="arrow-back-outline" type="Ionicons" style={styles.headerIcon} />
                        </Button>)
                    
                ) : (
                    <Button style={Platform.OS === 'android' ? styles.buttonLeftTopAndroid : styles.buttonLeftTopIos} transparent onPress={o.onMainMenu}>
                        <Icon name="menu-outline" type="Ionicons" style={styles.headerIcon} />
                    </Button>
                )
            )}
            </Left>
            <Body>
                {!o.title || TITLE == o.title || o.loading ? (
                    <Image style={styles.headerImage} source={require('./img/logo.png')} />
                ) : (
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.headerTitle}>{o.title}</Text>
                )}
            </Body>
            <Right>
                {o.loggedin && (
                    <Button transparent>
                        <Icon name='search-outline' type="Ionicons" onPress={o.onSearchMenu} style={styles.headerIcon} />
                    </Button>
                )}
            </Right>
        </Header>
    );
}

function UnaToolbarSearch(o) {
    return (
        <Header androidStatusBarColor={useTheme('colors.statusBar')} transparent={false} iosBarStyle={useTheme('iosBarStyle')} style={styles.header} searchBar rounded noShadow>
          <Item style={styles.searchInputItem}>
            <Input placeholder="Search..." onEndEditing={o.onSearchCancel} onSubmitEditing={o.onSearch} style={styles.searchInput} placeholderTextColor={useTheme('colors.searchInputPlaceholderText')} />
          </Item>
          <Button transparent onPress={o.onSearchCancel}>
            <Icon name='close-outline' type="Ionicons" style={styles.headerIcon} />
          </Button>
        </Header>
    );
}

function UnaDrawer(o) {
    return (
        <Container style={styles.drawerContainer}>
            <Content>
                <View style={styles.drawerImageContainer}>
                    <Image style={styles.drawerImage} source={require('./img/logo-drawer.png')} />
                </View>
                <Button style={styles.drawerButton} iconLeft transparent onPress={o.onLogin}>
                    <Icon style={styles.drawerButtonIcon} name='key-outline' type="Ionicons" solid />
                    <Text style={styles.drawerButtonText}>Login</Text>
                </Button>
                <Button style={styles.drawerButton} iconLeft transparent onPress={o.onJoin}>
                    <Icon style={styles.drawerButtonIcon} name='add-circle-outline' type="Ionicons" solid />
                    <Text style={styles.drawerButtonText}>Join</Text>
                </Button>
                <Button style={styles.drawerButton} iconLeft transparent onPress={o.onForotPassword}>
                    <Icon style={styles.drawerButtonIcon} name='lock-closed-outline' type="Ionicons" solid />
                    <Text style={styles.drawerButtonText}>Forgot Password</Text>
                </Button>
            </Content>
        </Container>
  );
}

const styles = new StyleSheet.create({
    container: {
        backgroundColor: useTheme('colors.background'),
        flex: 1
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    webviewFirstLoad: {
        flex: 9999999999,
        backgroundColor: useTheme('colors.background'),
        justifyContent: 'center', 
        alignItems: 'center',
    },
    webviewFirstLoadIndicator: {
    },
    header: {
        backgroundColor: useTheme('colors.primary'),
        height: 46, paddingTop:0, // tmp fix - https://github.com/GeekyAnts/NativeBase/issues/3095
        borderBottomWidth: 0.5,
        borderBottomColor: useTheme('colors.toolbarBorder'),
    },
    headerTitle: {
        color: useTheme('colors.textOnPrimary'),
        fontSize: 22,
    },
    headerImage: {
        width: 99,
        height: 28,
    },
    headerIcon: {
        color: useTheme('colors.textOnPrimary'),
        fontSize: 28,
    },
    searchInputItem: {
        borderColor: useTheme('colors.searchInputBorder'),
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: useTheme('colors.searchInputBackground'),
    },
    searchInput: {
        color: useTheme('colors.searchInputText'), 
        paddingLeft: 15, 
        paddingRight: 15
    },
    footer: {
        backgroundColor: useTheme('colors.primary'),
        borderTopWidth: 0.5,
        borderTopColor: useTheme('colors.toolbarBorder'),
    },
    footerTab: {
        backgroundColor: useTheme('colors.primary'),
    },
    footerIcon: {
        color: useTheme('colors.textOnPrimary'),
        fontSize: 28,
    },

    containerVideoCall: {
        backgroundColor: '#000',
        flex: 9999999999,
    },

    loadingIndicator: {
        marginLeft: 5,
        marginTop: 5,
    },
    buttonLeftTopAndroid: {
    },
    buttonLeftTopIos: {
    },
    drawerContainer: {
        backgroundColor: useTheme('colors.drawerBackground'),
    },
    drawerImageContainer: {
        height:100, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: useTheme('colors.drawerBackground'),
    },
    drawerImage: {
        height:33.5, 
        width:125,
    },
    drawerButton: {
        justifyContent: 'flex-start',
    },
    drawerButtonIcon: {
        width: 20,
        fontSize: 20,
        justifyContent: 'center',
        textAlign: 'center',
        color: useTheme('colors.drawerText'),
    },
    drawerButtonText: {
        color: useTheme('colors.drawerText'),
    },
});
