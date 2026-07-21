import React from "react";
import { View } from "react-native";
import { Notification } from "../../mocks/notifications.mock";
import EmptyState from "../ui/EmptyState";
import NotificationItem from "./NotificationItem";

type NotificationListProps = {
  notifications: Notification[];
  emptyMessage: string;
  deletingId: number | null;
  onOpen: (notification: Notification) => void;
  onMarkRead: (id: number) => void;
  onRequestDelete: (id: number) => void;
  onDeleteComplete: (id: number) => void;
};

export default function NotificationList({
  notifications,
  emptyMessage,
  deletingId,
  onOpen,
  onMarkRead,
  onRequestDelete,
  onDeleteComplete,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <View>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          isDeleting={deletingId === notification.id}
          onPress={() => onOpen(notification)}
          onMarkRead={() => onMarkRead(notification.id)}
          onRequestDelete={() => onRequestDelete(notification.id)}
          onDeleteComplete={() => onDeleteComplete(notification.id)}
        />
      ))}
    </View>
  );
}
