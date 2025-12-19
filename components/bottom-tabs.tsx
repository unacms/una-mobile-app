import { RefObject } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { UNA_URL } from "../constants/settings";
import { Bars, Bell, Chat, Plus, User } from "./icons";

type Props = {
  webViewRef: RefObject<WebView>;
  data: any;
};

export default function BottomTabs({ webViewRef, data }: Props) {
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
    <View style={styles.container}>
      <Pressable onPress={() => runFuncJS("bx_mobile_apps_show_main_menu")}>
        <Bars size={24} color="#111" />
      </Pressable>

      <Pressable onPress={() => runJS(`document.location = "${UNA_URL}/page.php?i=notifications-view"`)}>
        <Bell size={24} color="#111" />
        {renderBadge(data.bubbles?.['notifications-preview'] ?? 0)}
      </Pressable>

      <Pressable onPress={() => runFuncJS("bx_mobile_apps_show_add_menu")}>
        <Plus size={24} color="#111" />
      </Pressable>

      <Pressable onPress={() => runFuncJS("bx_mobile_apps_show_messenger_menu")}>
        <Chat size={24} color="#111" />
        {renderBadge(data.bubbles?.['notifications-messenger'] ?? 0)}
      </Pressable>

      <Pressable onPress={() => runFuncJS("bx_mobile_apps_show_profile_menu")}>
        <User size={24} color="#111" />
        {renderBadge(data.bubbles?.account ?? 0)}
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
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