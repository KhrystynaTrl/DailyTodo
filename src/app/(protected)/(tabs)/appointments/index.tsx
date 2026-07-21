import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentCard from "../../../../components/appointments/AppointmentCard";
import AppTextField from "../../../../components/ui/AppTextField";
import Card from "../../../../components/ui/Card";
import ConfirmationModal from "../../../../components/ui/ConfirmationModal";
import EmptyState from "../../../../components/ui/EmptyState";
import Skeleton from "../../../../components/ui/Skeleton";
import { useTheme } from "../../../../context/ThemeContext";
import { useToast } from "../../../../context/ToastContext";
import { Appointment } from "../../../../mocks/appointments.mock";
import {
  cancelAppointment,
  getAppointments,
} from "../../../../services/appointments.service";

type StatusFilter = "tutti" | Appointment["stato"];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "tutti", label: "Tutti" },
  { value: "confermato", label: "Confermati" },
  { value: "in attesa", label: "In attesa" },
  { value: "annullato", label: "Annullati" },
];

export default function AppointmentsList() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<StatusFilter>("tutti");
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const loadAppointments = () => {
    return getAppointments().then(setAppointments);
  };

  useEffect(() => {
    loadAppointments().finally(() => setIsLoading(false));
  }, []);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (status !== "tutti" && appointment.stato !== status) return false;
      if (
        search.trim() &&
        !appointment.titolo.toLowerCase().includes(search.trim().toLowerCase()) &&
        !appointment.professionista
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [appointments, status, search]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      const updated = await cancelAppointment(cancelTarget.id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );
      showToast("Appuntamento annullato");
    } catch {
      showToast("Errore durante l'annullamento", "error");
    } finally {
      setCancelTarget(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: theme.spacing.lg }}>
          <Skeleton width="45%" height={28} style={{ marginBottom: theme.spacing.lg }} />
          {[0, 1, 2, 3].map((i) => (
            <Card
              key={i}
              variant="flat"
              style={{ marginBottom: theme.spacing.sm }}
            >
              <Skeleton width="60%" height={18} />
              <Skeleton
                width="40%"
                height={12}
                style={{ marginTop: theme.spacing.sm }}
              />
              <Skeleton
                width="30%"
                height={12}
                style={{ marginTop: theme.spacing.sm }}
              />
            </Card>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
          }}
        >
          <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
            Appuntamenti
          </Text>
          <Pressable
            onPress={() => router.push("/appointments/new")}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radii.md,
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
              + Nuovo
            </Text>
          </Pressable>
        </View>

        <AppTextField
          placeholder="Cerca per titolo o professionista"
          value={search}
          onChangeText={setSearch}
          containerStyle={{ width: "100%" }}
        />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.spacing.xs,
            marginBottom: theme.spacing.md,
          }}
        >
          {statusOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setStatus(option.value)}
              style={{
                backgroundColor:
                  status === option.value
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderRadius: theme.radii.md,
                paddingVertical: theme.spacing.xs,
                paddingHorizontal: theme.spacing.sm,
              }}
            >
              <Text
                style={{
                  color:
                    status === option.value
                      ? theme.colors.onPrimary
                      : theme.colors.text,
                  ...theme.text.caption,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {filteredAppointments.length === 0 ? (
          <EmptyState message="Nessun appuntamento trovato" />
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancel={() => setCancelTarget(appointment)}
            />
          ))
        )}
      </ScrollView>

      <ConfirmationModal
        visible={cancelTarget !== null}
        title="Annullare l'appuntamento?"
        message={`"${cancelTarget?.titolo}" con ${cancelTarget?.professionista} verrà annullato.`}
        confirmLabel="Annulla appuntamento"
        cancelLabel="Torna indietro"
        onConfirm={handleCancelConfirm}
        onCancel={() => setCancelTarget(null)}
      />
    </SafeAreaView>
  );
}
