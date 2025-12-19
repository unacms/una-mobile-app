import { HapticTab } from "@/components/haptic-tab";
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RefObject } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { UNA_URL } from "../constants/settings";
import { Bars, Bell, Chat, Plus, Search, User } from "./icons";

type Props = {
  webViewRef: RefObject<WebView>;
  data: any;
};

export default function BottomTabs({ webViewRef, data }: Props) {
  const iconColor = useThemeColor({}, 'icon');

  const runFuncJS = (js: string) => {
    webViewRef.current?.injectJavaScript(`
      if (window.${js}) {
        ${js}();
      }
      true;
    `);
  };

  const runJS = (js: string) => {
    webViewRef.current?.injectJavaScript(`      
        ${js};
        true;
    `);
  };

  const renderBadge = (number: number) => {
    if (number <= 0) return null;
    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{number}</Text>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>

      <HapticTab onPress={() => runFuncJS("bx_mobile_apps_show_main_menu")}>
        <Bars size={24} color={iconColor} />
      </HapticTab>

      <HapticTab onPress={() => runJS(`document.location = "${UNA_URL}/page.php?i=notifications-view"`)}>
        <Bell size={24} color={iconColor} />
        {renderBadge(data.bubbles?.['notifications-preview'] ?? 0)}
      </HapticTab>

      <HapticTab onPress={() => runFuncJS("bx_mobile_apps_show_add_menu")}>
        <Plus size={24} color={iconColor} />
      </HapticTab>

      <HapticTab onPress={() => runFuncJS("bx_mobile_apps_show_messenger_menu")}>
        <Chat size={24} color={iconColor} />
        {renderBadge(data.bubbles?.['notifications-messenger'] ?? 0)}
      </HapticTab>

      <HapticTab onPress={() => runJS(`document.location = "${UNA_URL}/searchKeyword.php"`)}>
        <Search size={24} color={iconColor} />
      </HapticTab>

      <HapticTab onPress={() => runFuncJS("bx_mobile_apps_show_profile_menu")}>
        <User size={24} color={iconColor} />
        {renderBadge(data.bubbles?.account ?? 0)}
      </HapticTab>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "red",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});