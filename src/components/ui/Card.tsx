import React, { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type CardProps = PropsWithChildren<{
  variant?: "base" | "flat";
  style?: StyleProp<ViewStyle>;
}>;

export default function Card({
  variant = "base",
  style,
  children,
}: CardProps) {
  const { theme } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor:
      variant === "flat" ? theme.colors.surfaceAlt : theme.colors.surface,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    ...(variant === "base" ? theme.shadow : null),
  };

  return <View style={[cardStyle, style]}>{children}</View>;
}
