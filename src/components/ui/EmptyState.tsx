import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={{ alignItems: "center", paddingVertical: theme.spacing.md }}>
      <Text
        style={{
          color: theme.colors.textMuted,
          textAlign: "center",
          ...theme.text.caption,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
