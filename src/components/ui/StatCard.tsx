import React, { ReactNode } from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Card from "./Card";

type StatCardProps = {
  label: string;
  value: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export default function StatCard({
  label,
  value,
  style,
  children,
}: StatCardProps) {
  const { theme } = useTheme();

  return (
    <Card variant="flat" style={style}>
      <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
        {label}
      </Text>
      <Text
        style={{
          color: theme.colors.text,
          marginTop: theme.spacing.xs,
          ...theme.text.h2,
        }}
      >
        {value}
      </Text>
      {children ? (
        <View style={{ marginTop: theme.spacing.sm }}>{children}</View>
      ) : null}
    </Card>
  );
}
