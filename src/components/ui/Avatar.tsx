import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type AvatarProps = {
  label: string;
  size?: number;
  onPress?: () => void;
};

export default function Avatar({ label, size = 40, onPress }: AvatarProps) {
  const { theme } = useTheme();

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: theme.colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  const content = (
    <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
      {label}
    </Text>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [circleStyle, pressed && { opacity: 0.7 }]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={circleStyle}>{content}</View>;
}
