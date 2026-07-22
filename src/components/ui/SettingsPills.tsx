import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsPills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
      }}
    >
      {options.map((option) => {
        const active = value === option.key;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radii.md,
              backgroundColor: active
                ? theme.colors.primary
                : theme.colors.surface,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
            }}
          >
            <Text
              style={{
                color: active ? theme.colors.onPrimary : theme.colors.text,
                ...theme.text.caption,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
