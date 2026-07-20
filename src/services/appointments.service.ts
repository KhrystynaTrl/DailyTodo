import { Appointment, appointments } from "../mocks/appointments.mock";
import { Professional, professionals } from "../mocks/professionals.mock";
import { ServiceType, serviceTypes } from "../mocks/services.mock";

const DELAY = 800;

const DAILY_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

export function getAppointments(): Promise<Appointment[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...appointments]), DELAY);
  });
}

export function getServiceTypes(): Promise<ServiceType[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...serviceTypes]), DELAY);
  });
}

export function getProfessionals(serviceTypeId?: number): Promise<Professional[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!serviceTypeId) {
        resolve([...professionals]);
        return;
      }

      const matching = professionals.filter((p) =>
        p.serviceTypeIds.includes(serviceTypeId),
      );

      resolve(matching.length > 0 ? matching : [...professionals]);
    }, DELAY);
  });
}

export function getAvailableSlots(
  professionalName: string,
  date: string,
): Promise<{ time: string; available: boolean }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const taken = new Set(
        appointments
          .filter(
            (a) =>
              a.professionista === professionalName &&
              a.data === date &&
              a.stato !== "annullato",
          )
          .map((a) => a.ora),
      );

      resolve(
        DAILY_SLOTS.map((time) => ({ time, available: !taken.has(time) })),
      );
    }, DELAY);
  });
}

export function addAppointment(
  appointment: Omit<Appointment, "id">,
): Promise<Appointment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAppointment: Appointment = {
        ...appointment,
        id: Math.max(0, ...appointments.map((a) => a.id)) + 1,
      };
      appointments.push(newAppointment);
      resolve(newAppointment);
    }, DELAY);
  });
}

export function updateAppointment(
  id: number,
  changes: Partial<Omit<Appointment, "id">>,
): Promise<Appointment> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const appointment = appointments.find((a) => a.id === id);

      if (!appointment) {
        reject(new Error("Appuntamento non trovato"));
        return;
      }

      Object.assign(appointment, changes);
      resolve(appointment);
    }, DELAY);
  });
}

export function cancelAppointment(id: number): Promise<Appointment> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const appointment = appointments.find((a) => a.id === id);

      if (!appointment) {
        reject(new Error("Appuntamento non trovato"));
        return;
      }

      appointment.stato = "annullato";
      resolve(appointment);
    }, DELAY);
  });
}
