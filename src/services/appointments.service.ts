// Appuntamenti reali contro il backend Spring Boot (/api/appointments,
// /api/services, /api/professionals).
import { Appointment } from "../mocks/appointments.mock";
import { Professional } from "../mocks/professionals.mock";
import { ServiceType } from "../mocks/services.mock";
import {
  combineDateAndTime,
  formatDate,
  formatTime,
  parseDate,
  toIsoDate,
  toLocalDateTimeString,
} from "../utils/date";
import { ApiError, apiFetch } from "./api.client";

type BeAppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

type BeAppointment = {
  id: number;
  professionalId: number;
  professionalName: string;
  serviceTypeId: number;
  serviceTypeName: string;
  scheduledAt: string;
  endAt: string;
  durationMinutes: number;
  status: BeAppointmentStatus;
  notes: string | null;
  createdAt: string;
};

type BeServiceType = {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
  durationMinutes: number;
};

type BeProfessional = {
  id: number;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  rating: number;
  serviceTypeName: string;
};

type BeAvailabilitySlot = { start: string; end: string };

type Page<T> = { content: T[] };

const statoMap: Record<BeAppointmentStatus, Appointment["stato"]> = {
  CONFIRMED: "confermato",
  PENDING: "in attesa",
  CANCELLED: "annullato",
};

function toAppointment(be: BeAppointment): Appointment {
  const scheduled = new Date(be.scheduledAt);

  return {
    id: be.id,
    titolo: be.serviceTypeName,
    professionista: be.professionalName,
    professionalId: be.professionalId,
    tipologia: be.serviceTypeName,
    serviceTypeId: be.serviceTypeId,
    data: formatDate(scheduled),
    ora: formatTime(scheduled),
    durata: be.durationMinutes,
    stato: statoMap[be.status],
    note: be.notes ?? undefined,
  };
}

function toServiceType(be: BeServiceType): ServiceType {
  return { id: be.id, nome: be.name, durata: be.durationMinutes };
}

function toProfessional(be: BeProfessional): Professional {
  return { id: be.id, nome: be.name, specializzazione: be.serviceTypeName };
}

export async function getAppointments(): Promise<Appointment[]> {
  const page = await apiFetch<Page<BeAppointment>>("/api/appointments");
  return page.content.map(toAppointment);
}

// Restituisce undefined solo se l'appuntamento non esiste davvero (404): gli
// altri errori (rete, backend) vengono rilanciati, così il chiamante può
// distinguere "non trovato" da "impossibile caricare" e offrire un retry.
export async function getAppointmentById(
  id: number,
): Promise<Appointment | undefined> {
  try {
    const be = await apiFetch<BeAppointment>(`/api/appointments/${id}`);
    return toAppointment(be);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

export async function getServiceTypes(): Promise<ServiceType[]> {
  const page = await apiFetch<Page<BeServiceType>>("/api/services");
  return page.content.map(toServiceType);
}

export async function getProfessionals(
  serviceTypeId: number,
): Promise<Professional[]> {
  const page = await apiFetch<Page<BeProfessional>>(
    `/api/services/${serviceTypeId}/professionals`,
  );
  return page.content.map(toProfessional);
}

// `currentSlot` mantiene selezionabile l'orario già occupato dall'appuntamento
// in modifica: il backend restituisce solo gli slot davvero liberi, quindi lo
// slot corrente (occupato proprio da questo appuntamento) non comparirebbe.
export async function getAvailableSlots(
  professionalId: number,
  date: string,
  currentSlot?: { data: string; ora: string },
): Promise<{ time: string; available: boolean }[]> {
  const isoDate = toIsoDate(parseDate(date));
  const beSlots = await apiFetch<BeAvailabilitySlot[]>(
    `/api/professionals/${professionalId}/availability?date=${isoDate}`,
  );

  const slots = beSlots.map((slot) => ({
    time: formatTime(new Date(slot.start)),
    available: true,
  }));

  if (
    currentSlot &&
    currentSlot.data === date &&
    !slots.some((s) => s.time === currentSlot.ora)
  ) {
    slots.push({ time: currentSlot.ora, available: true });
    slots.sort((a, b) => a.time.localeCompare(b.time));
  }

  return slots;
}

export async function addAppointment(input: {
  professionalId: number;
  serviceTypeId: number;
  data: string;
  ora: string;
  note?: string;
}): Promise<Appointment> {
  const scheduled = combineDateAndTime(input.data, input.ora);
  const created = await apiFetch<BeAppointment>("/api/appointments", {
    method: "POST",
    body: {
      professionalId: input.professionalId,
      serviceTypeId: input.serviceTypeId,
      scheduledAt: toLocalDateTimeString(scheduled),
      notes: input.note ?? null,
    },
  });
  return toAppointment(created);
}

export async function updateAppointment(
  id: number,
  input: {
    professionalId: number;
    serviceTypeId: number;
    data: string;
    ora: string;
    note?: string;
  },
): Promise<Appointment> {
  const scheduled = combineDateAndTime(input.data, input.ora);
  const updated = await apiFetch<BeAppointment>(`/api/appointments/${id}`, {
    method: "PUT",
    body: {
      professionalId: input.professionalId,
      serviceTypeId: input.serviceTypeId,
      scheduledAt: toLocalDateTimeString(scheduled),
      notes: input.note ?? null,
    },
  });
  return toAppointment(updated);
}

export async function cancelAppointment(id: number): Promise<Appointment> {
  const updated = await apiFetch<BeAppointment>(
    `/api/appointments/${id}/cancel`,
    { method: "PATCH" },
  );
  return toAppointment(updated);
}
