import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../../../components/ui/Card";
import ConfirmationModal from "../../../../components/ui/ConfirmationModal";
import EmptyState from "../../../../components/ui/EmptyState";
import LoadingState from "../../../../components/ui/LoadingState";
import StatusBadge from "../../../../components/ui/StatusBadge";
import { useTheme } from "../../../../context/ThemeContext";
import { useToast } from "../../../../context/ToastContext";
import { Appointment } from "../../../../mocks/appointments.mock";
import {
  cancelAppointment,
  getAppointmentById,
} from "../../../../services/appointments.service";

const statusLabel: Record<Appointment["stato"], string> = {
  confermato: "Confermato",
  "in attesa": "In attesa",
  annullato: "Annullato",
};

const statusColor: Record<
  Appointment["stato"],
  "default" | "primary" | "warning" | "error"
> = {
  confermato: "primary",
  "in attesa": "warning",
  annullato: "default",
};

export default function AppointmentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAppointmentById(Number(id))
      .then((found) => setAppointment(found ?? null))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleCancelConfirm = async () => {
    if (!appointment) return;
    try {
      const updated = await cancelAppointment(appointment.id);
      setAppointment(updated);
      showToast("Appuntamento annullato");
    } catch {
      showToast("Errore durante l'annullamento", "error");
    } finally {
      setShowCancelConfirm(false);
    }
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
          Dettaglio appuntamento
        </Text>
      </View>

      {isLoading ? (
        <LoadingState message="Caricamento appuntamento..." />
      ) : !appointment ? (
        <EmptyState
          message="Appuntamento non trovato"
          icon="calendar-outline"
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
          <Card variant="flat">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: theme.spacing.sm,
              }}
            >
              <Text
                style={{ color: theme.colors.text, ...theme.text.h2, flex: 1 }}
              >
                {appointment.titolo}
              </Text>
              <StatusBadge
                label={statusLabel[appointment.stato]}
                color={statusColor[appointment.stato]}
              />
            </View>

            <DetailRow label="Professionista" value={appointment.professionista} />
            <DetailRow label="Tipologia" value={appointment.tipologia} />
            <DetailRow label="Data" value={appointment.data} />
            <DetailRow label="Orario" value={appointment.ora} />
            <DetailRow label="Durata" value={`${appointment.durata} minuti`} />
            <DetailRow label="Note" value={appointment.note || "—"} />
          </Card>

          {appointment.stato !== "annullato" ? (
            <View
              style={{
                flexDirection: "row",
                gap: theme.spacing.sm,
                marginTop: theme.spacing.lg,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/appointments/add-update",
                    params: { id: String(appointment.id) },
                  })
                }
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                }}
              >
                <Text style={{ color: theme.colors.text, ...theme.text.button }}>
                  Modifica
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setShowCancelConfirm(true)}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.radii.md,
                  backgroundColor: theme.colors.error,
                }}
              >
                <Text
                  style={{ color: theme.colors.onPrimary, ...theme.text.button }}
                >
                  Annulla appuntamento
                </Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      )}

      <ConfirmationModal
        visible={showCancelConfirm}
        title="Annullare l'appuntamento?"
        message={`"${appointment?.titolo}" con ${appointment?.professionista} verrà annullato.`}
        confirmLabel="Annulla appuntamento"
        cancelLabel="Torna indietro"
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.sm }}>
      <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
        {label}
      </Text>
      <Text style={{ color: theme.colors.text, ...theme.text.body }}>
        {value}
      </Text>
    </View>
  );
}
