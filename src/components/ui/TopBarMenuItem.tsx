import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function TopBarMenuItem({
  icon,
  label,
  onPress,
  active = false,
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const { theme } = useTheme();
  const color = active ? theme.colors.primary : theme.colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
        pressed && { backgroundColor: theme.colors.surfaceAlt },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text
        style={{
          ...theme.text.body,
          color,
          fontWeight: active ? "700" : "400",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
