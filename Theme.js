
import {Appearance} from 'react-native';

const themeDark = {
    dark: true,
    barStyle: 'light-content',
    colors: {
        primary: '#111827',
        textOnPrimary: '#6B7280',
        textOnPrimaryDisabled: '#111',
        background: '#000000',
        toolbarBorder: '#1F2937',
        drawerBackground: '#F3F4F6',
        drawerText: '#1890ff',
        drawerBorder: '#A3A4A5',
        statusBar: '#000000',
        activityIndicator: '#6B7280',
        searchInputBackground: '#000000',
        searchInputBorder: '#1F2937',
        searchInputText: '#CFDBF3',
    }
};
const themeLight = {
    dark: false,
    barStyle: 'dark-content',
    colors: {
        primary: '#fff',
        textOnPrimary: '#6B7280',
        textOnPrimaryDisabled: '#eee',
        background: '#F3F4F6',
        toolbarBorder: '#E4E9F2',
        drawerBackground: '#F3F4F6',
        drawerText: '#1890ff',
        drawerBorder: '#A3A4A5',
        statusBar: '#fff',
        activityIndicator: '#6B7280',
        searchInputBackground: '#F7F9FC',
        searchInputBorder: '#E4E9F2',
        searchInputText: '#6B7280',
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
