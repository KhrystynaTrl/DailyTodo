import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type BarChartProps = {
  data: number[];
  labels: string[];
  color: string;
  height?: number;
  average?: number;
  formatValue?: (value: number) => string;
};

export default function BarChart({
  data,
  labels,
  color,
  height = 160,
  average,
  formatValue = (v) => String(v),
}: BarChartProps) {
  const { theme } = useTheme();

  const max = Math.max(...data, 1);
  const averageBottom =
    average !== undefined ? (average / max) * height : undefined;

  return (
    <View>
      {/* Area del grafico */}
      <View style={{ height, position: "relative" }}>
        {/* Linea della media settimanale */}
        {averageBottom !== undefined ? (
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: averageBottom,
              borderTopWidth: 1,
              borderTopColor: theme.colors.textMuted,
              borderStyle: "dashed",
            }}
          />
        ) : null}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            height,
          }}
        >
          {data.map((value, index) => {
            const barHeight = Math.max((value / max) * height, 2);
            return (
              <View
                key={index}
                style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}
              >
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: 10,
                    marginBottom: 2,
                  }}
                >
                  {formatValue(value)}
                </Text>
                <View
                  style={{
                    width: "55%",
                    height: barHeight,
                    borderTopLeftRadius: theme.radii.sm,
                    borderTopRightRadius: theme.radii.sm,
                    backgroundColor: color,
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* Etichette dei giorni */}
      <View style={{ flexDirection: "row", marginTop: theme.spacing.xs }}>
        {labels.map((label, index) => (
          <Text
            key={index}
            style={{
              flex: 1,
              textAlign: "center",
              color: theme.colors.textMuted,
              ...theme.text.caption,
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
