import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type StatusBadgeProps = {
  label: string;
  color?: "default" | "primary" | "warning" | "error";
};

export default function StatusBadge({
  label,
  color = "default",
}: StatusBadgeProps) {
  const { theme } = useTheme();

  const backgroundColor =
    color === "primary"
      ? theme.colors.primary
      : color === "warning"
        ? theme.colors.warning
        : color === "error"
          ? theme.colors.error
          : theme.colors.surface;

  const textColor =
    color === "default" ? theme.colors.textMuted : theme.colors.onPrimary;

  return (
    <View
      style={{
        backgroundColor,
        borderRadius: theme.radii.sm,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: textColor, ...theme.text.caption }}>{label}</Text>
    </View>
  );
}
