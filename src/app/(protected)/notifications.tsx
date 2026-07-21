import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getNotificationTypeConfig } from "../../components/notifications/NotificationItem";
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

type Filter = "tutte" | "nonlette" | "lette";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "tutte", label: "Tutte" },
  { key: "nonlette", label: "Non lette" },
  { key: "lette", label: "Lette" },
];

export default function Notifications() {
  const { theme } = useTheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("tutte");
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

  const selectedConfig = selected
    ? getNotificationTypeConfig(selected.tipo, theme)
    : null;

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

      <View
        style={{
          flexDirection: "row",
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
        }}
      >
        {FILTERS.map(({ key, label }) => {
          const active = filter === key;
          const badge = key === "nonlette" && unreadCount > 0;
          return (
            <Pressable
              key={key}
              onPress={() => setFilter(key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
                paddingVertical: theme.spacing.xs,
                paddingHorizontal: theme.spacing.md,
                borderRadius: theme.radii.md,
                backgroundColor: active
                  ? theme.colors.primary
                  : theme.colors.surface,
                borderWidth: 1,
                borderColor: active
                  ? theme.colors.primary
                  : theme.colors.border,
              }}
            >
              <Text
                style={{
                  color: active ? theme.colors.onPrimary : theme.colors.text,
                  ...theme.text.caption,
                }}
              >
                {label}
              </Text>
              {badge ? (
                <View
                  style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    paddingHorizontal: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active
                      ? theme.colors.onPrimary
                      : theme.colors.primary,
                  }}
                >
                  <Text
                    style={{
                      color: active
                        ? theme.colors.primary
                        : theme.colors.onPrimary,
                      fontSize: 11,
                      fontWeight: "700",
                    }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </View>

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
      <Modal
        visible={selected !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable
          onPress={() => setSelected(null)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing.lg,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.lg,
              width: "100%",
              maxWidth: 380,
            }}
          >
            {selected && selectedConfig ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selectedConfig.color + "22",
                    }}
                  >
                    <Ionicons
                      name={selectedConfig.icon}
                      size={22}
                      color={selectedConfig.color}
                    />
                  </View>
                  <View
                    style={{
                      backgroundColor: selectedConfig.color + "22",
                      borderRadius: theme.radii.sm,
                      paddingHorizontal: theme.spacing.sm,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        color: selectedConfig.color,
                        ...theme.text.caption,
                      }}
                    >
                      {selectedConfig.label}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    color: theme.colors.text,
                    marginBottom: theme.spacing.xs,
                    ...theme.text.h2,
                  }}
                >
                  {selected.titolo}
                </Text>
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    marginBottom: theme.spacing.md,
                    ...theme.text.caption,
                  }}
                >
                  {selected.data}
                </Text>
                <Text
                  style={{
                    color: theme.colors.text,
                    marginBottom: theme.spacing.lg,
                    ...theme.text.body,
                  }}
                >
                  {selected.messaggio}
                </Text>

                <Pressable
                  onPress={() => setSelected(null)}
                  style={{
                    alignSelf: "flex-end",
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.radii.md,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.lg,
                  }}
                >
                  <Text
                    style={{
                      color: theme.colors.onPrimary,
                      ...theme.text.button,
                    }}
                  >
                    Chiudi
                  </Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>

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
