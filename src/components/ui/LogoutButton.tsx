import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleProp, Text, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function LogoutButton({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: theme.spacing.sm,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.error,
        },
        style,
      ]}
    >
      <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
      <Text style={{ color: theme.colors.error, ...theme.text.button }}>
        Esci
      </Text>
    </Pressable>
  );
}
