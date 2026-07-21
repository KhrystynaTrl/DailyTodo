import { Ionicons } from "@expo/vector-icons";
import { Href, router, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Modal, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getUnreadCount } from "../../services/notifications.service";
import { formatDate } from "../../utils/date";
import Avatar from "./Avatar";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

// Voci racchiuse nel menu hamburger sul web (dove la tab bar mobile è
// nascosta). "Home" resta raggiungibile toccando il logo, quindi non compare
// qui. Su mobile la navigazione resta affidata alla tab bar.
const WEB_MENU_ITEMS: { label: string; path: Href; icon: IoniconName }[] = [
  { label: "Attività", path: "/daily-activity", icon: "checkbox-outline" },
  { label: "Appuntamenti", path: "/appointments", icon: "calendar-outline" },
  { label: "Acqua", path: "/water-consumed", icon: "water-outline" },
  { label: "Statistiche", path: "/weekly-statistics", icon: "stats-chart-outline" },
];

export default function TopBar() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [webMenuVisible, setWebMenuVisible] = useState(false);

  // Riallinea il conteggio non lette ogni volta che si cambia route (es. al
  // ritorno dalla schermata Notifiche), oltre che al primo montaggio.
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
        <Pressable onPress={() => router.navigate("/home")} hitSlop={8}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ width: 148, height: 38 }}
            resizeMode="contain"
          />
        </Pressable>

        {/* Data centrata nella riga, dietro logo e icone (non intercetta i tocchi) */}
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

          {/* Menu hamburger (solo web, al posto della tab bar mobile) */}
          {Platform.OS === "web" ? (
            <Pressable onPress={() => setWebMenuVisible(true)} hitSlop={8}>
              <Ionicons name="menu" size={28} color={theme.colors.text} />
            </Pressable>
          ) : null}
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

      {/* Menu hamburger di navigazione (solo web) */}
      <Modal
        visible={webMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWebMenuVisible(false)}
      >
        <Pressable
          onPress={() => setWebMenuVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <View
            style={{
              position: "absolute",
              top: insets.top + 60,
              right: theme.spacing.lg,
              minWidth: 220,
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              borderWidth: 1,
              borderColor: theme.colors.border,
              overflow: "hidden",
              ...theme.shadow,
            }}
          >
            {WEB_MENU_ITEMS.map((item, index) => {
              const active =
                pathname === item.path || pathname.startsWith(`${item.path}/`);
              return (
                <React.Fragment key={String(item.path)}>
                  {index > 0 ? (
                    <View
                      style={{ height: 1, backgroundColor: theme.colors.border }}
                    />
                  ) : null}
                  <MenuItem
                    icon={item.icon}
                    label={item.label}
                    active={active}
                    onPress={() => {
                      setWebMenuVisible(false);
                      router.navigate(item.path);
                    }}
                  />
                </React.Fragment>
              );
            })}
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
  active = false,
}: {
  icon: IoniconName;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const { theme } = useTheme();
  const color = active ? theme.colors.primary : theme.colors.text;

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
      <Text
        style={{
          ...theme.text.body,
          color,
          fontWeight: active ? "700" : "400",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
