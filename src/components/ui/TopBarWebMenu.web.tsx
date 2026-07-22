import { Ionicons } from "@expo/vector-icons";
import { Href, router, usePathname } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import TopBarMenuItem, { IoniconName } from "./TopBarMenuItem";

// Voci racchiuse nel menu hamburger sul web (dove la tab bar mobile è
// nascosta). "Home" resta raggiungibile toccando il logo, quindi non compare
// qui. Su mobile questo componente non viene mai renderizzato.
const WEB_MENU_ITEMS: { label: string; path: Href; icon: IoniconName }[] = [
  { label: "Attività", path: "/daily-activity", icon: "checkbox-outline" },
  { label: "Appuntamenti", path: "/appointments", icon: "calendar-outline" },
  { label: "Acqua", path: "/water-consumed", icon: "water-outline" },
  { label: "Statistiche", path: "/weekly-statistics", icon: "stats-chart-outline" },
];

export default function TopBarWebMenu() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setVisible(true)} hitSlop={8}>
        <Ionicons name="menu" size={28} color={theme.colors.text} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          onPress={() => setVisible(false)}
          style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <View
            style={{
              position: "absolute",
              top: insets.top + 60,
              left: theme.spacing.sm,
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
                  <TopBarMenuItem
                    icon={item.icon}
                    label={item.label}
                    active={active}
                    onPress={() => {
                      setVisible(false);
                      router.navigate(item.path);
                    }}
                  />
                </React.Fragment>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
