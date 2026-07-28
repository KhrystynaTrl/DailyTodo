import React, { useEffect, useState } from "react";
import { Keyboard, Modal, Platform, View, ViewStyle } from "react-native";
import { useTheme } from "../../context/ThemeContext";

// Il Modal nativo di RN apre una finestra Android separata che spesso non
// riceve gli eventi di resize di KeyboardAvoidingView: ascoltiamo la
// tastiera direttamente e spostiamo il foglio verso l'alto di conseguenza.
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        <View
          style={[
            {
              backgroundColor: theme.colors.background,
              borderTopLeftRadius: theme.radii.lg,
              borderTopRightRadius: theme.radii.lg,
              flexShrink: 1,
              marginBottom: keyboardHeight,
            },
            maxHeight ? { maxHeight } : undefined,
          ]}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}
