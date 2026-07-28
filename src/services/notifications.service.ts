// Notifiche reali contro il backend Spring Boot (/api/notifications).
import { Notification } from "../mocks/notifications.mock";
import { formatDate, formatTime } from "../utils/date";
import { apiFetch } from "./api.client";

type BeNotificationType = "APPOINTMENT_CREATED" | "APPOINTMENT_CANCELLED" | "SYSTEM";

type BeNotification = {
  id: number;
  title: string;
  body: string;
  type: BeNotificationType;
  read: boolean;
  refId: number | null;
  createdAt: string;
};

type Page<T> = { content: T[] };

// Il tipo BE descrive la categoria dell'evento, il tipo FE lo stile/severità
// da mostrare in UI: la mappatura è quindi semantica, non 1:1.
function toTipo(type: BeNotificationType): Notification["tipo"] {
  switch (type) {
    case "APPOINTMENT_CREATED":
      return "successo";
    case "APPOINTMENT_CANCELLED":
      return "avviso";
    case "SYSTEM":
    default:
      return "informazione";
  }
}

function toNotification(be: BeNotification): Notification {
  const created = new Date(be.createdAt);

  return {
    id: be.id,
    titolo: be.title,
    messaggio: be.body,
    data: `${formatDate(created)} ${formatTime(created)}`,
    letta: be.read,
    tipo: toTipo(be.type),
  };
}

export async function getNotifications(): Promise<Notification[]> {
  const page = await apiFetch<Page<BeNotification>>("/api/notifications");
  return page.content.map(toNotification);
}

export async function getUnreadCount(): Promise<number> {
  const list = await getNotifications();
  return list.filter((n) => !n.letta).length;
}

export async function markAsRead(id: number): Promise<Notification> {
  const updated = await apiFetch<BeNotification>(
    `/api/notifications/${id}/read`,
    { method: "PATCH" },
  );
  return toNotification(updated);
}

export async function markAllAsRead(): Promise<Notification[]> {
  await apiFetch<void>("/api/notifications/read-all", { method: "PATCH" });
  return getNotifications();
}

export async function deleteNotification(id: number): Promise<void> {
  await apiFetch<void>(`/api/notifications/${id}`, { method: "DELETE" });
}
