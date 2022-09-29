
import {Appearance} from 'react-native';

const themeDark = {
    dark: true,
    barStyle: 'light-content',
    colors: {
        primary: '#1e293b',
        textOnPrimary: '#e2e8f0',
        textOnPrimaryDisabled: '#111',
        background: '#000000',
        toolbarBorder: '#475569',
        drawerBackground: '#F3F4F6',
        drawerText: '#1890ff',
        drawerBorder: '#475569',
        statusBar: '#000000',
        activityIndicator: '#e2e8f0',
        searchInputBackground: '#000000',
        searchInputBorder: '#475569',
        searchInputText: '#e2e8f0',
    }
};
const themeLight = {
    dark: false,
    barStyle: 'dark-content',
    colors: {
        primary: '#fff',
        textOnPrimary: '#334155',
        textOnPrimaryDisabled: '#eee',
        background: '#F3F4F6',
        toolbarBorder: '#cbd5e1',
        drawerBackground: '#F3F4F6',
        drawerText: '#1890ff',
        drawerBorder: '#cbd5e1',
        statusBar: '#fff',
        activityIndicator: '#334155',
        searchInputBackground: '#F7F9FC',
        searchInputBorder: '#cbd5e1',
        searchInputText: '#334155',
    }
};

function useTheme (s) {
    var colorScheme = Appearance.getColorScheme();
    var a = s.split('.'),
        ret = 'dark' === colorScheme ? themeDark : themeLight,
        i = 0;        
    for (; i < a.length ; i++) {
        if ('undefined' !== typeof(ret[a[i]]))
            ret = ret[a[i]];
    }
    return ret;
}

export {themeDark, themeLight, useTheme};
