import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export type NotificationFilter = "tutte" | "nonlette" | "lette";

const FILTERS: { key: NotificationFilter; label: string }[] = [
  { key: "tutte", label: "Tutte" },
  { key: "nonlette", label: "Non lette" },
  { key: "lette", label: "Lette" },
];

export default function NotificationFilterBar({
  value,
  unreadCount,
  onChange,
}: {
  value: NotificationFilter;
  unreadCount: number;
  onChange: (filter: NotificationFilter) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
      }}
    >
      {FILTERS.map(({ key, label }) => {
        const active = value === key;
        const badge = key === "nonlette" && unreadCount > 0;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.xs,
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.md,
              borderRadius: theme.radii.md,
              backgroundColor: active ? theme.colors.primary : theme.colors.surface,
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
              {label}
            </Text>
            {badge ? (
              <View
                style={{
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  paddingHorizontal: 4,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active
                    ? theme.colors.onPrimary
                    : theme.colors.primary,
                }}
              >
                <Text
                  style={{
                    color: active ? theme.colors.primary : theme.colors.onPrimary,
                    fontSize: 11,
                    fontWeight: "700",
                  }}
                >
                  {unreadCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
