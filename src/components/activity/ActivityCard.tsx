import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";

type ActivityCardProps = {
  activity: Activity;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const categoryLabel: Record<Activity["categoria"], string> = {
  allenamento: "Allenamento",
  salute: "Salute",
  alimentazione: "Alimentazione",
  altro: "Altro",
};

const priorityLabel: Record<Activity["priorita"], string> = {
  bassa: "Bassa",
  media: "Media",
  alta: "Alta",
};

const priorityColor: Record<Activity["priorita"], "default" | "warning" | "error"> = {
  bassa: "default",
  media: "warning",
  alta: "error",
};

export default function ActivityCard({
  activity,
  onToggle,
  onEdit,
  onDelete,
}: ActivityCardProps) {
  const { theme } = useTheme();

  return (
    <Card variant="flat" style={{ marginBottom: theme.spacing.sm }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <Pressable onPress={onToggle} style={{ marginRight: theme.spacing.sm, marginTop: 2 }}>
          <Ionicons
            name={activity.completata ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={activity.completata ? theme.colors.primary : theme.colors.textMuted}
          />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: theme.colors.text,
              textDecorationLine: activity.completata ? "line-through" : "none",
              ...theme.text.body,
            }}
          >
            {activity.titolo}
          </Text>

          <Text
            style={{
              color: theme.colors.textMuted,
              marginTop: 2,
              ...theme.text.caption,
            }}
          >
            {categoryLabel[activity.categoria]} · {activity.data}
            {activity.ora ? ` · ${activity.ora}` : ""}
          </Text>

          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.xs,
              marginTop: theme.spacing.xs,
            }}
          >
            <StatusBadge
              label={priorityLabel[activity.priorita]}
              color={priorityColor[activity.priorita]}
            />
            <StatusBadge
              label={activity.completata ? "Completata" : "Da fare"}
              color={activity.completata ? "primary" : "default"}
            />
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
          <Pressable onPress={onEdit} hitSlop={8}>
            <Ionicons name="create-outline" size={20} color={theme.colors.textMuted} />
          </Pressable>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
