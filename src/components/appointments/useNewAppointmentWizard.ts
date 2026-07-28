import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Appointment } from "../../mocks/appointments.mock";
import { Professional } from "../../mocks/professionals.mock";
import { ServiceType } from "../../mocks/services.mock";
import {
  addAppointment,
  getAvailableSlots,
  getProfessionals,
  getServiceTypes,
} from "../../services/appointments.service";
import { parseDate } from "../../utils/date";
import { isRequired, isValidDate } from "../../utils/validators";
import { TimeSlot } from "./TimeSlotPicker";

export type AppointmentWizardStep = 1 | 2 | 3 | 4 | 5 | 6;
export const TOTAL_APPOINTMENT_STEPS = 6;

const today = new Date();
today.setHours(0, 0, 0, 0);

export function useNewAppointmentWizard() {
  const [step, setStep] = useState<AppointmentWizardStep>(1);

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

  const [slots, setSlots] = useState<TimeSlot[]>([]);
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
    getAvailableSlots(selectedProfessional.id, date)
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
    setStep(
      (s) => Math.min(s + 1, TOTAL_APPOINTMENT_STEPS) as AppointmentWizardStep,
    );
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((s) => Math.max(s - 1, 1) as AppointmentWizardStep);
  };

  const handleConfirm = async () => {
    if (!selectedService || !selectedProfessional) return;

    setSubmitError("");
    try {
      setIsSubmitting(true);
      const created = await addAppointment({
        professionalId: selectedProfessional.id,
        serviceTypeId: selectedService.id,
        data: date,
        ora: selectedTime,
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

  return {
    step,
    today,
    serviceTypes,
    isLoadingServiceTypes,
    selectedService,
    selectService,
    professionals,
    isLoadingProfessionals,
    selectedProfessional,
    selectProfessional,
    date,
    dateError,
    handleDateChange,
    validateDate,
    slots,
    isLoadingSlots,
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
  };
}
