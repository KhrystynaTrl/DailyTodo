import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

type TodoTodayCardProps = {
  activities: Activity[];
};

export default function TodoTodayCard({ activities }: TodoTodayCardProps) {
  const { theme } = useTheme();

  return (
    <Card style={{ marginBottom: theme.spacing.lg }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: theme.spacing.md,
        }}
      >
        <Text style={{ color: theme.colors.text, ...theme.text.h2 }}>
          Todo di oggi
        </Text>
        <Pressable onPress={() => router.push("/daily-activity")}>
          <Text style={{ color: theme.colors.primary, ...theme.text.h2 }}>
            +
          </Text>
        </Pressable>
      </View>

      {activities.length === 0 ? (
        <EmptyState message="Nessuna attività per oggi" />
      ) : (
        activities.map((activity, index) => (
          <Pressable
            key={activity.id}
            onPress={() => router.push("/daily-activity")}
            style={{
              paddingVertical: theme.spacing.sm,
              borderBottomWidth: index < activities.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.border,
            }}
          >
            <Text style={{ color: theme.colors.text, ...theme.text.body }}>
              {activity.titolo}
            </Text>
            {activity.ora ? (
              <Text
                style={{
                  color: theme.colors.textMuted,
                  ...theme.text.caption,
                }}
              >
                {activity.ora}
              </Text>
            ) : null}
          </Pressable>
        ))
      )}
    </Card>
  );
}
