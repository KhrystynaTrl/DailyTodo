import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function ChipSelector<T extends string>({
  options,
  labels,
  value,
  onChange,
}: {
  options: readonly T[];
  labels: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.xs,
      }}
    >
      {options.map((option) => (
        <Pressable
          key={option}
          onPress={() => onChange(option)}
          style={{
            backgroundColor:
              value === option ? theme.colors.primary : theme.colors.surface,
            borderRadius: theme.radii.md,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
          }}
        >
          <Text
            style={{
              color:
                value === option ? theme.colors.onPrimary : theme.colors.text,
              ...theme.text.caption,
            }}
          >
            {labels[option]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
