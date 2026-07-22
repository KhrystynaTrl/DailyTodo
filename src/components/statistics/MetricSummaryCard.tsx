import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { MetricKey } from "../../mocks/weeklyStats.mock";
import { ColorTokens } from "../../theme/colors";
import Card from "../ui/Card";
import { formatNumber, totalDisplay } from "./format";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export type MetricConfig = {
  key: MetricKey;
  label: string;
  short: string;
  unit: string;
  icon: IoniconName;
  colorKey: keyof ColorTokens;
};

export default function MetricSummaryCard({
  metric,
  avg,
  total,
  previousAvg,
  selected,
  onPress,
}: {
  metric: MetricConfig;
  avg: number;
  total: number;
  previousAvg: number | null;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={{ width: "48%", flexGrow: 1 }}>
      <Card
        variant="flat"
        style={{
          borderWidth: 2,
          borderColor: selected ? theme.colors[metric.colorKey] : "transparent",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.xs,
            marginBottom: theme.spacing.sm,
          }}
        >
          <Ionicons
            name={metric.icon}
            size={16}
            color={theme.colors[metric.colorKey]}
          />
          <Text
            style={{ color: theme.colors.textMuted, ...theme.text.caption }}
            numberOfLines={1}
          >
            {metric.short}
          </Text>
        </View>

        <Text
          style={{ color: theme.colors.text, textAlign: "center", ...theme.text.h2 }}
        >
          {formatNumber(avg)}
          {metric.unit ? (
            <Text style={{ ...theme.text.caption }}> {metric.unit}</Text>
          ) : null}
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            textAlign: "center",
            ...theme.text.caption,
            fontSize: 12,
          }}
        >
          media/giorno
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.xs,
            marginTop: theme.spacing.sm,
          }}
        >
          <DeltaBadge current={avg} previous={previousAvg} />
          <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
            · tot {totalDisplay(metric.key, total)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}

function DeltaBadge({
  current,
  previous,
}: {
  current: number;
  previous: number | null;
}) {
  const { theme } = useTheme();

  if (previous === null || previous === 0) {
    return (
      <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>—</Text>
    );
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change);
  const isUp = rounded > 0;
  const isFlat = rounded === 0;
  const color = isFlat
    ? theme.colors.textMuted
    : isUp
      ? theme.colors.success
      : theme.colors.error;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
      <Ionicons
        name={isFlat ? "remove" : isUp ? "arrow-up" : "arrow-down"}
        size={12}
        color={color}
      />
      <Text style={{ color, fontSize: 12, fontWeight: "700" }}>
        {isUp ? "+" : ""}
        {rounded}%
      </Text>
    </View>
  );
}
