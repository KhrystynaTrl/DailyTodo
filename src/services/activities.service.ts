// Attività giornaliere reali contro il backend Spring Boot (/api/activities).
import { Activity } from "../mocks/activities.mock";
import { formatDate, formatTime, isValidTime, parseDate } from "../utils/date";
import { apiFetch } from "./api.client";

type BeCategory = "ALLENAMENTO" | "SALUTE" | "ALIMENTAZIONE" | "ALTRO";
type BePriority = "BASSA" | "MEDIA" | "ALTA";

type BeActivity = {
  id: number;
  title: string;
  description: string | null;
  category: BeCategory;
  priority: BePriority;
  scheduledAt: string;
  durationMin: number | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
};

function toActivity(be: BeActivity): Activity {
  const scheduled = new Date(be.scheduledAt);

  return {
    id: be.id,
    titolo: be.title,
    descrizione: be.description ?? undefined,
    categoria: be.category.toLowerCase() as Activity["categoria"],
    data: formatDate(scheduled),
    ora: formatTime(scheduled),
    completata: be.completed,
    priorita: be.priority.toLowerCase() as Activity["priorita"],
    durataMinuti: be.durationMin ?? undefined,
  };
}

// Il backend tratta scheduledAt come LocalDateTime (nessun fuso orario): va
// quindi mandato come orario "muro" così com'è, MAI con Date#toISOString(),
// che convertirebbe in UTC e sfaserebbe l'orario della differenza di fuso.
function toLocalDateTimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function toBeBody(activity: Omit<Activity, "id">) {
  const scheduled = parseDate(activity.data);

  if (activity.ora && isValidTime(activity.ora)) {
    const [hours, minutes] = activity.ora.split(":").map(Number);
    scheduled.setHours(hours, minutes, 0, 0);
  } else {
    scheduled.setHours(0, 0, 0, 0);
  }

  return {
    title: activity.titolo,
    description: activity.descrizione ?? null,
    category: activity.categoria.toUpperCase() as BeCategory,
    priority: activity.priorita.toUpperCase() as BePriority,
    scheduledAt: toLocalDateTimeString(scheduled),
    durationMin: activity.durataMinuti ?? null,
    completed: activity.completata,
  };
}

type Page<T> = { content: T[] };

export async function getActivities(): Promise<Activity[]> {
  const page = await apiFetch<Page<BeActivity>>("/api/activities");
  return page.content.map(toActivity);
}

export async function addActivity(
  activity: Omit<Activity, "id">,
): Promise<Activity> {
  const created = await apiFetch<BeActivity>("/api/activities", {
    method: "POST",
    body: toBeBody(activity),
  });
  return toActivity(created);
}

export async function updateActivity(
  id: number,
  activity: Omit<Activity, "id">,
): Promise<Activity> {
  const updated = await apiFetch<BeActivity>(`/api/activities/${id}`, {
    method: "PUT",
    body: toBeBody(activity),
  });
  return toActivity(updated);
}

export async function deleteActivity(id: number): Promise<void> {
  await apiFetch<void>(`/api/activities/${id}`, { method: "DELETE" });
}

export async function toggleActivityCompletata(
  activity: Activity,
): Promise<Activity> {
  const updated = await apiFetch<BeActivity>(
    `/api/activities/${activity.id}/complete`,
    { method: "PATCH" },
  );
  return toActivity(updated);
}
