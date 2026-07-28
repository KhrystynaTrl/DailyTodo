import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import ProgressBar from "../../../components/ui/ProgressBar";
import StatCard from "../../../components/ui/StatCard";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import { Activity } from "../../../mocks/activities.mock";
import { Appointment } from "../../../mocks/appointments.mock";
import { DailyStats } from "../../../mocks/dailyStats.mock";
import { getActivities } from "../../../services/activities.service";
import { getAppointments } from "../../../services/appointments.service";
import { getTodayStats } from "../../../services/dailyStats.service";
import { getWaterState } from "../../../services/water.service";
import { isToday, parseDate } from "../../../utils/date";

export default function Home() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<DailyStats | null>(null);
  const [waterMl, setWaterMl] = useState(0);
  const [waterGoalMl, setWaterGoalMl] = useState(2000);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    let dailyStats, activities, appointments, waterState;
    try {
      [dailyStats, activities, appointments, waterState] = await Promise.all([
        getTodayStats(),
        getActivities(),
        getAppointments(),
        getWaterState(),
      ]);
    } catch (error) {
      // Sessione scaduta o token mancante: onSessionExpired (AuthContext) ha
      // già forzato il logout, il redirect a login lo gestisce _layout.tsx.
      // Per altri errori (rete, backend) avvisiamo l'utente invece di
      // lasciare la Home vuota senza spiegazioni.
      showToast(
        error instanceof Error ? error.message : "Errore nel caricamento dei dati",
        "error",
      );
      return;
    }

    setStats(dailyStats);
    setWaterGoalMl(waterState.goalMl);
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
  }, [showToast]);

  const isFirstLoad = useRef(true);

  // Ricarica i dati ogni volta che la Home torna in primo piano (es. dopo aver
  // aggiunto o modificato un'attività), non solo al primo avvio. Lo spinner a
  // schermo intero compare solo al caricamento iniziale.
  useFocusEffect(
    useCallback(() => {
      loadData().finally(() => {
        if (isFirstLoad.current) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      });
    }, [loadData]),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  // Saluto personalizzato solo se il profilo ha un nome: altrimenti mostriamo
  // solo "Ciao" (evitiamo la mail troncata, che risulterebbe troppo lunga).
  const greeting = user?.name ? `Ciao, ${user.name}` : "Ciao";

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
    <SafeAreaView
      edges={["left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
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
        <Text
          style={{
            color: theme.colors.text,
            ...theme.text.h1,
            marginBottom: theme.spacing.lg,
            textAlign: "center",
          }}
        >
          {greeting}
        </Text>

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
          }}
        >
          <StatCard label="Acqua" value={`${waterMl} ml`} style={{ flex: 1 }}>
            <ProgressBar progress={waterMl / waterGoalMl} />
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
              alignItems: "center",
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.lg,
              marginBottom: theme.spacing.lg,
              ...theme.shadow,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="sparkles"
            size={22}
            color={theme.colors.primary}
            style={{ marginBottom: theme.spacing.xs }}
          />
          <Text
            style={{
              color: theme.colors.text,
              ...theme.text.body,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Frase del giorno
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              ...theme.text.caption,
              textAlign: "center",
            }}
          >
            Lasciati ispirare con una frase motivazionale
          </Text>
        </Pressable>

        <TodoTodayCard activities={todayActivities} />
        <NextAppointmentCard appointment={nextAppointment} />
        <RecentActivityList activities={recentActivities} />
      </ScrollView>
    </SafeAreaView>
  );
}
