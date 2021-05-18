
import {Appearance} from 'react-native';

const themeDark = {
    dark: true,
    iosBarStyle: 'light-content',
    colors: {
        primary: '#1890ff',
        textOnPrimary: '#f3f4f5',
        background: '#123',
        text: '#f3f4f5',
        drawerBackground: '#f3f4f5',
        drawerText: '#1890ff',
        statusBar: '#076fd3',
        activityIndicator: '#f3f4f5',
    }
};
const themeLight = {
    dark: false,
    iosBarStyle: 'light-content',
    colors: {
        primary: '#1890ff',
        textOnPrimary: '#f3f4f5',
        background: '#edf1f7',
        text: '#595959',
        drawerBackground: '#edf1f7',
        drawerText: '#1890ff',
        statusBar: '#076fd3',
        activityIndicator: '#f3f4f5',
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
