import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentConfirmation from "../../../../components/appointments/AppointmentConfirmation";
import TimeSlotPicker from "../../../../components/appointments/TimeSlotPicker";
import {
  AppointmentWizardStep,
  TOTAL_APPOINTMENT_STEPS,
  useNewAppointmentWizard,
} from "../../../../components/appointments/useNewAppointmentWizard";
import AppTextField from "../../../../components/ui/AppTextField";
import Card from "../../../../components/ui/Card";
import DateField from "../../../../components/ui/DateField";
import EmptyState from "../../../../components/ui/EmptyState";
import LoadingState from "../../../../components/ui/LoadingState";
import ProgressBar from "../../../../components/ui/ProgressBar";
import { useTheme } from "../../../../context/ThemeContext";

const stepTitle: Record<AppointmentWizardStep, string> = {
  1: "Scegli il servizio",
  2: "Scegli il professionista",
  3: "Scegli la data",
  4: "Scegli l'orario",
  5: "Note",
  6: "Riepilogo",
};

export default function NewAppointment() {
  const { theme } = useTheme();
  const {
    step,
    today,
    serviceTypes,
    isLoadingServiceTypes,
    serviceTypesError,
    retryServiceTypes,
    selectedService,
    selectService,
    professionals,
    isLoadingProfessionals,
    professionalsError,
    retryProfessionals,
    selectedProfessional,
    selectProfessional,
    date,
    dateError,
    handleDateChange,
    validateDate,
    slots,
    isLoadingSlots,
    slotsError,
    retrySlots,
    selectedTime,
    setSelectedTime,
    note,
    setNote,
    isSubmitting,
    submitError,
    createdAppointment,
    canContinue,
    handleNext,
    handleBack,
    handleConfirm,
  } = useNewAppointmentWizard();

  if (createdAppointment) {
    return (
      <AppointmentConfirmation
        appointment={createdAppointment}
        onViewAppointment={() => router.replace("/appointments")}
        onGoHome={() => router.replace("/home")}
      />
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
        <ProgressBar progress={step / TOTAL_APPOINTMENT_STEPS} />
        <Text
          style={{
            color: theme.colors.textMuted,
            marginTop: theme.spacing.xs,
            ...theme.text.caption,
          }}
        >
          Passo {step} di {TOTAL_APPOINTMENT_STEPS} · {stepTitle[step]}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        {step === 1 ? (
          <SelectionStep
            isLoading={isLoadingServiceTypes}
            loadingMessage="Caricamento servizi..."
            emptyMessage="Nessun servizio disponibile al momento"
            error={serviceTypesError}
            onRetry={retryServiceTypes}
            items={serviceTypes}
            keyExtractor={(service) => service.id}
            getTitle={(service) => service.nome}
            getSubtitle={(service) => `${service.durata} minuti`}
            isSelected={(service) => selectedService?.id === service.id}
            onSelect={selectService}
          />
        ) : null}

        {step === 2 ? (
          <SelectionStep
            isLoading={isLoadingProfessionals}
            loadingMessage="Caricamento professionisti..."
            emptyMessage="Nessun professionista disponibile per questo servizio"
            error={professionalsError}
            onRetry={retryProfessionals}
            items={professionals}
            keyExtractor={(professional) => professional.id}
            getTitle={(professional) => professional.nome}
            getSubtitle={(professional) => professional.specializzazione}
            isSelected={(professional) =>
              selectedProfessional?.id === professional.id
            }
            onSelect={selectProfessional}
          />
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
          ) : slotsError ? (
            <EmptyState
              icon="cloud-offline-outline"
              message={slotsError}
              actionLabel="Riprova"
              onAction={retrySlots}
            />
          ) : (
            <TimeSlotPicker
              slots={slots}
              value={selectedTime}
              onChange={setSelectedTime}
            />
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

        {step < TOTAL_APPOINTMENT_STEPS ? (
          <Pressable
            onPress={handleNext}
            disabled={!canContinue()}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: theme.spacing.md,
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
              paddingVertical: theme.spacing.md,
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

// Step 1 e 2 sono liste selezionabili identiche a parte i dati (servizi vs
// professionisti): un solo componente generico evita di duplicare il
// rendering "loading / elenco selezionabile".
function SelectionStep<T>({
  isLoading,
  loadingMessage,
  emptyMessage,
  error,
  onRetry,
  items,
  keyExtractor,
  getTitle,
  getSubtitle,
  isSelected,
  onSelect,
}: {
  isLoading: boolean;
  loadingMessage: string;
  emptyMessage: string;
  error?: string | null;
  onRetry?: () => void;
  items: T[];
  keyExtractor: (item: T) => string | number;
  getTitle: (item: T) => string;
  getSubtitle?: (item: T) => string | undefined;
  isSelected: (item: T) => boolean;
  onSelect: (item: T) => void;
}) {
  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (error) {
    return (
      <EmptyState
        icon="cloud-offline-outline"
        message={error}
        actionLabel="Riprova"
        onAction={onRetry}
      />
    );
  }
  if (items.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <>
      {items.map((item) => (
        <SelectableRow
          key={keyExtractor(item)}
          title={getTitle(item)}
          subtitle={getSubtitle?.(item)}
          selected={isSelected(item)}
          onPress={() => onSelect(item)}
        />
      ))}
    </>
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
