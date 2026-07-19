import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        theme.components.button.primary,
        { marginTop: theme.spacing.sm + 2 },
        pressed && theme.components.button.pressed,
        (disabled || loading) && theme.components.button.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <Text style={theme.components.button.textPrimary}>{title}</Text>
      )}
    </Pressable>
  );
}
