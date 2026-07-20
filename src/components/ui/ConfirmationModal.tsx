import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmLabel = "Conferma",
  cancelLabel = "Annulla",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.lg,
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.lg,
            padding: theme.spacing.lg,
            width: "100%",
            maxWidth: 360,
          }}
        >
          <Text
            style={{
              color: theme.colors.text,
              marginBottom: theme.spacing.sm,
              ...theme.text.h2,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: theme.colors.textMuted,
              marginBottom: theme.spacing.lg,
              ...theme.text.body,
            }}
          >
            {message}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: theme.spacing.sm,
            }}
          >
            <Pressable
              onPress={onCancel}
              style={{
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
              }}
            >
              <Text
                style={{ color: theme.colors.textMuted, ...theme.text.button }}
              >
                {cancelLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={{
                backgroundColor: theme.colors.error,
                borderRadius: theme.radii.md,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
              }}
            >
              <Text
                style={{ color: theme.colors.onPrimary, ...theme.text.button }}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
