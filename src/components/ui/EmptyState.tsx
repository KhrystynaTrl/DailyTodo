import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type EmptyStateProps = {
  message: string;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  message,
  icon = "file-tray-outline",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: "center", paddingVertical: theme.spacing.xl }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surfaceAlt,
          marginBottom: theme.spacing.md,
        }}
      >
        <Ionicons name={icon} size={30} color={theme.colors.textMuted} />
      </View>

      <Text
        style={{
          color: theme.colors.textMuted,
          textAlign: "center",
          ...theme.text.body,
        }}
      >
        {message}
      </Text>

      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          style={{
            marginTop: theme.spacing.md,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radii.md,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
