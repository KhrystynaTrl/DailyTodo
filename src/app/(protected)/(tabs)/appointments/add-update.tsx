import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentForm from "../../../../components/appointments/AppointmentForm";
import EmptyState from "../../../../components/ui/EmptyState";
import LoadingState from "../../../../components/ui/LoadingState";
import { useTheme } from "../../../../context/ThemeContext";
import { useToast } from "../../../../context/ToastContext";
import { Appointment } from "../../../../mocks/appointments.mock";
import { getAppointmentById } from "../../../../services/appointments.service";

export default function EditAppointment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAppointment = () => {
    setIsLoading(true);
    return getAppointmentById(Number(id))
      .then((found) => {
        setAppointment(found ?? null);
        setLoadError(null);
      })
      .catch((error) => {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Errore nel caricamento dell'appuntamento",
        );
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadAppointment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSaved = () => {
    showToast("Appuntamento aggiornato");
    router.replace({ pathname: "/appointments/[id]", params: { id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text
          style={{
            color: theme.colors.text,
            marginLeft: theme.spacing.sm,
            ...theme.text.h1,
          }}
        >
          Modifica appuntamento
        </Text>
      </View>

      {isLoading ? (
        <LoadingState message="Caricamento appuntamento..." />
      ) : loadError ? (
        <EmptyState
          icon="cloud-offline-outline"
          message={loadError}
          actionLabel="Riprova"
          onAction={loadAppointment}
        />
      ) : !appointment ? (
        <EmptyState
          message="Appuntamento non trovato"
          icon="calendar-outline"
        />
      ) : appointment.stato === "annullato" ? (
        <EmptyState
          message="Un appuntamento annullato non può essere modificato"
          icon="close-circle-outline"
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
          <AppointmentForm
            appointment={appointment}
            onSaved={handleSaved}
            onDismiss={() => router.back()}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
