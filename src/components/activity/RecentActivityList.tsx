import React from "react";
import { Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

type RecentActivityListProps = {
  activities: Activity[];
};

export default function RecentActivityList({
  activities,
}: RecentActivityListProps) {
  const { theme } = useTheme();

  return (
    <Card variant="flat" style={{ marginBottom: theme.spacing.lg }}>
      <Text
        style={{
          color: theme.colors.text,
          marginBottom: theme.spacing.sm,
          ...theme.text.h2,
        }}
      >
        Attività recenti
      </Text>

      {activities.length === 0 ? (
        <EmptyState message="Nessuna attività recente" />
      ) : (
        activities.map((activity) => (
          <Text
            key={activity.id}
            style={{
              color: theme.colors.textMuted,
              marginBottom: theme.spacing.xs,
              ...theme.text.body,
            }}
          >
            • {activity.titolo}
          </Text>
        ))
      )}
    </Card>
  );
}
