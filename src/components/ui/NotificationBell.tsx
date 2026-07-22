import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getUnreadCount } from "../../services/notifications.service";

export default function NotificationBell() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Riallinea il conteggio non lette ogni volta che si cambia route (es. al
  // ritorno dalla schermata Notifiche), oltre che al primo montaggio.
  useEffect(() => {
    getUnreadCount().then(setUnreadCount);
  }, [pathname]);

  return (
    <Pressable onPress={() => router.push("/notifications")} hitSlop={8}>
      <Ionicons name="notifications-outline" size={26} color={theme.colors.text} />
      {unreadCount > 0 ? (
        <View
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            paddingHorizontal: 4,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.colors.error,
            borderWidth: 2,
            borderColor: theme.colors.surface,
          }}
        >
          <Text
            style={{
              color: theme.colors.onPrimary,
              fontSize: 10,
              fontWeight: "700",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
