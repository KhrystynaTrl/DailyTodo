import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Theme } from "../../theme";
import { Notification } from "../../mocks/notifications.mock";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export type NotificationTypeConfig = {
  icon: IoniconName;
  color: string;
  label: string;
};

// Ogni tipo di notifica usa un token semantico del tema (info/success/
// warning/error), coerente in tema chiaro e scuro.
export function getNotificationTypeConfig(
  tipo: Notification["tipo"],
  theme: Theme,
): NotificationTypeConfig {
  switch (tipo) {
    case "successo":
      return {
        icon: "checkmark-circle",
        color: theme.colors.success,
        label: "Successo",
      };
    case "avviso":
      return { icon: "warning", color: theme.colors.warning, label: "Avviso" };
    case "errore":
      return { icon: "alert-circle", color: theme.colors.error, label: "Errore" };
    case "informazione":
    default:
      return {
        icon: "information-circle",
        color: theme.colors.info,
        label: "Informazione",
      };
  }
}

type NotificationItemProps = {
  notification: Notification;
  onPress: () => void;
  onMarkRead: () => void;
  onRequestDelete: () => void;
  isDeleting: boolean;
  onDeleteComplete: () => void;
};

export default function NotificationItem({
  notification,
  onPress,
  onMarkRead,
  onRequestDelete,
  isDeleting,
  onDeleteComplete,
}: NotificationItemProps) {
  const { theme } = useTheme();
  const config = getNotificationTypeConfig(notification.tipo, theme);
  const isUnread = !notification.letta;

  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isDeleting) return;
    Animated.timing(anim, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start(() => onDeleteComplete());
  }, [isDeleting, anim, onDeleteComplete]);

  const animatedStyle = {
    opacity: anim,
    transform: [
      {
        translateX: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [80, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View style={[animatedStyle, { marginBottom: theme.spacing.sm }]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: theme.spacing.sm,
          backgroundColor: isUnread
            ? theme.colors.surface
            : theme.colors.surfaceAlt,
          borderRadius: theme.radii.lg,
          padding: theme.spacing.md,
          borderLeftWidth: 4,
          borderLeftColor: isUnread ? config.color : "transparent",
          opacity: isUnread ? 1 : 0.75,
        }}
      >
        <Pressable
          onPress={onPress}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: theme.spacing.sm,
            flex: 1,
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

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              {isUnread ? (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: config.color,
                  }}
                />
              ) : null}
              <Text
                style={{
                  flex: 1,
                  color: theme.colors.text,
                  ...theme.text.body,
                  fontWeight: isUnread ? "700" : "500",
                }}
                numberOfLines={1}
              >
                {notification.titolo}
              </Text>
            </View>

            <Text
              style={{
                color: theme.colors.textMuted,
                marginTop: 2,
                ...theme.text.caption,
              }}
              numberOfLines={2}
            >
              {notification.messaggio}
            </Text>

            <Text
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing.xs,
                ...theme.text.caption,
              }}
            >
              {notification.data}
            </Text>
          </View>
        </Pressable>

        <View style={{ gap: theme.spacing.sm, alignItems: "center" }}>
          {isUnread ? (
            <Pressable onPress={onMarkRead} hitSlop={8}>
              <Ionicons
                name="checkmark-done-outline"
                size={20}
                color={theme.colors.primary}
              />
            </Pressable>
          ) : null}
          <Pressable onPress={onRequestDelete} hitSlop={8}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={theme.colors.error}
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
