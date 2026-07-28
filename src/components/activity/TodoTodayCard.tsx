import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

type TodoTodayCardProps = {
  activities: Activity[];
};

const PAGE_SIZE = 4;

export default function TodoTodayCard({ activities }: TodoTodayCardProps) {
  const { theme } = useTheme();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activities]);

  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = activities.length > visibleCount;

  return (
    <Card style={{ marginBottom: theme.spacing.lg }}>
      <View
        style={{
          position: "relative",
          marginBottom: theme.spacing.md,
        }}
      >
        <Text
          style={{
            color: theme.colors.text,
            ...theme.text.h2,
            textAlign: "center",
          }}
        >
          Todo di oggi
        </Text>
        <Pressable
          onPress={() => router.push("/daily-activity")}
          style={{ position: "absolute", right: 0, top: 0 }}
        >
          <Text style={{ color: theme.colors.primary, ...theme.text.h2 }}>
            +
          </Text>
        </Pressable>
      </View>

      {activities.length === 0 ? (
        <EmptyState message="Nessuna attività per oggi" />
      ) : (
        <>
          {visibleActivities.map((activity, index) => (
            <Pressable
              key={activity.id}
              onPress={() => router.push("/daily-activity")}
              style={{
                paddingVertical: theme.spacing.sm,
                borderBottomWidth: index < visibleActivities.length - 1 ? 1 : 0,
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
          ))}

          {hasMore ? (
            <Pressable
              onPress={() => setVisibleCount((count) => count + PAGE_SIZE)}
              style={{ paddingTop: theme.spacing.sm }}
            >
              <Text
                style={{
                  color: theme.colors.primary,
                  textAlign: "center",
                  ...theme.text.link,
                }}
              >
                Carica altri
              </Text>
            </Pressable>
          ) : null}
        </>
      )}
    </Card>
  );
}
