import { Appointment, appointments } from "../mocks/appointments.mock";

const DELAY = 800;

export function getAppointments(): Promise<Appointment[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...appointments]), DELAY);
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
