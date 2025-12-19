import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

type Props = {
  title: string;
  loading: boolean;
  canGoBack: boolean;
  onBack: () => void;
};

export default function Header({ title, loading, canGoBack, onBack }: Props) {
  const borderColor = useThemeColor({}, 'border');
  return (
    <ThemedView style={[{ borderColor }, styles.container]}>
      <Pressable
        onPress={onBack}
        disabled={!canGoBack}
        style={styles.back}
      >
        <ThemedText style={[styles.backText, !canGoBack && styles.disabled]}>
          ←
        </ThemedText>
      </Pressable>

      <ThemedText numberOfLines={1} style={styles.title}>
        {title || " "}
      </ThemedText>

      <ThemedView style={styles.right}>
        {loading && <ActivityIndicator size="small" />}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,    
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