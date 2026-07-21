import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
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
import { ColorTokens } from "../../../theme/colors";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

type MetricConfig = {
  key: MetricKey;
  label: string;
  short: string;
  unit: string;
  icon: IoniconName;
  colorKey: keyof ColorTokens;
};

const METRICS: MetricConfig[] = [
  { key: "steps", label: "Passi", short: "Passi", unit: "", icon: "walk", colorKey: "primary" },
  { key: "activityMinutes", label: "Minuti di attività", short: "Minuti", unit: "min", icon: "time", colorKey: "warning" },
  { key: "water", label: "Acqua", short: "Acqua", unit: "ml", icon: "water", colorKey: "info" },
  { key: "completedActivities", label: "Attività completate", short: "Completate", unit: "", icon: "checkmark-done", colorKey: "success" },
];

const formatNumber = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const sumMetric = (week: WeekStats, key: MetricKey): number =>
  week.days.reduce((total, day) => total + day[key], 0);

// Giorni "effettivi": quelli con almeno un dato. I giorni futuri della settimana
// corrente sono azzerati dal service (tutte le metriche a 0), quindi restano
// esclusi dalla media senza bisogno di conoscere la data qui.
const activeDaysCount = (week: WeekStats): number =>
  week.days.filter(
    (day) =>
      day.steps + day.activityMinutes + day.water + day.completedActivities > 0,
  ).length;

const avgMetric = (week: WeekStats, key: MetricKey): number => {
  const days = activeDaysCount(week);
  return days === 0 ? 0 : Math.round(sumMetric(week, key) / days);
};

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
    <SafeAreaView
      edges={["left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View style={{ flex: 1, padding: theme.spacing.lg }}>
        <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
          Statistiche
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            marginBottom: theme.spacing.md,
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
            marginBottom: theme.spacing.md,
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
          <View style={{ flex: 1 }}>
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
                marginBottom: theme.spacing.md,
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
                        borderColor: selected
                          ? theme.colors[m.colorKey]
                          : "transparent",
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
                          name={m.icon}
                          size={16}
                          color={theme.colors[m.colorKey]}
                        />
                        <Text
                          style={{
                            color: theme.colors.textMuted,
                            ...theme.text.caption,
                          }}
                          numberOfLines={1}
                        >
                          {m.short}
                        </Text>
                      </View>

                      <Text
                        style={{
                          color: theme.colors.text,
                          textAlign: "center",
                          ...theme.text.h2,
                        }}
                      >
                        {formatNumber(avg)}
                        {m.unit ? (
                          <Text style={{ ...theme.text.caption }}> {m.unit}</Text>
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
                        <DeltaBadge current={avg} previous={prevAvg} />
                        <Text
                          style={{
                            color: theme.colors.textMuted,
                            fontSize: 12,
                          }}
                        >
                          · tot {totalDisplay(m.key, total)}
                        </Text>
                      </View>
                    </Card>
                  </Pressable>
                );
              })}
            </View>

            {/* Grafico della metrica selezionata */}
            <Card variant="base" style={{ flex: 1 }}>
              <Text
                style={{
                  color: theme.colors.text,
                  marginBottom: theme.spacing.sm,
                  ...theme.text.h2,
                }}
              >
                {activeMetric.label}
              </Text>

              <BarChart
                data={chartData}
                labels={chartLabels}
                color={theme.colors[activeMetric.colorKey]}
                average={metricAverage}
                formatValue={formatNumber}
                fill
              />

              {/* Legenda */}
              <View
                style={{
                  flexDirection: "row",
                  gap: theme.spacing.lg,
                  marginTop: theme.spacing.sm,
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
                      backgroundColor: theme.colors[activeMetric.colorKey],
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
          </View>
        )}
      </View>
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
