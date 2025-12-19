import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  title: string;
  loading: boolean;
  canGoBack: boolean;
  onBack: () => void;
};

export default function Header({ title, loading, canGoBack, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        disabled={!canGoBack}
        style={styles.back}
      >
        <Text style={[styles.backText, !canGoBack && styles.disabled]}>
          ←
        </Text>
      </Pressable>

      <Text numberOfLines={1} style={styles.title}>
        {title || " "}
      </Text>

      <View style={styles.right}>
        {loading && <ActivityIndicator size="small" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  back: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: { fontSize: 20 },
  disabled: { opacity: 0.3 },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  right: {
    width: 40,
    alignItems: "center",
  },
});