import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate } from "../../utils/date";

type AppointmentsCalendarProps = {
  markedDates: Set<string>;
  selectedDate: string;
  onSelectDay: (date: string) => void;
};

const WEEKDAY_LABELS = ["L", "M", "M", "G", "V", "S", "D"];

const MONTH_LABELS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Lunedì diventa indice 0 (invece della domenica di Date.getDay()).
function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export default function AppointmentsCalendar({
  markedDates,
  selectedDate,
  onSelectDay,
}: AppointmentsCalendarProps) {
  const { theme } = useTheme();
  const [viewedMonth, setViewedMonth] = useState(() => startOfMonth(new Date()));

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const weeks = useMemo(() => {
    const daysInMonth = new Date(
      viewedMonth.getFullYear(),
      viewedMonth.getMonth() + 1,
      0,
    ).getDate();
    const leadingBlanks = mondayIndex(viewedMonth);

    const cells: (Date | null)[] = [
      ...Array<null>(leadingBlanks).fill(null),
      ...Array.from(
        { length: daysInMonth },
        (_, i) => new Date(viewedMonth.getFullYear(), viewedMonth.getMonth(), i + 1),
      ),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const result: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }
    return result;
  }, [viewedMonth]);

  const goToPreviousMonth = () => {
    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  };

  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: theme.spacing.sm,
        }}
      >
        <Pressable onPress={goToPreviousMonth} hitSlop={8} style={{ padding: 4 }}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <Text style={{ color: theme.colors.text, ...theme.text.h2 }}>
          {MONTH_LABELS[viewedMonth.getMonth()]} {viewedMonth.getFullYear()}
        </Text>
        <Pressable onPress={goToNextMonth} hitSlop={8} style={{ padding: 4 }}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
        </Pressable>
      </View>

      <View style={{ flexDirection: "row" }}>
        {WEEKDAY_LABELS.map((label, index) => (
          <Text
            key={`weekday-${index}`}
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

      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={{ flexDirection: "row" }}>
          {week.map((day, dayIndex) => {
            if (!day) {
              return (
                <View key={dayIndex} style={{ flex: 1, aspectRatio: 1 }} />
              );
            }

            const dateString = formatDate(day);
            const isSelected = dateString === selectedDate;
            const isToday = day.getTime() === today.getTime();
            const hasAppointments = markedDates.has(dateString);

            return (
              <Pressable
                key={dayIndex}
                onPress={() => onSelectDay(dateString)}
                style={{
                  flex: 1,
                  aspectRatio: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected
                      ? theme.colors.primary
                      : "transparent",
                    borderWidth: isToday && !isSelected ? 1 : 0,
                    borderColor: theme.colors.primary,
                  }}
                >
                  <Text
                    style={{
                      color: isSelected
                        ? theme.colors.onPrimary
                        : theme.colors.text,
                      ...theme.text.caption,
                      fontWeight: isToday || isSelected ? "700" : "400",
                    }}
                  >
                    {day.getDate()}
                  </Text>
                </View>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    marginTop: 2,
                    backgroundColor: hasAppointments
                      ? isSelected
                        ? theme.colors.primary
                        : theme.colors.info
                      : "transparent",
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
