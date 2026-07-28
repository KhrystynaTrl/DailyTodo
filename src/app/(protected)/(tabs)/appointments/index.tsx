import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentCard from "../../../../components/appointments/AppointmentCard";
import AppointmentsCalendar from "../../../../components/appointments/AppointmentsCalendar";
import AppTextField from "../../../../components/ui/AppTextField";
import Card from "../../../../components/ui/Card";
import ChipSelector from "../../../../components/ui/ChipSelector";
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
import { formatDate } from "../../../../utils/date";

type StatusFilter = "tutti" | Appointment["stato"];
type ViewMode = "lista" | "calendario";

const viewModeOptions: { value: ViewMode; label: string }[] = [
  { value: "lista", label: "Lista" },
  { value: "calendario", label: "Calendario" },
];

const statusOptions: StatusFilter[] = [
  "tutti",
  "confermato",
  "in attesa",
  "annullato",
];
const statusLabel: Record<StatusFilter, string> = {
  tutti: "Tutti",
  confermato: "Confermati",
  "in attesa": "In attesa",
  annullato: "Annullati",
};

export default function AppointmentsList() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<StatusFilter>("tutti");
  const [search, setSearch] = useState("");
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("lista");
  const [selectedDay, setSelectedDay] = useState<string>(() =>
    formatDate(new Date()),
  );

  const loadAppointments = useCallback(() => {
    return getAppointments().then(setAppointments);
  }, []);

  const isFirstLoad = useRef(true);

  // Ricarica ogni volta che la schermata torna in primo piano (es. dopo aver
  // prenotato/annullato da un altro dispositivo), non solo al primo avvio.
  useFocusEffect(
    useCallback(() => {
      loadAppointments().finally(() => {
        if (isFirstLoad.current) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      });
    }, [loadAppointments]),
  );

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

  const markedDates = useMemo(() => {
    return new Set(
      appointments.filter((a) => a.stato !== "annullato").map((a) => a.data),
    );
  }, [appointments]);

  const dayAppointments = useMemo(() => {
    return filteredAppointments.filter((a) => a.data === selectedDay);
  }, [filteredAppointments, selectedDay]);

  const visibleAppointments =
    viewMode === "calendario" ? dayAppointments : filteredAppointments;

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
      edges={["left", "right"]}
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

        <View
          style={{
            flexDirection: "row",
            gap: theme.spacing.xs,
            marginBottom: theme.spacing.md,
          }}
        >
          {viewModeOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => setViewMode(option.value)}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.radii.md,
                backgroundColor:
                  viewMode === option.value
                    ? theme.colors.primary
                    : theme.colors.surface,
              }}
            >
              <Text
                style={{
                  color:
                    viewMode === option.value
                      ? theme.colors.onPrimary
                      : theme.colors.text,
                  ...theme.text.button,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <AppTextField
          placeholder="Cerca per titolo o professionista"
          value={search}
          onChangeText={setSearch}
          containerStyle={{ width: "100%" }}
        />

        <View style={{ marginBottom: theme.spacing.md }}>
          <ChipSelector
            options={statusOptions}
            labels={statusLabel}
            value={status}
            onChange={setStatus}
          />
        </View>

        {viewMode === "calendario" ? (
          <AppointmentsCalendar
            markedDates={markedDates}
            selectedDate={selectedDay}
            onSelectDay={setSelectedDay}
          />
        ) : null}

        {visibleAppointments.length === 0 ? (
          <EmptyState
            message={
              viewMode === "calendario"
                ? `Nessun appuntamento per il ${selectedDay}`
                : "Nessun appuntamento trovato"
            }
          />
        ) : (
          visibleAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onPress={() =>
                router.push({
                  pathname: "/appointments/[id]",
                  params: { id: String(appointment.id) },
                })
              }
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
