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
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radii.md,
          paddingVertical: theme.spacing.md + 2,
          marginTop: theme.spacing.sm + 2,
          width: "75%" as const,
          alignSelf: "center" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        (pressed || isDisabled) && { opacity: 0.7 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.onPrimary} />
      ) : (
        <Text
          style={{
            color: theme.colors.onPrimary,
            textAlign: "center",
            ...theme.text.button,
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
