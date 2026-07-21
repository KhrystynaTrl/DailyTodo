import { Notification } from "../mocks/notifications.mock";
import {
  loadNotifications,
  saveNotifications,
} from "../storage/notifications.storage";

export function getNotifications(): Promise<Notification[]> {
  return loadNotifications();
}

export async function getUnreadCount(): Promise<number> {
  const list = await loadNotifications();
  return list.filter((n) => !n.letta).length;
}

export async function markAsRead(id: number): Promise<Notification> {
  const list = await loadNotifications();
  const notification = list.find((n) => n.id === id);

  if (!notification) {
    throw new Error("Notifica non trovata");
  }

  const next = list.map((n) => (n.id === id ? { ...n, letta: true } : n));
  await saveNotifications(next);
  return { ...notification, letta: true };
}

export async function markAllAsRead(): Promise<Notification[]> {
  const list = await loadNotifications();
  const next = list.map((n) => ({ ...n, letta: true }));
  await saveNotifications(next);
  return next;
}

export async function deleteNotification(id: number): Promise<void> {
  const list = await loadNotifications();

  if (!list.some((n) => n.id === id)) {
    throw new Error("Notifica non trovata");
  }

  await saveNotifications(list.filter((n) => n.id !== id));
}
