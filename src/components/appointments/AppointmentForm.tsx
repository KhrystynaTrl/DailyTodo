import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Appointment } from "../../mocks/appointments.mock";
import {
  getAvailableSlots,
  updateAppointment,
} from "../../services/appointments.service";
import { parseDate } from "../../utils/date";
import { isRequired, isValidDate } from "../../utils/validators";
import AppTextField from "../ui/AppTextField";
import Card from "../ui/Card";
import DateField from "../ui/DateField";
import EmptyState from "../ui/EmptyState";
import LoadingState from "../ui/LoadingState";
import TimeSlotPicker, { TimeSlot } from "./TimeSlotPicker";

type AppointmentFormProps = {
  appointment: Appointment;
  onSaved: (updated: Appointment) => void;
  onDismiss: () => void;
};

// Modifica limitata a data, orario e note: servizio e professionista restano
// quelli scelti in fase di prenotazione (cambiarli equivarrebbe a una nuova
// prenotazione, gestita dal wizard in new.tsx).
export default function AppointmentForm({
  appointment,
  onSaved,
  onDismiss,
}: AppointmentFormProps) {
  const { theme } = useTheme();

  const [date, setDate] = useState(appointment.data);
  const [dateError, setDateError] = useState("");
  const [time, setTime] = useState(appointment.ora);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [note, setNote] = useState(appointment.note ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const loadSlots = useCallback(() => {
    if (!isValidDate(date)) return;
    setIsLoadingSlots(true);
    return getAvailableSlots(appointment.professionalId, date, {
      data: appointment.data,
      ora: appointment.ora,
    })
      .then((data) => {
        setSlots(data);
        setSlotsError(null);
      })
      .catch((error) => {
        setSlotsError(
          error instanceof Error
            ? error.message
            : "Errore nel caricamento degli orari disponibili",
        );
      })
      .finally(() => setIsLoadingSlots(false));
  }, [appointment.professionalId, appointment.data, appointment.ora, date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  const handleDateChange = (value: string) => {
    setDate(value);
    setTime("");
  };

  const validateDate = () => {
    if (!isRequired(date) || !isValidDate(date)) {
      setDateError("Inserisci una data valida (GG/MM/AAAA)");
      return false;
    }
    const chosen = parseDate(date);
    chosen.setHours(0, 0, 0, 0);
    if (chosen.getTime() < today.getTime()) {
      setDateError("Non puoi scegliere una data precedente a oggi");
      return false;
    }
    setDateError("");
    return true;
  };

  const canSave = isRequired(date) && isValidDate(date) && time !== "";

  const handleSave = async () => {
    if (!validateDate() || !time) return;

    setSubmitError("");
    setIsSaving(true);
    try {
      const updated = await updateAppointment(appointment.id, {
        professionalId: appointment.professionalId,
        serviceTypeId: appointment.serviceTypeId,
        data: date,
        ora: time,
        note: note || undefined,
      });
      onSaved(updated);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View>
      <Card variant="flat" style={{ marginBottom: theme.spacing.md }}>
        <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
          Servizio
        </Text>
        <Text
          style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
            ...theme.text.body,
            fontWeight: "700",
          }}
        >
          {appointment.tipologia}
        </Text>
        <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
          Professionista
        </Text>
        <Text
          style={{ color: theme.colors.text, ...theme.text.body, fontWeight: "700" }}
        >
          {appointment.professionista}
        </Text>
      </Card>

      <Text
        style={{
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
          ...theme.text.body,
          fontWeight: "700",
        }}
      >
        Data
      </Text>
      <DateField
        placeholder="Data (GG/MM/AAAA)"
        value={date}
        onChangeText={handleDateChange}
        onBlur={validateDate}
        error={dateError}
        minimumDate={today}
      />

      <Text
        style={{
          color: theme.colors.text,
          marginTop: theme.spacing.sm,
          marginBottom: theme.spacing.xs,
          ...theme.text.body,
          fontWeight: "700",
        }}
      >
        Orario
      </Text>
      {isLoadingSlots ? (
        <LoadingState message="Caricamento orari disponibili..." />
      ) : slotsError ? (
        <EmptyState
          icon="cloud-offline-outline"
          message={slotsError}
          actionLabel="Riprova"
          onAction={loadSlots}
        />
      ) : (
        <TimeSlotPicker slots={slots} value={time} onChange={setTime} />
      )}

      <Text
        style={{
          color: theme.colors.text,
          marginTop: theme.spacing.md,
          marginBottom: theme.spacing.xs,
          ...theme.text.body,
          fontWeight: "700",
        }}
      >
        Note
      </Text>
      <AppTextField
        placeholder="Note (opzionale)"
        value={note}
        onChangeText={setNote}
        multiline
        containerStyle={{ width: "100%" }}
      />

      {submitError ? (
        <Text
          style={{
            color: theme.colors.error,
            marginTop: theme.spacing.sm,
            ...theme.text.caption,
          }}
        >
          {submitError}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.sm,
          marginTop: theme.spacing.lg,
        }}
      >
        <Pressable
          onPress={onDismiss}
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
            Indietro
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={!canSave || isSaving}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radii.md,
            backgroundColor: theme.colors.primary,
            opacity: !canSave || isSaving ? 0.5 : 1,
          }}
        >
          <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
            {isSaving ? "Salvataggio..." : "Salva modifiche"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
