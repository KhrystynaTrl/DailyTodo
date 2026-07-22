import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export type SettingsRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  isLast?: boolean;
};

export default function SettingsRow({
  icon,
  label,
  description,
  right,
  onPress,
  disabled,
  isLast,
}: SettingsRowProps) {
  const { theme } = useTheme();

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: theme.colors.border,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.text, ...theme.text.body }}>
          {label}
        </Text>
        {description ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              marginTop: 2,
              ...theme.text.caption,
              fontSize: 12,
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {right ?? null}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && { opacity: 0.6 }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
