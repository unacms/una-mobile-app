import { useThemeColor } from '@/hooks/use-theme-color';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  lightBgColor?: string;
  darkBgColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, lightBgColor, darkBgColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const borderColor = useThemeColor({ light: lightBgColor, dark: darkBgColor }, 'border');
  return <View style={[{ backgroundColor, borderColor }, style]} {...otherProps} />;
}
