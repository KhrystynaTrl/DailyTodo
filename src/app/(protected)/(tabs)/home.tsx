import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentActivityList from "../../../components/activity/RecentActivityList";
import TodoTodayCard from "../../../components/activity/TodoTodayCard";
import NextAppointmentCard from "../../../components/appointments/NextAppointmentCard";
import Avatar from "../../../components/ui/Avatar";
import ProgressBar from "../../../components/ui/ProgressBar";
import StatCard from "../../../components/ui/StatCard";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Activity } from "../../../mocks/activities.mock";
import { Appointment } from "../../../mocks/appointments.mock";
import { DailyStats } from "../../../mocks/dailyStats.mock";
import { getActivities } from "../../../services/activities.service";
import { getAppointments } from "../../../services/appointments.service";
import { getTodayStats } from "../../../services/dailyStats.service";
import { formatDate, isToday, parseDate } from "../../../utils/date";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [stats, setStats] = useState<DailyStats | null>(null);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const [dailyStats, activities, appointments] = await Promise.all([
      getTodayStats(),
      getActivities(),
      getAppointments(),
    ]);

    setStats(dailyStats);

    setTodayActivities(
      activities.filter(
        (activity) => isToday(activity.data) && !activity.completata,
      ),
    );

    setRecentActivities(
      activities
        .filter((activity) => activity.completata)
        .slice(-3)
        .reverse(),
    );

    const upcoming = appointments
      .filter((appointment) => appointment.stato !== "annullato")
      .filter(
        (appointment) => parseDate(appointment.data).getTime() >= Date.now(),
      )
      .sort(
        (a, b) => parseDate(a.data).getTime() - parseDate(b.data).getTime(),
      );

    setNextAppointment(upcoming[0] ?? null);
  }, []);

  useEffect(() => {
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const displayName = user?.name ?? user?.email.split("@")[0] ?? "Utente";
  const initials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
      : (displayName[0]?.toUpperCase() ?? "?");

  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: theme.spacing.lg }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
          }}
        >
          <View>
            <Text
              style={{ color: theme.colors.textMuted, ...theme.text.caption }}
            >
              {formatDate(new Date())}
            </Text>
            <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
              Ciao, {displayName}
            </Text>
          </View>
          <Avatar label={initials} />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
          }}
        >
          <StatCard
            label="Acqua"
            value={`${stats?.waterMl ?? 0} ml`}
            style={{ flex: 1 }}
          >
            <ProgressBar
              progress={(stats?.waterMl ?? 0) / (stats?.waterGoalMl ?? 1)}
            />
          </StatCard>
          <StatCard
            label="Passi"
            value={`${stats?.steps ?? 0}`}
            style={{ flex: 1 }}
          />
          <StatCard
            label="Minuti attività"
            value={`${stats?.activityMinutes ?? 0}`}
            style={{ flex: 1 }}
          />
        </View>

        <TodoTodayCard activities={todayActivities} />
        <NextAppointmentCard appointment={nextAppointment} />
        <RecentActivityList activities={recentActivities} />
      </ScrollView>
    </SafeAreaView>
  );
}
