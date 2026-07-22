import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Card from "./Card";

export default function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text
        style={{
          color: theme.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: theme.spacing.sm,
          marginLeft: theme.spacing.xs,
          ...theme.text.caption,
          fontSize: 12,
        }}
      >
        {title}
      </Text>
      <Card variant="flat" style={{ padding: 0 }}>
        {children}
      </Card>
    </View>
  );
}
