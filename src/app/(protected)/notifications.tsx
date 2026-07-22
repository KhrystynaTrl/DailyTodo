import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationDetailModal from "../../components/notifications/NotificationDetailModal";
import NotificationFilterBar, {
  NotificationFilter,
} from "../../components/notifications/NotificationFilterBar";
import NotificationList from "../../components/notifications/NotificationList";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import LoadingState from "../../components/ui/LoadingState";
import { useTheme } from "../../context/ThemeContext";
import { Notification } from "../../mocks/notifications.mock";
import {
  deleteNotification,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../../services/notifications.service";

export default function Notifications() {
  const { theme } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<NotificationFilter>("tutte");
  const [selected, setSelected] = useState<Notification | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getNotifications()
      .then(setNotifications)
      .finally(() => setIsLoading(false));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.letta).length,
    [notifications],
  );

  const filtered = useMemo(() => {
    if (filter === "nonlette") return notifications.filter((n) => !n.letta);
    if (filter === "lette") return notifications.filter((n) => n.letta);
    return notifications;
  }, [notifications, filter]);

  const setRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, letta: true } : n)),
    );
  };

  const openDetail = (notification: Notification) => {
    setSelected(notification);
    if (!notification.letta) {
      setRead(notification.id);
      markAsRead(notification.id).catch(() => {});
    }
  };

  const handleMarkRead = (id: number) => {
    setRead(id);
    markAsRead(id).catch(() => {});
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, letta: true })));
    markAllAsRead().catch(() => {});
  };

  // La rimozione avviene in due tempi: prima l'animazione di uscita
  // (deletingId), poi la rimozione effettiva dallo stato e dal servizio.
  const confirmDelete = () => {
    setDeletingId(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const handleDeleteComplete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDeletingId(null);
    deleteNotification(id).catch(() => {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}
        >
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>
          <Text
            style={{
              color: theme.colors.text,
              marginLeft: theme.spacing.sm,
              ...theme.text.h1,
            }}
          >
            Notifiche
          </Text>
        </View>

        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAllRead} hitSlop={8}>
            <Text style={{ color: theme.colors.primary, ...theme.text.link }}>
              Segna tutte come lette
            </Text>
          </Pressable>
        ) : null}
      </View>

      <NotificationFilterBar
        value={filter}
        unreadCount={unreadCount}
        onChange={setFilter}
      />

      {isLoading ? (
        <LoadingState message="Caricamento notifiche..." />
      ) : (
        <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
          <NotificationList
            notifications={filtered}
            emptyMessage={
              filter === "nonlette"
                ? "Nessuna notifica da leggere"
                : filter === "lette"
                  ? "Nessuna notifica letta"
                  : "Non hai ancora notifiche"
            }
            deletingId={deletingId}
            onOpen={openDetail}
            onMarkRead={handleMarkRead}
            onRequestDelete={setPendingDeleteId}
            onDeleteComplete={handleDeleteComplete}
          />
        </ScrollView>
      )}

      {/* Dettaglio notifica */}
      <NotificationDetailModal
        notification={selected}
        onClose={() => setSelected(null)}
      />

      {/* Conferma eliminazione */}
      <ConfirmationModal
        visible={pendingDeleteId !== null}
        title="Eliminare la notifica?"
        message="Questa notifica verrà rimossa in modo definitivo."
        confirmLabel="Elimina"
        cancelLabel="Annulla"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </SafeAreaView>
  );
}
