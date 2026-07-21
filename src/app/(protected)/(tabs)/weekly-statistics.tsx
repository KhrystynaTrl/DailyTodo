import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BarChart from "../../../components/ui/BarChart";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingState from "../../../components/ui/LoadingState";
import { useTheme } from "../../../context/ThemeContext";
import {
  MetricKey,
  WeekId,
  WeekStats,
} from "../../../mocks/weeklyStats.mock";
import { getWeekStats } from "../../../services/weeklyStats.service";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type MetricConfig = {
  key: MetricKey;
  label: string;
  short: string;
  unit: string;
  icon: IoniconName;
  color: string;
};

const METRICS: MetricConfig[] = [
  { key: "steps", label: "Passi", short: "Passi", unit: "", icon: "walk", color: "#819A91" },
  { key: "activityMinutes", label: "Minuti di attività", short: "Minuti", unit: "min", icon: "time", color: "#D98C4A" },
  { key: "water", label: "Acqua", short: "Acqua", unit: "ml", icon: "water", color: "#3B82F6" },
  { key: "completedActivities", label: "Attività completate", short: "Completate", unit: "", icon: "checkmark-done", color: "#22C55E" },
];

const formatNumber = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const sumMetric = (week: WeekStats, key: MetricKey): number =>
  week.days.reduce((total, day) => total + day[key], 0);

const avgMetric = (week: WeekStats, key: MetricKey): number =>
  Math.round(sumMetric(week, key) / week.days.length);

const totalDisplay = (key: MetricKey, total: number): string =>
  key === "water" ? `${(total / 1000).toFixed(1)} L` : formatNumber(total);

export default function WeeklyStatistics() {
  const { theme } = useTheme();

  const [current, setCurrent] = useState<WeekStats | null>(null);
  const [previous, setPrevious] = useState<WeekStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [week, setWeek] = useState<WeekId>("current");
  const [metric, setMetric] = useState<MetricKey>("steps");

  useEffect(() => {
    Promise.all([getWeekStats("current"), getWeekStats("previous")])
      .then(([cur, prev]) => {
        setCurrent(cur);
        setPrevious(prev);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeWeek = week === "current" ? current : previous;
  // Il confronto ha senso solo per la settimana corrente (rispetto alla scorsa).
  const comparisonWeek = week === "current" ? previous : null;

  const activeMetric =
    METRICS.find((m) => m.key === metric) ?? METRICS[0];

  const isEmpty = useMemo(
    () =>
      activeWeek
        ? METRICS.every((m) => sumMetric(activeWeek, m.key) === 0)
        : false,
    [activeWeek],
  );

  if (isLoading || !activeWeek) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <LoadingState message="Caricamento statistiche..." />
      </SafeAreaView>
    );
  }

  const chartData = activeWeek.days.map((d) => d[metric]);
  const chartLabels = activeWeek.days.map((d) => d.day);
  const metricAverage = avgMetric(activeWeek, metric);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
          Statistiche
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            marginBottom: theme.spacing.lg,
            ...theme.text.caption,
          }}
        >
          {activeWeek.label} · {activeWeek.range}
        </Text>

        {/* Selezione periodo */}
        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
          }}
        >
          {(["current", "previous"] as WeekId[]).map((id) => {
            const active = week === id;
            return (
              <Pressable
                key={id}
                onPress={() => setWeek(id)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: theme.spacing.sm,
                  borderRadius: theme.radii.md,
                  backgroundColor: active
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: active
                    ? theme.colors.primary
                    : theme.colors.border,
                }}
              >
                <Text
                  style={{
                    color: active ? theme.colors.onPrimary : theme.colors.text,
                    ...theme.text.button,
                  }}
                >
                  {id === "current" ? "Questa settimana" : "Settimana scorsa"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isEmpty ? (
          <EmptyState message="Nessun dato disponibile per questa settimana" />
        ) : (
          <>
            {/* Card riepilogative — toccale per filtrare il grafico per tipologia */}
            <Text
              style={{
                color: theme.colors.textMuted,
                marginBottom: theme.spacing.sm,
                ...theme.text.caption,
                fontSize: 12,
              }}
            >
              Tocca una scheda per vedere il dettaglio nel grafico
            </Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.lg,
              }}
            >
              {METRICS.map((m) => {
                const avg = avgMetric(activeWeek, m.key);
                const total = sumMetric(activeWeek, m.key);
                const prevAvg = comparisonWeek
                  ? avgMetric(comparisonWeek, m.key)
                  : null;
                const selected = m.key === metric;

                return (
                  <Pressable
                    key={m.key}
                    onPress={() => setMetric(m.key)}
                    style={{ width: "48%", flexGrow: 1 }}
                  >
                    <Card
                      variant="flat"
                      style={{
                        borderWidth: 2,
                        borderColor: selected ? m.color : "transparent",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: theme.spacing.xs,
                          marginBottom: theme.spacing.sm,
                        }}
                      >
                        <Ionicons name={m.icon} size={16} color={m.color} />
                        <Text
                          style={{
                            flex: 1,
                            color: theme.colors.textMuted,
                            ...theme.text.caption,
                          }}
                          numberOfLines={1}
                        >
                          {m.short}
                        </Text>
                      </View>

                      <Text style={{ color: theme.colors.text, ...theme.text.h2 }}>
                        {formatNumber(avg)}
                        {m.unit ? (
                          <Text style={{ ...theme.text.caption }}> {m.unit}</Text>
                        ) : null}
                      </Text>
                      <Text
                        style={{
                          color: theme.colors.textMuted,
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
                          justifyContent: "space-between",
                          marginTop: theme.spacing.sm,
                        }}
                      >
                        <DeltaBadge current={avg} previous={prevAvg} />
                        <Text
                          style={{
                            color: theme.colors.textMuted,
                            fontSize: 12,
                          }}
                        >
                          tot {totalDisplay(m.key, total)}
                        </Text>
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>

            {/* Grafico della metrica selezionata */}
            <Card variant="base">
              <Text
                style={{
                  color: theme.colors.text,
                  marginBottom: theme.spacing.md,
                  ...theme.text.h2,
                }}
              >
                {activeMetric.label}
              </Text>

              <BarChart
                data={chartData}
                labels={chartLabels}
                color={activeMetric.color}
                average={metricAverage}
                formatValue={formatNumber}
              />

              {/* Legenda */}
              <View
                style={{
                  flexDirection: "row",
                  gap: theme.spacing.lg,
                  marginTop: theme.spacing.md,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: theme.radii.sm,
                      backgroundColor: activeMetric.color,
                    }}
                  />
                  <Text
                    style={{ color: theme.colors.textMuted, ...theme.text.caption }}
                  >
                    Giornaliero
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                  }}
                >
                  <View
                    style={{
                      width: 14,
                      borderTopWidth: 1,
                      borderTopColor: theme.colors.textMuted,
                      borderStyle: "dashed",
                    }}
                  />
                  <Text
                    style={{ color: theme.colors.textMuted, ...theme.text.caption }}
                  >
                    Media ({formatNumber(metricAverage)}
                    {activeMetric.unit ? ` ${activeMetric.unit}` : ""})
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
      ? "#22C55E"
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
