import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export type TimeSlot = { time: string; available: boolean };

export default function TimeSlotPicker({
  slots,
  value,
  onChange,
}: {
  slots: TimeSlot[];
  value: string;
  onChange: (time: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.xs }}
    >
      {slots.map((slot) => (
        <Pressable
          key={slot.time}
          disabled={!slot.available}
          onPress={() => onChange(slot.time)}
          style={{
            backgroundColor:
              value === slot.time
                ? theme.colors.primary
                : slot.available
                  ? theme.colors.surface
                  : theme.colors.surfaceAlt,
            opacity: slot.available ? 1 : 0.4,
            borderRadius: theme.radii.md,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
          }}
        >
          <Text
            style={{
              color:
                value === slot.time ? theme.colors.onPrimary : theme.colors.text,
              ...theme.text.body,
            }}
          >
            {slot.time}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
