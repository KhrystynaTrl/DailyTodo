import React from "react";
import { KeyboardAvoidingView, Modal, Platform, View, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function BottomSheetModal({
  visible,
  onRequestClose,
  maxHeight,
  children,
}: {
  visible: boolean;
  onRequestClose: () => void;
  maxHeight?: ViewStyle["maxHeight"];
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          justifyContent: "flex-end",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={maxHeight ? { maxHeight } : undefined}
        >
          <View
            style={{
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.radii.lg,
              borderTopRightRadius: theme.radii.lg,
              flexShrink: 1,
            }}
          >
            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
