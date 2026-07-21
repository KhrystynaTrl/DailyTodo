import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getUnreadCount } from "../../services/notifications.service";
import { formatDate } from "../../utils/date";
import Avatar from "./Avatar";

export default function TopBar() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    getUnreadCount().then(setUnreadCount);
  }, [pathname]);

  const displayName = user?.name ?? user?.email.split("@")[0] ?? "Utente";
  const initials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
      : (displayName[0]?.toUpperCase() ?? "?");

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: theme.spacing.sm,
          paddingRight: theme.spacing.lg,
          paddingVertical: theme.spacing.sm,
        }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 148, height: 38 }}
          resizeMode="contain"
        />

        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            color: theme.colors.textMuted,
            ...theme.text.caption,
          }}
        >
          {formatDate(new Date())}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.md,
          }}
        >
          <Pressable onPress={() => router.push("/notifications")} hitSlop={8}>
            <Ionicons
              name="notifications-outline"
              size={26}
              color={theme.colors.text}
            />
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
          <Avatar label={initials} onPress={() => setMenuVisible(true)} />
        </View>
      </View>

      {/* Menu Profilo / Impostazioni (apertura dall'avatar) */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          onPress={() => setMenuVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <View
            style={{
              position: "absolute",
              top: insets.top + 60,
              right: theme.spacing.lg,
              minWidth: 200,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
              ...theme.shadow,
            }}
          >
            <MenuItem
              icon="person-outline"
              label="Profilo"
              onPress={() => {
                setMenuVisible(false);
                router.push("/profile");
              }}
            />
            <View style={{ height: 1, backgroundColor: theme.colors.border }} />
            <MenuItem
              icon="settings-outline"
              label="Impostazioni"
              onPress={() => {
                setMenuVisible(false);
                router.push("/preferences");
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
        pressed && { backgroundColor: theme.colors.surfaceAlt },
      ]}
    >
      <Ionicons name={icon} size={20} color={theme.colors.primary} />
      <Text style={{ color: theme.colors.text, ...theme.text.body }}>
        {label}
      </Text>
    </Pressable>
  );
}
