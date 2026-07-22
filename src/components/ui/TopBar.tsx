import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { formatDate } from "../../utils/date";
import NotificationBell from "./NotificationBell";
import ProfileMenu from "./ProfileMenu";
import TopBarWebMenu from "./TopBarWebMenu";

export default function TopBar() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
          }}
        >
          {/* Menu hamburger di navigazione (solo web, al posto della tab bar mobile) */}
          <TopBarWebMenu />

          <Pressable onPress={() => router.navigate("/home")} hitSlop={8}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 148, height: 38 }}
              resizeMode="contain"
            />
          </Pressable>
        </View>

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
          <NotificationBell />
          <ProfileMenu />
        </View>
      </View>
    </View>
  );
}
