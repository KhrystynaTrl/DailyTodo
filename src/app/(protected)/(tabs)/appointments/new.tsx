import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../../../components/ui/AppButton";
import AppTextField from "../../../../components/ui/AppTextField";
import Card from "../../../../components/ui/Card";
import DateField from "../../../../components/ui/DateField";
import LoadingState from "../../../../components/ui/LoadingState";
import ProgressBar from "../../../../components/ui/ProgressBar";
import { useTheme } from "../../../../context/ThemeContext";
import { Appointment } from "../../../../mocks/appointments.mock";
import { Professional } from "../../../../mocks/professionals.mock";
import { ServiceType } from "../../../../mocks/services.mock";
import {
  addAppointment,
  getAvailableSlots,
  getProfessionals,
  getServiceTypes,
} from "../../../../services/appointments.service";
import { parseDate } from "../../../../utils/date";
import { isRequired, isValidDate } from "../../../../utils/validators";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const TOTAL_STEPS = 6;

const stepTitle: Record<Step, string> = {
  1: "Scegli il servizio",
  2: "Scegli il professionista",
  3: "Scegli la data",
  4: "Scegli l'orario",
  5: "Note",
  6: "Riepilogo",
};

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function NewAppointment() {
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>(1);

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [isLoadingServiceTypes, setIsLoadingServiceTypes] = useState(true);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);

  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");

  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>(
    [],
  );
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");

  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    getServiceTypes()
      .then(setServiceTypes)
      .finally(() => setIsLoadingServiceTypes(false));
  }, []);

  useEffect(() => {
    if (!selectedService) return;
    setIsLoadingProfessionals(true);
    getProfessionals(selectedService.id)
      .then(setProfessionals)
      .finally(() => setIsLoadingProfessionals(false));
  }, [selectedService]);

  useEffect(() => {
    if (!selectedProfessional || !isValidDate(date)) return;
    setIsLoadingSlots(true);
    getAvailableSlots(selectedProfessional.nome, date)
      .then(setSlots)
      .finally(() => setIsLoadingSlots(false));
  }, [selectedProfessional, date]);

  const selectService = (service: ServiceType) => {
    if (selectedService?.id !== service.id) {
      setSelectedProfessional(null);
      setDate("");
      setSelectedTime("");
    }
    setSelectedService(service);
  };

  const selectProfessional = (professional: Professional) => {
    if (selectedProfessional?.id !== professional.id) {
      setDate("");
      setSelectedTime("");
    }
    setSelectedProfessional(professional);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setSelectedTime("");
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

  const canContinue = (): boolean => {
    switch (step) {
      case 1:
        return selectedService !== null;
      case 2:
        return selectedProfessional !== null;
      case 3:
        return isRequired(date) && isValidDate(date);
      case 4:
        return selectedTime !== "";
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step === 3 && !validateDate()) return;
    setStep((s) => (Math.min(s + 1, TOTAL_STEPS) as Step));
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((s) => (Math.max(s - 1, 1) as Step));
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedProfessional) return;

    setSubmitError("");
    try {
      setIsSubmitting(true);
      const created = await addAppointment({
        titolo: selectedService.nome,
        professionista: selectedProfessional.nome,
        tipologia: selectedService.nome,
        data: date,
        ora: selectedTime,
        durata: selectedService.durata,
        stato: "confermato",
        note: note || undefined,
      });
      setCreatedAppointment(created);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante la prenotazione",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdAppointment) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing.lg,
          }}
        >
          <Ionicons
            name="checkmark-circle"
            size={72}
            color={theme.colors.primary}
          />
          <Text
            style={{
              color: theme.colors.text,
              textAlign: "center",
              marginTop: theme.spacing.lg,
              ...theme.text.h1,
            }}
          >
            Appuntamento confermato!
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              textAlign: "center",
              marginTop: theme.spacing.sm,
              marginBottom: theme.spacing.xl,
              ...theme.text.body,
            }}
          >
            {createdAppointment.titolo} con {createdAppointment.professionista}
            {"\n"}
            {createdAppointment.data} · {createdAppointment.ora}
          </Text>

          <AppButton
            title="Vedi appuntamento"
            onPress={() => router.replace("/appointments")}
          />
          <Pressable
            onPress={() => router.replace("/home")}
            style={{ marginTop: theme.spacing.md }}
          >
            <Text style={{ color: theme.colors.primary, ...theme.text.link }}>
              Torna alla Home
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
        <Pressable onPress={handleBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text
          style={{
            color: theme.colors.text,
            marginLeft: theme.spacing.sm,
            ...theme.text.h1,
          }}
        >
          Nuovo appuntamento
        </Text>
      </View>

      <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.md }}>
        <ProgressBar progress={step / TOTAL_STEPS} />
        <Text
          style={{
            color: theme.colors.textMuted,
            marginTop: theme.spacing.xs,
            ...theme.text.caption,
          }}
        >
          Passo {step} di {TOTAL_STEPS} · {stepTitle[step]}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        {step === 1 ? (
          isLoadingServiceTypes ? (
            <LoadingState message="Caricamento servizi..." />
          ) : (
            serviceTypes.map((service) => (
              <SelectableRow
                key={service.id}
                title={service.nome}
                subtitle={`${service.durata} minuti`}
                selected={selectedService?.id === service.id}
                onPress={() => selectService(service)}
              />
            ))
          )
        ) : null}

        {step === 2 ? (
          isLoadingProfessionals ? (
            <LoadingState message="Caricamento professionisti..." />
          ) : (
            professionals.map((professional) => (
              <SelectableRow
                key={professional.id}
                title={professional.nome}
                subtitle={professional.specializzazione}
                selected={selectedProfessional?.id === professional.id}
                onPress={() => selectProfessional(professional)}
              />
            ))
          )
        ) : null}

        {step === 3 ? (
          <DateField
            placeholder="Data (GG/MM/AAAA)"
            value={date}
            onChangeText={handleDateChange}
            onBlur={validateDate}
            error={dateError}
            minimumDate={today}
          />
        ) : null}

        {step === 4 ? (
          isLoadingSlots ? (
            <LoadingState message="Caricamento orari disponibili..." />
          ) : (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: theme.spacing.xs,
              }}
            >
              {slots.map((slot) => (
                <Pressable
                  key={slot.time}
                  disabled={!slot.available}
                  onPress={() => setSelectedTime(slot.time)}
                  style={{
                    backgroundColor:
                      selectedTime === slot.time
                        ? theme.colors.primary
                        : slot.available
                          ? theme.colors.surface
                          : theme.colors.surfaceAlt,
                    opacity: slot.available ? 1 : 0.4,
                    borderRadius: theme.radii.md,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedTime === slot.time
                          ? theme.colors.onPrimary
                          : theme.colors.text,
                      ...theme.text.body,
                    }}
                  >
                    {slot.time}
                  </Text>
                </Pressable>
              ))}
            </View>
          )
        ) : null}

        {step === 5 ? (
          <AppTextField
            placeholder="Note (opzionale)"
            value={note}
            onChangeText={setNote}
            multiline
            containerStyle={{ width: "100%" }}
          />
        ) : null}

        {step === 6 ? (
          <Card variant="flat">
            <SummaryRow label="Servizio" value={selectedService?.nome ?? ""} />
            <SummaryRow
              label="Professionista"
              value={selectedProfessional?.nome ?? ""}
            />
            <SummaryRow label="Data" value={date} />
            <SummaryRow label="Orario" value={selectedTime} />
            <SummaryRow label="Note" value={note || "—"} />

            {submitError ? (
              <Text
                style={{
                  color: theme.colors.error,
                  textAlign: "center",
                  marginTop: theme.spacing.sm,
                  ...theme.text.caption,
                }}
              >
                {submitError}
              </Text>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.sm,
          padding: theme.spacing.lg,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <Pressable
          onPress={handleBack}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text style={{ color: theme.colors.text, ...theme.text.button }}>
            Indietro
          </Text>
        </Pressable>

        {step < TOTAL_STEPS ? (
          <Pressable
            onPress={handleNext}
            disabled={!canContinue()}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primary,
              opacity: canContinue() ? 1 : 0.5,
            }}
          >
            <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
              Avanti
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleConfirm}
            disabled={isSubmitting}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.radii.md,
              backgroundColor: theme.colors.primary,
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
              {isSubmitting ? "Prenotazione..." : "Conferma prenotazione"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function SelectableRow({
  title,
  subtitle,
  selected,
  onPress,
}: {
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={{ marginBottom: theme.spacing.sm }}>
      <Card
        variant="flat"
        style={
          selected
            ? { borderWidth: 2, borderColor: theme.colors.primary }
            : undefined
        }
      >
        <Text
          style={{
            color: theme.colors.text,
            ...theme.text.body,
            fontWeight: selected ? "700" : "400",
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              marginTop: 2,
              ...theme.text.caption,
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
        {label}
      </Text>
      <Text
        style={{ color: theme.colors.text, ...theme.text.body, fontWeight: "700" }}
      >
        {value}
      </Text>
    </View>
  );
}
