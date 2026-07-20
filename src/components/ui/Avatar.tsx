import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type AvatarProps = {
  label: string;
  size?: number;
};

export default function Avatar({ label, size = 40 }: AvatarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
        {label}
      </Text>
    </View>
  );
}
