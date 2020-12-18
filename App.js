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
    StatusBar,
    Alert,
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

import { initialMode, useDarkMode, DynamicStyleSheet, DynamicValue, useDynamicStyleSheet, eventEmitter } from 'react-native-dark-mode';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import VideoCall from './VideoCall';

import { version } from './package.json';

type Props = {};

const BASE_URL = 'https://una.io/'; // site URL
const MIX_LIGHT = '12'; // template styles mix for light mode
const MIX_DARK = '13'; // template styles mix for dark mode
const TEMPLATE = 'protean'; // template name
const TITLE = 'UNA.IO'; // app title
const ONESIGNALAPPID = ''; // you can obtain one from https://onesignal.com/
const PAYMENTS_CALLBACK = ''; // empty string means payment functionality is disabled

export default class App extends Component<Props> {

    loading = false;
    videoCallAudio = false;
    mode = initialMode;
    purchaseUpdateSubscription = null;
    purchaseErrorSubscription = null;
    products = {};

    constructor(props) {
        super(props);

        this.state = {
            url: `${BASE_URL}?skin=${TEMPLATE}&mix=${'dark' == this.mode ? MIX_DARK : MIX_LIGHT}`,
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: this.loading,
            data: {},
            searchbar: false,
            key: 1,
            videoCall: 0,
            videoCallUri: false,
        };

        this.onBack.bind(this);
        this.onMainMenu.bind(this);

        this.onConferenceTerminated = this.onConferenceTerminated.bind(this);
        this.onConferenceJoined = this.onConferenceJoined.bind(this);
        this.onConferenceWillJoin = this.onConferenceWillJoin.bind(this);

        this.onVideoCallStart = this.onVideoCallStart.bind(this);        
    }

    onModeChanged(newMode){
        this.mode = newMode;
        this.setState ({
            key: this.state.key + 1,
        });
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
                url: `${BASE_URL}?skin=${TEMPLATE}&mix=${'dark' == this.mode ? MIX_DARK : MIX_LIGHT}`,
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

    componentWillMount() {
        eventEmitter.on('currentModeChanged', this.onModeChanged.bind(this));
    }

    async componentDidMount() {
        OneSignal.init(ONESIGNALAPPID, {kOSSettingsKeyAutoPrompt : true});
        OneSignal.inFocusDisplaying(0);

        OneSignal.addEventListener('received', this.onNotificationReceived);
        OneSignal.addEventListener('opened', this.onNotificationOpened.bind(this));

        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                this.onBack(); // works best when the goBack is async
                return true;
            });
        }

        SplashScreen.hide();

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
    }
    
    componentWillUnmount() {
        eventEmitter.removeListener('currentModeChanged', this.onModeChanged);

        OneSignal.removeEventListener('received', this.onNotificationReceived);        
        OneSignal.removeEventListener('opened', this.onNotificationOpened);

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
    
    onNotificationReceived(notification) {
        console.log("Notification received: ", notification);
    }
    
    onNotificationOpened(openResult) {
        if ('undefined' !== typeof(openResult.notification.payload.additionalData) && 'undefined' !== typeof(openResult.notification.payload.additionalData.url) && !openResult.notification.isAppInFocus) {
            this.injectJavaScript(`window.location = '${openResult.notification.payload.additionalData.url}';`);
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
                    style={{flex: 1}}
                    source={{uri: `${BASE_URL}?skin=${TEMPLATE}&mix=${'dark' == this.mode ? MIX_DARK : MIX_LIGHT}`}}
                    userAgent={"UNAMobileApp/Mobile (" + Platform.OS + ")"}
                    onMessage={this.onWebViewMessage.bind(this)}
                    allowFileAccess={true}
                    onLoad={this.onWebViewLoadEnd.bind(this)}
                    onLoadStart={this.onWebViewLoadStart.bind(this)}
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
        const styles = useDynamicStyleSheet(dynamicStyles);

        const isDarkMode = useDarkMode();
        var sBarStyle = 'dark-content';
        if (Platform.OS === 'android' || isDarkMode)
            sBarStyle = 'light-content';            
        if (Platform.OS === 'android')
            StatusBar.setBackgroundColor('#076fd3');
        StatusBar.setBarStyle(sBarStyle, false);         

        return (<Container>

                {o.state.searchbar ? (
                    <UnaToolbarSearch onSearch={o.onSearch} onSearchCancel={o.onSearchCancelMenu} />
                ) : (
                    <UnaToolbar loading={o.state.loading} loggedin={o.state.data.loggedin} backButtonEnabled={o.state.backButtonEnabled} onMainMenu={o.onMainMenu} onHomeMenu={o.onHomeMenu} onSearchMenu={o.onSearchMenu} onBackAndMainMenu={o.onBackAndMainMenu} />
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
    const styles = useDynamicStyleSheet(dynamicStyles)
    return (
        <Footer style={styles.footer}>
            {!('decorous' == TEMPLATE && Platform.isPad) &&
                (<FooterTab style={styles.footerTab}>
                    <Button vertical onPress={o.onMainMenu}>
                        <Icon style={styles.footerIcon} name="bars" type="FontAwesome5" />
                    </Button>
                </FooterTab>)
            }
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onNotificationsMenu} badge={o.bubbles['notifications-notifications'] > 0 ? true : false}>
                    {o.bubbles['notifications-notifications'] > 0 && 
                        (<Badge><Text>{o.bubbles['notifications-notifications']}</Text></Badge>)
                    }
                    <Icon style={styles.footerIcon} name="bell" type="FontAwesome5" solid />
                </Button>
            </FooterTab>
{/*
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onVideoCallToggle}>
                    <Icon style={styles.footerIcon} name="video" type="FontAwesome5" solid />
                </Button>
            </FooterTab>
*/}
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onAddMenu}>
                    <Icon style={styles.footerIcon} name="plus-circle" type="FontAwesome5" solid />
                </Button>
            </FooterTab>
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onMessengerMenu} badge={o.bubbles['notifications-messenger'] > 0 ? true : false}>
                    {o.bubbles['notifications-messenger'] > 0 && 
                        (<Badge><Text>{o.bubbles['notifications-messenger']}</Text></Badge>)
                    }
                    <Icon style={styles.footerIcon} name="comments" type="FontAwesome5" solid />
                </Button>
            </FooterTab>                    
            <FooterTab style={styles.footerTab}>
                <Button vertical onPress={o.onProfileMenu} badge={o.bubblesNum > 0 ? true : false}>
                    {o.bubblesNum > 0 && 
                        (<Badge><Text>{o.bubblesNum}</Text></Badge>)
                    }
                    <Icon style={styles.footerIcon} name="user" type="FontAwesome5" solid />
                </Button>
            </FooterTab>
        </Footer>
    );
}

function UnaToolbar(o) {
    const styles = useDynamicStyleSheet(dynamicStyles)
    return (
        <Header style={styles.header}>
            <Left>
            {o.loading ? (
                <ActivityIndicator size="small" style={styles.loadingIndicator} />
            ):(
                o.loggedin ? (
                    (o.backButtonEnabled || Platform.OS === 'android') && 
                        (<Button style={Platform.OS === 'android' ? styles.buttonLeftTopAndroid : styles.buttonLeftTopIos} transparent disabled={!o.backButtonEnabled} onPress={o.onBackAndMainMenu}>
                        <Icon name="ios-arrow-back" />
                        </Button>)
                    
                ) : (
                    <Button style={Platform.OS === 'android' ? styles.buttonLeftTopAndroid : styles.buttonLeftTopIos} transparent onPress={o.onMainMenu}>
                        <Icon name='menu' />
                    </Button>
                )
            )}
            </Left>
            <Body style={Platform.OS === 'android' && {flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Title style={styles.headerTitle} onPress={o.onHomeMenu}>{TITLE}</Title>
            </Body>
            <Right>
                {o.loggedin && (
                    <Button transparent>
                        <Icon name='search' onPress={o.onSearchMenu} />
                    </Button>
                )}
            </Right>
        </Header>
    );
}

function UnaToolbarSearch(o) {
    const styles = useDynamicStyleSheet(dynamicStyles)
    return (
        <Header style={styles.header} searchBar rounded>
          <Item>
            <Icon name="search" />
            <Input placeholder="Search" onEndEditing={o.onSearchCancel} onSubmitEditing={o.onSearch} />
          </Item>
          <Button transparent onPress={o.onSearchCancel}>
            <Text>Cancel</Text>
          </Button>
        </Header>
    );
}

function UnaDrawer(o) {
    const styles = useDynamicStyleSheet(dynamicStyles)
    return (
        <Container>
            <Content>
                <View style={styles.drawerImageContainer}>
                    <Image style={styles.drawerImage} source={require('./img/logo-loading.png')} />
                </View>
                <Button style={styles.drawerButton} iconLeft transparent onPress={o.onLogin}>
                    <Icon style={styles.drawerButtonIcon} name='key' type="FontAwesome5" solid />
                    <Text style={styles.drawerButtonText}>Login</Text>
                </Button>
                <Button style={styles.drawerButton} iconLeft transparent onPress={o.onJoin}>
                    <Icon style={styles.drawerButtonIcon} name='plus-circle' type="FontAwesome5" solid />
                    <Text style={styles.drawerButtonText}>Join</Text>
                </Button>
                <Button style={styles.drawerButton} iconLeft transparent onPress={o.onForotPassword}>
                    <Icon style={styles.drawerButtonIcon} name='lock' type="FontAwesome5" solid />
                    <Text style={styles.drawerButtonText}>Forgot Password</Text>
                </Button>
            </Content>
        </Container>
  );
}

const dynamicStyles = new DynamicStyleSheet({
    header: {
        backgroundColor: Platform.OS === 'android' ? '#1890ff' : new DynamicValue('#eee', '#333'),
        height: 46, paddingTop:0, // tmp fix - https://github.com/GeekyAnts/NativeBase/issues/3095
    },
    headerTitle: {
        color: Platform.OS === 'android' ? '#fff' : new DynamicValue('#333', '#ccc'),
    },
    footer: {
        backgroundColor: Platform.OS === 'android' ? '#1890ff' : new DynamicValue('#eee', '#333'),
    },
    footerTab: {
        backgroundColor: Platform.OS === 'android' ? '#1890ff' : new DynamicValue('#eee', '#333'),
    },
    footerIcon: {
        color: Platform.OS === 'android' ? '#fff' : new DynamicValue('#555', '#ccc'),
    },

    containerVideoCall: {
        backgroundColor: '#000',
        flex: 999999999999,
    },

    loadingIndicator: {
        marginLeft: 5,
        marginTop: 5,
    },
    buttonLeftTopAndroid: {
    },
    buttonLeftTopIos: {
        marginLeft: 5,
    },
    drawerImageContainer: {
        height:100, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#FFF',
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
        color: '#1890ff',
    },
    drawerButtonText: {
        color: '#1890ff',
    }
});

