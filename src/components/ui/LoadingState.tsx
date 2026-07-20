import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.lg,
      }}
    >
      <ActivityIndicator color={theme.colors.primary} />
      {message ? (
        <Text
          style={{
            color: theme.colors.textMuted,
            marginTop: theme.spacing.sm,
            ...theme.text.caption,
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}
