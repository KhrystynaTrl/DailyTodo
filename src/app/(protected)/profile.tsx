import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileForm from "../../components/profile/ProfileForm";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const { theme } = useTheme();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);

  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  hasUnsavedChangesRef.current = hasUnsavedChanges;

  const handleBack = () => {
    if (hasUnsavedChangesRef.current) {
      setExitConfirmVisible(true);
      return;
    }
    router.back();
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (hasUnsavedChangesRef.current) {
          setExitConfirmVisible(true);
          return true;
        }
        return false;
      },
    );

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.sm,
          }}
        >
          <Pressable onPress={handleBack} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>
          <Text
            style={{
              color: theme.colors.text,
              marginLeft: theme.spacing.sm,
              ...theme.text.h1,
            }}
          >
            Profilo
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
          <ProfileForm onDirtyChange={setHasUnsavedChanges} />
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmationModal
        visible={exitConfirmVisible}
        title="Uscire senza salvare?"
        message="Le modifiche al profilo andranno perse."
        confirmLabel="Esci"
        cancelLabel="Continua"
        onConfirm={() => {
          setExitConfirmVisible(false);
          router.back();
        }}
        onCancel={() => setExitConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}
