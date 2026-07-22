import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "./Avatar";
import TopBarMenuItem from "./TopBarMenuItem";

export default function ProfileMenu() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);

  const displayName = user?.name ?? user?.email.split("@")[0] ?? "Utente";
  const initials =
    user?.name && user?.surname
      ? `${user.name[0]}${user.surname[0]}`.toUpperCase()
      : (displayName[0]?.toUpperCase() ?? "?");

  return (
    <>
      <Avatar label={initials} onPress={() => setVisible(true)} />

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
            <TopBarMenuItem
              icon="person-outline"
              label="Profilo"
              onPress={() => {
                setVisible(false);
                router.push("/profile");
              }}
            />
            <View style={{ height: 1, backgroundColor: theme.colors.border }} />
            <TopBarMenuItem
              icon="settings-outline"
              label="Impostazioni"
              onPress={() => {
                setVisible(false);
                router.push("/preferences");
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
