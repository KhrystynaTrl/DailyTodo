import React from "react";
import { Image, Modal, Pressable, Text } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function AboutModal({
  visible,
  onClose,
  appVersion,
}: {
  visible: boolean;
  onClose: () => void;
  appVersion: string;
}) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
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
            maxWidth: 360,
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/logo.png")}
            style={{
              width: 64,
              height: 64,
              marginBottom: theme.spacing.md,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
              ...theme.text.h2,
            }}
          >
            DailyTodo
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              textAlign: "center",
              marginBottom: theme.spacing.md,
              ...theme.text.body,
            }}
          >
            La tua app per il benessere quotidiano: attività, appuntamenti,
            idratazione e statistiche in un unico posto.
          </Text>
          <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
            Versione {appVersion}
          </Text>

          <Pressable
            onPress={onClose}
            style={{
              marginTop: theme.spacing.lg,
              alignSelf: "stretch",
              alignItems: "center",
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radii.md,
              paddingVertical: theme.spacing.sm,
            }}
          >
            <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
              Chiudi
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
