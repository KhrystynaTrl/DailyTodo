import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Notification } from "../../mocks/notifications.mock";
import { getNotificationTypeConfig } from "./NotificationItem";

export default function NotificationDetailModal({
  notification,
  onClose,
}: {
  notification: Notification | null;
  onClose: () => void;
}) {
  const { theme } = useTheme();
  const config = notification
    ? getNotificationTypeConfig(notification.tipo, theme)
    : null;

  return (
    <Modal
      visible={notification !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
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
          {notification && config ? (
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
                    backgroundColor: config.color + "22",
                  }}
                >
                  <Ionicons name={config.icon} size={22} color={config.color} />
                </View>
                <View
                  style={{
                    backgroundColor: config.color + "22",
                    borderRadius: theme.radii.sm,
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: 2,
                  }}
                >
                  <Text style={{ color: config.color, ...theme.text.caption }}>
                    {config.label}
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
                {notification.titolo}
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  marginBottom: theme.spacing.md,
                  ...theme.text.caption,
                }}
              >
                {notification.data}
              </Text>
              <Text
                style={{
                  color: theme.colors.text,
                  marginBottom: theme.spacing.lg,
                  ...theme.text.body,
                }}
              >
                {notification.messaggio}
              </Text>

              <Pressable
                onPress={onClose}
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: theme.colors.primary,
                  borderRadius: theme.radii.md,
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.lg,
                }}
              >
                <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
                  Chiudi
                </Text>
              </Pressable>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
