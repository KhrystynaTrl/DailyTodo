export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const parseDate = (value: string): Date => {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const isToday = (value: string): boolean => {
  return value === formatDate(new Date());
};

export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  return [day, month, year].filter(Boolean).join("/");
};

export const formatTimeInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);

  return [hours, minutes].filter(Boolean).join(":");
};

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

export const shortDayLabel = (date: Date): string => DAY_LABELS[date.getDay()];

// Lunedì della settimana (Lun-Dom) contenente `date`.
export const mondayOf = (date: Date): Date => {
  const result = new Date(date);
  const day = (result.getDay() + 6) % 7;
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const toIsoDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

// Il backend tratta le date come LocalDate "muro": va parsata senza passare
// da UTC (new Date("YYYY-MM-DD") sposterebbe il giorno vicino ai cambi fuso).
export const parseIsoDate = (value: string): Date => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDayMonth = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

export const isValidTime = (value: string): boolean => {
  const match = value.trim().match(/^(\d{2}):(\d{2})$/);
  if (!match) return false;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
};

// Il backend tratta i LocalDateTime come orario "muro" (nessun fuso): va
// quindi mandato così com'è, MAI con Date#toISOString(), che convertirebbe in
// UTC e sfaserebbe l'orario della differenza di fuso.
export const toLocalDateTimeString = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
};

// Se l'ora non è specificata, usiamo quella attuale (con un margine di 1
// minuto) invece di mezzanotte: per una data odierna, mezzanotte è già nel
// passato e verrebbe respinta dal backend, che non accetta appuntamenti/
// attività con data/ora nel passato. Il margine serve perché il formato
// inviato (toLocalDateTimeString) tronca i secondi a ":00" — senza margine,
// l'orario troncato risulterebbe già nel passato rispetto a "adesso" appena
// la richiesta raggiunge il backend.
export const combineDateAndTime = (data: string, ora: string): Date => {
  const combined = parseDate(data);

  if (ora && isValidTime(ora)) {
    const [hours, minutes] = ora.split(":").map(Number);
    combined.setHours(hours, minutes, 0, 0);
  } else {
    const now = new Date(Date.now() + 60_000);
    combined.setHours(now.getHours(), now.getMinutes(), 0, 0);
  }

  return combined;
};
