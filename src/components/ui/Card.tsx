import React, { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type CardProps = PropsWithChildren<{
  variant?: "base" | "elevated" | "flat";
  style?: StyleProp<ViewStyle>;
}>;

export default function Card({
  variant = "base",
  style,
  children,
}: CardProps) {
  const { theme } = useTheme();

  return (
    <View style={[theme.components.card[variant], style]}>{children}</View>
  );
}
