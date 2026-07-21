import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
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
import { getUnreadCount } from "../../../services/notifications.service";
import { WATER_GOAL_ML, getWaterState } from "../../../services/water.service";
import { formatDate, isToday, parseDate } from "../../../utils/date";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [stats, setStats] = useState<DailyStats | null>(null);
  const [waterMl, setWaterMl] = useState(0);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
    null,
  );
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadData = useCallback(async () => {
    const [dailyStats, activities, appointments, waterState] =
      await Promise.all([
        getTodayStats(),
        getActivities(),
        getAppointments(),
        getWaterState(),
      ]);

    setStats(dailyStats);
    setWaterMl(
      waterState.entries.reduce((sum, entry) => sum + entry.quantita, 0),
    );

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

  // Aggiorna il conteggio delle notifiche non lette ogni volta che la Home
  // torna in primo piano
  useFocusEffect(
    useCallback(() => {
      getUnreadCount().then(setUnreadCount);
    }, []),
  );

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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.md,
            }}
          >
            <Pressable
              onPress={() => router.push("/notifications")}
              hitSlop={8}
            >
              <Ionicons
                name="notifications-outline"
                size={26}
                color={theme.colors.text}
              />
              {unreadCount > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    paddingHorizontal: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.colors.error,
                    borderWidth: 2,
                    borderColor: theme.colors.background,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.onPrimary,
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              ) : null}
            </Pressable>
            <Avatar label={initials} onPress={() => setMenuVisible(true)} />
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
          }}
        >
          <StatCard label="Acqua" value={`${waterMl} ml`} style={{ flex: 1 }}>
            <ProgressBar progress={waterMl / WATER_GOAL_ML} />
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

        <Pressable
          onPress={() => router.push("/motivation")}
          style={({ pressed }) => [
            {
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.md,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
              ...theme.shadow,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="sparkles" size={22} color={theme.colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.colors.text, ...theme.text.body, fontWeight: "700" }}>
              Frase del giorno
            </Text>
            <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
              Lasciati ispirare con una frase motivazionale
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={theme.colors.textMuted}
          />
        </Pressable>

        <TodoTodayCard activities={todayActivities} />
        <NextAppointmentCard appointment={nextAppointment} />
        <RecentActivityList activities={recentActivities} />
      </ScrollView>

      {/* Menu Profilo / Impostazioni (apertura dall'avatar in alto a destra) */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          onPress={() => setMenuVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <View
            style={{
              position: "absolute",
              top: 96,
              right: theme.spacing.lg,
              minWidth: 200,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
              ...theme.shadow,
            }}
          >
            <MenuItem
              icon="person-outline"
              label="Profilo"
              onPress={() => {
                setMenuVisible(false);
                router.push("/profile");
              }}
            />
            <View
              style={{ height: 1, backgroundColor: theme.colors.border }}
            />
            <MenuItem
              icon="settings-outline"
              label="Impostazioni"
              onPress={() => {
                setMenuVisible(false);
                router.push("/preferences");
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
        pressed && { backgroundColor: theme.colors.surfaceAlt },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={{ color: theme.colors.text, ...theme.text.body }}>
        {label}
      </Text>
    </Pressable>
  );
}
