import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { changePassword, findByEmail } from "../../services/user.service";
import spacing from "../../theme/spacing";
import { isRequired, isValidEmail, minLength } from "../../utils/validators";
import AppButton from "../ui/AppButton";
import AppTextField from "../ui/AppTextField";
import PasswordField from "../ui/PasswordField";
import AuthHeader from "./AuthHeader";

type Step = "email" | "reset" | "success";

export default function ForgotPasswordForm() {
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const newPasswordRef = useRef<TextInput>(null);
  const confirmNewPasswordRef = useRef<TextInput>(null);

  const validateEmailAddress = () => {
    if (!isValidEmail(email)) {
      setEmailError("Inserisci un indirizzo email valido");
      return false;
    }
    setEmailError("");
    return true;
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

  const handleCheckEmail = async () => {
    setSubmitError("");

    if (!validateEmailAddress()) return;

    try {
      setIsLoading(true);
      const user = await findByEmail(email);

      if (!user) {
        setSubmitError("Nessun account trovato con questa email");
        return;
      }

      setStep("reset");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setSubmitError("");

    const isNewPasswordValid = validateNewPassword();
    const isConfirmNewPasswordValid = validateConfirmNewPassword();

    if (!isNewPasswordValid || !isConfirmNewPasswordValid) return;

    try {
      setIsLoading(true);
      await changePassword(email, newPassword);
      setStep("success");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante il reset",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Pressable
      accessible={false}
      style={[styles.container, { backgroundColor: theme.colors.surfaceAlt }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.form}>
            <AuthHeader />

            {step === "email" ? (
              <>
                <Text
                  style={[
                    { color: theme.colors.text, ...theme.text.body },
                    styles.infoText,
                  ]}
                >
                  Inserisci l'email del tuo account: ti faremo impostare una
                  nuova password.
                </Text>

                <AppTextField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={validateEmailAddress}
                  error={emailError}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="done"
                  onSubmitEditing={() => handleCheckEmail()}
                />

                {submitError ? (
                  <Text
                    style={[
                      { color: theme.colors.error, ...theme.text.caption },
                      styles.errorText,
                    ]}
                  >
                    {submitError}
                  </Text>
                ) : null}

                <AppButton
                  title="Continua"
                  onPress={handleCheckEmail}
                  loading={isLoading}
                />
              </>
            ) : null}

            {step === "reset" ? (
              <>
                <Text
                  style={[
                    { color: theme.colors.text, ...theme.text.body },
                    styles.infoText,
                  ]}
                >
                  Imposta una nuova password per {email}
                </Text>

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
                  onSubmitEditing={() => handleResetPassword()}
                />

                {submitError ? (
                  <Text
                    style={[
                      { color: theme.colors.error, ...theme.text.caption },
                      styles.errorText,
                    ]}
                  >
                    {submitError}
                  </Text>
                ) : null}

                <AppButton
                  title="Reimposta password"
                  onPress={handleResetPassword}
                  loading={isLoading}
                />
              </>
            ) : null}

            {step === "success" ? (
              <>
                <Text
                  style={[
                    { color: theme.colors.primary, ...theme.text.body },
                    styles.infoText,
                  ]}
                >
                  Password aggiornata! Ora puoi accedere con la nuova
                  password.
                </Text>

                <AppButton
                  title="Torna al login"
                  onPress={() => router.replace("/login")}
                />
              </>
            ) : (
              <Pressable onPress={() => router.back()}>
                <Text
                  style={[
                    { color: theme.colors.primary, ...theme.text.link },
                    styles.linkText,
                  ]}
                >
                  Torna al login
                </Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  form: {
    padding: spacing.lg,
  },
  infoText: {
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  linkText: {
    textAlign: "center",
    marginTop: spacing.md,
  },
  errorText: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});
