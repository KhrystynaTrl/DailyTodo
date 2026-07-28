import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  const [serviceTypesError, setServiceTypesError] = useState<string | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null,
  );

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(false);
  const [professionalsError, setProfessionalsError] = useState<string | null>(
    null,
  );
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);

  const [date, setDate] = useState("");
  const [dateError, setDateError] = useState("");

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState("");

  const [note, setNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdAppointment, setCreatedAppointment] =
    useState<Appointment | null>(null);

  const loadServiceTypes = useCallback(() => {
    setIsLoadingServiceTypes(true);
    return getServiceTypes()
      .then((data) => {
        setServiceTypes(data);
        setServiceTypesError(null);
      })
      .catch((error) => {
        setServiceTypesError(
          error instanceof Error
            ? error.message
            : "Errore nel caricamento dei servizi",
        );
      })
      .finally(() => setIsLoadingServiceTypes(false));
  }, []);

  useEffect(() => {
    loadServiceTypes();
  }, [loadServiceTypes]);

  const loadProfessionals = useCallback(() => {
    if (!selectedService) return;
    setIsLoadingProfessionals(true);
    return getProfessionals(selectedService.id)
      .then((data) => {
        setProfessionals(data);
        setProfessionalsError(null);
      })
      .catch((error) => {
        setProfessionalsError(
          error instanceof Error
            ? error.message
            : "Errore nel caricamento dei professionisti",
        );
      })
      .finally(() => setIsLoadingProfessionals(false));
  }, [selectedService]);

  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  const loadSlots = useCallback(() => {
    if (!selectedProfessional || !isValidDate(date)) return;
    setIsLoadingSlots(true);
    return getAvailableSlots(selectedProfessional.id, date)
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
  }, [selectedProfessional, date]);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

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
    serviceTypesError,
    retryServiceTypes: loadServiceTypes,
    selectedService,
    selectService,
    professionals,
    isLoadingProfessionals,
    professionalsError,
    retryProfessionals: loadProfessionals,
    selectedProfessional,
    selectProfessional,
    date,
    dateError,
    handleDateChange,
    validateDate,
    slots,
    isLoadingSlots,
    slotsError,
    retrySlots: loadSlots,
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
