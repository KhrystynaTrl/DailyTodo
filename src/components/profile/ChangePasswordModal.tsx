import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { isRequired, minLength } from "../../utils/validators";
import AppButton from "../ui/AppButton";
import BottomSheetModal from "../ui/BottomSheetModal";
import ConfirmationModal from "../ui/ConfirmationModal";
import PasswordField from "../ui/PasswordField";

type ChangePasswordModalProps = {
  visible: boolean;
  onClose: () => void;
};

const emptyState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const { theme } = useTheme();
  const { updatePassword } = useAuth();
  const insets = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState(
    emptyState.currentPassword,
  );
  const [newPassword, setNewPassword] = useState(emptyState.newPassword);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState(
    emptyState.confirmNewPassword,
  );
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [discardConfirmVisible, setDiscardConfirmVisible] = useState(false);

  const newPasswordRef = useRef<TextInput>(null);
  const confirmNewPasswordRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!visible) return;
    setCurrentPassword(emptyState.currentPassword);
    setNewPassword(emptyState.newPassword);
    setConfirmNewPassword(emptyState.confirmNewPassword);
    setNewPasswordError("");
    setConfirmNewPasswordError("");
    setSubmitError("");
    setSuccess(false);
  }, [visible]);

  const isDirty =
    currentPassword !== "" || newPassword !== "" || confirmNewPassword !== "";

  const requestClose = () => {
    if (isDirty && !success) {
      setDiscardConfirmVisible(true);
      return;
    }
    onClose();
  };

  const validateNewPassword = () => {
    if (!minLength(newPassword, 8)) {
      setNewPasswordError("La password deve contenere almeno 8 caratteri");
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const validateConfirmNewPassword = () => {
    if (!isRequired(confirmNewPassword)) {
      setConfirmNewPasswordError("Conferma la nuova password");
      return false;
    }
    if (confirmNewPassword !== newPassword) {
      setConfirmNewPasswordError("Le password non coincidono");
      return false;
    }
    setConfirmNewPasswordError("");
    return true;
  };

  const handleSave = async () => {
    setSubmitError("");

    if (!isRequired(currentPassword)) {
      setSubmitError("Inserisci la password attuale");
      return;
    }

    const isNewPasswordValid = validateNewPassword();
    const isConfirmNewPasswordValid = validateConfirmNewPassword();

    if (!isNewPasswordValid || !isConfirmNewPasswordValid) return;

    try {
      setIsSaving(true);
      await updatePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante l'aggiornamento",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      <BottomSheetModal visible={visible} onRequestClose={requestClose}>
        <View
          style={{
            padding: theme.spacing.lg,
            paddingBottom: theme.spacing.lg + insets.bottom,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.lg,
            }}
          >
            <Text style={{ color: theme.colors.text, ...theme.text.h2 }}>
              Cambia password
            </Text>
            <Pressable onPress={requestClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={theme.colors.textMuted} />
            </Pressable>
          </View>

          {success ? (
            <>
              <Text
                style={{
                  color: theme.colors.primary,
                  textAlign: "center",
                  marginBottom: theme.spacing.lg,
                  ...theme.text.body,
                }}
              >
                Password aggiornata con successo
              </Text>
              <AppButton title="Chiudi" onPress={onClose} />
            </>
          ) : (
            <>
              <PasswordField
                placeholder="Password attuale"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                returnKeyType="next"
                onSubmitEditing={() => newPasswordRef.current?.focus()}
              />

              <PasswordField
                ref={newPasswordRef}
                placeholder="Nuova password"
                value={newPassword}
                onChangeText={setNewPassword}
                onBlur={validateNewPassword}
                error={newPasswordError}
                returnKeyType="next"
                onSubmitEditing={() => confirmNewPasswordRef.current?.focus()}
              />

              <PasswordField
                ref={confirmNewPasswordRef}
                placeholder="Conferma nuova password"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                onBlur={validateConfirmNewPassword}
                error={confirmNewPasswordError}
                returnKeyType="done"
                onSubmitEditing={() => handleSave()}
              />

              {submitError ? (
                <Text
                  style={{
                    color: theme.colors.error,
                    textAlign: "center",
                    marginBottom: theme.spacing.sm,
                    ...theme.text.caption,
                  }}
                >
                  {submitError}
                </Text>
              ) : null}

              <AppButton title="Salva" onPress={handleSave} loading={isSaving} />

              <Pressable
                onPress={handleCancel}
                style={{ marginTop: theme.spacing.sm }}
              >
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    textAlign: "center",
                    ...theme.text.link,
                  }}
                >
                  Annulla
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </BottomSheetModal>

      <ConfirmationModal
        visible={discardConfirmVisible}
        title="Uscire senza salvare?"
        message="Le modifiche alla password andranno perse."
        confirmLabel="Esci"
        cancelLabel="Continua"
        onConfirm={() => {
          setDiscardConfirmVisible(false);
          onClose();
        }}
        onCancel={() => setDiscardConfirmVisible(false)}
      />
    </>
  );
}
