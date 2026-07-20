import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  const { theme } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={{
        height: 8,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.surface,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height: "100%",
          borderRadius: theme.radii.sm,
          backgroundColor: theme.colors.primary,
        }}
      />
    </View>
  );
}
