import { Notification, notifications } from "../mocks/notifications.mock";

const DELAY = 800;

export function getNotifications(): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...notifications]), DELAY);
  });
}

export function getUnreadCount(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(
      () => resolve(notifications.filter((n) => !n.letta).length),
      200,
    );
  });
}

export function markAsRead(id: number): Promise<Notification> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notification = notifications.find((n) => n.id === id);

      if (!notification) {
        reject(new Error("Notifica non trovata"));
        return;
      }

      notification.letta = true;
      resolve(notification);
    }, DELAY);
  });
}

export function markAllAsRead(): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      notifications.forEach((notification) => {
        notification.letta = true;
      });
      resolve([...notifications]);
    }, DELAY);
  });
}

export function deleteNotification(id: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = notifications.findIndex((n) => n.id === id);

      if (index === -1) {
        reject(new Error("Notifica non trovata"));
        return;
      }

      notifications.splice(index, 1);
      resolve();
    }, DELAY);
  });
}
