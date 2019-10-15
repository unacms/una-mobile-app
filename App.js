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
} from 'react-native';
import { 
    View,
    Container, Content,
    Header, Title, Left, Body, Right, Item, Input,
    Footer, FooterTab, Badge, 
    Text, Icon, Button,
    Drawer,
} from 'native-base';

type Props = {};

const BASE_URL = 'https://una.io/';
const TEMPLATE = 'protean';
const TITLE = 'UNA.IO';
const ONESIGNALAPPID = '';

export default class App extends Component<Props> {

    loading = false;

    constructor(props) {
        super(props);

        this.state = {
            url: `${BASE_URL}?skin=${TEMPLATE}`,
            status: 'No Page Loaded',
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: this.loading,
            data: {},
            searchbar: false,
            key: 1,
        };

        this.onBack.bind(this);
        this.onMainMenu.bind(this);
    }

    onBack() {
        if (this.state.backButtonEnabled) {
    
            if ('android' === Platform.OS)
                this.onWebViewLoadStart(); // show loading screen
            
            // this.refs.webView.goBack();
            this.injectJavaScript("window.history.go(-1)");
            return true;
        }
        return false;
    }
    
    onMainMenu() {
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
        this.injectJavaScript("bx_mobile_apps_show_profile_menu()");
        return true;
    }

    onAddMenu() {
        this.injectJavaScript("bx_mobile_apps_show_add_menu()");
        return true;
    }
    
    onNotificationsMenu() {
        this.injectJavaScript("bx_mobile_apps_show_notifications_menu()");
        return true;
    }
    
    onMessengerMenu() {
        this.injectJavaScript("bx_mobile_apps_show_messenger_menu()");
        return true;
    }
    
    onHomeMenu() {

        if (`${BASE_URL}?skin=${TEMPLATE}` == this.state.url || `${BASE_URL}` == this.state.url || `${BASE_URL}index.php` == this.state.url) {
            this.injectJavaScript("bx_mobile_apps_close_sliding_menus()");
        } else {
            this.setState ({
                url: `${BASE_URL}?skin=${TEMPLATE}`,
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
        this.setState ({
            url: navState.url,
            status: navState.title,
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            searchbar: false,
        });
    }

    onWebViewLoadStart (syntheticEvent) {
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
        this.refs.webView.reload();
    }

    postMessage (data) {
        // posts a message to web view
        this.refs.webView.postMessage(data);
    }

    injectJavaScript (script) {
        // executes JavaScript immediately in web view
        this.refs.webView.injectJavaScript(script);
    }

    onWebViewShouldStartLoadWithRequest (event) {

        if (0 != event.url.indexOf('http') || (-1 == event.url.indexOf(`${BASE_URL}`) && ('android' === Platform.OS || ('click' == event.navigationType && 'ios' === Platform.OS)))) {
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
      return ``
    }

    componentDidCatch(error, info) {
        SplashScreen.hide();
    }

    componentDidMount() {
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
    }
    
    componentWillUnmount() {
        OneSignal.removeEventListener('received', this.onNotificationReceived);        
        OneSignal.removeEventListener('opened', this.onNotificationOpened);

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
        
        if ('undefined' !== typeof(oMsgData['push_tags']))
            OneSignal.sendTags(oMsgData['push_tags']);

        if ('undefined' !== typeof(oMsgData['stop_loading']) && oMsgData['stop_loading']) {
            this.onWebViewLoadEnd (event);
        }
    }

    drawerClose () {
        this.refs.drawer._root.close()
    }
    
    drawerOpen () {
        this.refs.drawer._root.open()
    }
    
    render() {
        StatusBar.setBarStyle(Platform.OS === 'android' ? 'light-content' : 'dark-content', false);
        return (
            <Container>
            <Drawer ref="drawer" content={this.renderDrawer()} onClose={this.drawerClose.bind(this)}>
                {this.state.searchbar ? this.renderToolbarSearch() : this.renderToolbar() }
                <WebView
                    useWebKit={true}

                    ref="webView"
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
                    style={styles.containerWebView}
                    source={{uri: `${BASE_URL}?skin=${TEMPLATE}`}}
                    userAgent={"UNAMobileApp/Mobile (" + Platform.OS + ")"}
                    onMessage={this.onWebViewMessage.bind(this)}
                    allowFileAccess={true}
                    onLoad={this.onWebViewLoadEnd.bind(this)}
                    onLoadStart={this.onWebViewLoadStart.bind(this)}
                />
                {this.state.data.loggedin && (
                    <Footer>
                        <FooterTab>
                            <Button vertical onPress={this.onHomeMenu.bind(this)}>
                                <Icon name="home" type="FontAwesome5" />
                            </Button>
                        </FooterTab>
                        <FooterTab>
                            <Button vertical onPress={this.onNotificationsMenu.bind(this)} badge={this.state.data.bubbles['notifications-notifications'] > 0 ? true : false}>
                                {this.state.data.bubbles['notifications-notifications'] > 0 && 
                                    (<Badge><Text>{this.state.data.bubbles['notifications-notifications']}</Text></Badge>)
                                }
                                <Icon name="bell" type="FontAwesome5" solid />
                            </Button>
                        </FooterTab>
                        <FooterTab>
                            <Button vertical onPress={this.onAddMenu.bind(this)}>
                                <Icon name="plus-circle" type="FontAwesome5" solid />
                            </Button>
                        </FooterTab>
                        <FooterTab>
                            <Button vertical onPress={this.onMessengerMenu.bind(this)} badge={this.state.data.bubbles['notifications-messenger'] > 0 ? true : false}>
                                {this.state.data.bubbles['notifications-messenger'] > 0 && 
                                    (<Badge><Text>{this.state.data.bubbles['notifications-messenger']}</Text></Badge>)
                                }
                                <Icon name="comments" type="FontAwesome5" solid />
                            </Button>
                        </FooterTab>                    
                        <FooterTab>
                            <Button vertical onPress={this.onProfileMenu.bind(this)} badge={this.state.data.bubbles_num > 0 ? true : false}>
                                {this.state.data.bubbles_num > 0 && 
                                    (<Badge><Text>{this.state.data.bubbles_num}</Text></Badge>)
                                }
                                <Icon name="user" type="FontAwesome5" solid />
                            </Button>
                        </FooterTab>
                    </Footer>
                )}
                {this.state.loading && (
                    <View style={styles.viewLoading2}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                )}
            </Drawer>
            </Container>
        );
    }

    renderToolbar () {
        return (        
            <Header>
                <Left>
                    <Button style={Platform.OS === 'android' ? styles.buttonLeftTopAndroid : styles.buttonLeftTopIos} transparent onPress={this.onBackAndMainMenu.bind(this)}>
                        <Icon name={this.state.backButtonEnabled ? 'ios-arrow-back' : 'ios-menu'} />
                    </Button>
                </Left>
                <Body>            
                    <Title>{TITLE}</Title>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon name='search' onPress={this.onSearchMenu.bind(this)} />
                    </Button>
                </Right>
            </Header>
        );
    }
    
    renderToolbarSearch () {
        return (
            <Header searchBar rounded>
              <Item>
                <Icon name="search" />
                <Input ref="inputSearch" placeholder="Search" onEndEditing={this.onSearchCancelMenu.bind(this)} onSubmitEditing={this.onSearch.bind(this)} />
              </Item>
              <Button transparent onPress={this.onSearchCancelMenu.bind(this)}>
                <Text>Cancel</Text>
              </Button>
            </Header>
        );
    }

    renderLoadingView () {
        return (
            <View style={styles.viewLoading}>
                <Image source={require('./img/logo-loading.png')} />
                <Text>Loading...</Text>
            </View>
        );
    }

    renderDrawer () {
        return (
            <Container>
                <Content>
                    <View style={styles.drawerImageContainer}>
                        <Image style={styles.drawerImage} source={require('./img/logo-loading.png')} />
                    </View>
                    <Button style={styles.drawerButton} iconLeft transparent onPress={this.onDrawerLoginMenu.bind(this)}>
                        <Icon style={styles.drawerButtonIcon} name='key' type="FontAwesome5" solid />
                        <Text>Login</Text>
                    </Button>
                    <Button style={styles.drawerButton} iconLeft transparent onPress={this.onDrawerJoinMenu.bind(this)}>
                        <Icon style={styles.drawerButtonIcon} name='plus-circle' type="FontAwesome5" solid />
                        <Text>Join</Text>
                    </Button>
                    <Button style={styles.drawerButton} iconLeft transparent onPress={this.onDrawerForgotMenu.bind(this)}>
                        <Icon style={styles.drawerButtonIcon} name='lock' type="FontAwesome5" solid />
                        <Text>Forgot Password</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    containerWebView: {
        flex: 1,
    },
    viewLoading: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#FFF',
    },
    viewLoading2: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000066',
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
    },
});

