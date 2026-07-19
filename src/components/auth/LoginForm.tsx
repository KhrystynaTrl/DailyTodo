import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "../../components/auth/AuthHeader";
import AppButton from "../../components/ui/AppButton";
import AppTextField from "../../components/ui/AppTextField";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import spacing from "../../theme/spacing";
import { isValidEmail, minLength } from "../../utils/validators";
import PasswordField from "../ui/PasswordField";

export default function LoginForm() {
  const { login } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmailAddress = () => {
    if (!isValidEmail(email)) {
      setEmailError("Inserisci un indirizzo email valido");
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (!minLength(password, 8)) {
      setPasswordError("La password deve contenere almeno 8 caratteri");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    setSubmitError("");

    const isEmailValid = validateEmailAddress();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) return;

    try {
      setIsLoading(true);
      await login({ email, password });
      router.replace("/home");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante il login",
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

            <AppTextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              onBlur={validateEmailAddress}
              error={emailError}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <PasswordField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
              error={passwordError}
            />

            {submitError ? (
              <Text
                style={[
                  theme.components.input.errorText,
                  styles.errorText,
                ]}
              >
                {submitError}
              </Text>
            ) : null}

            <AppButton
              title="Accedi"
              onPress={handleLogin}
              loading={isLoading}
            />

            <Text
              style={[
                theme.components.text.link,
                styles.linkText,
              ]}
            >
              Password dimenticata? Clicca qui
            </Text>
            <Text style={[theme.components.text.link, styles.linkText]}>
              Registrati
            </Text>
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
  linkText: {
    textAlign: "center",
    marginTop: spacing.md,
  },
  errorText: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});
