/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    iconDisabled: '#ccc',
    tabIconDefault: '#687076',
    tabIconSselected: tintColorLight,
    border: "#ddd",
  },
  dark: {
    text: '#ECEDEE',
    background: '#1f2837',
    tint: tintColorDark,
    icon: '#9BA1A6',
    iconDisabled: '#333',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: "#36404e",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  }
});
