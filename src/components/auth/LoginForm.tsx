import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import AppButton from "../../components/ui/AppButton";
import AppTextField from "../../components/ui/AppTextField";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import spacing from "../../theme/spacing";
import { isValidEmail, minLength } from "../../utils/validators";
import PasswordField from "../ui/PasswordField";
import AuthScreenShell from "./AuthScreenShell";

export default function LoginForm() {
  const { login } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

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
    <AuthScreenShell>
      <AppTextField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={validateEmailAddress}
        error={emailError}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        blurOnSubmit={false}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <PasswordField
        ref={passwordRef}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onBlur={validatePassword}
        error={passwordError}
        returnKeyType="done"
        onSubmitEditing={() => handleLogin()}
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

      <AppButton title="Accedi" onPress={handleLogin} loading={isLoading} />

      <Pressable onPress={() => router.push("/forgot-password")}>
        <Text
          style={[
            { color: theme.colors.primary, ...theme.text.link },
            styles.linkText,
          ]}
        >
          Password dimenticata? Clicca qui
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push("/register")}>
        <Text
          style={[
            { color: theme.colors.primary, ...theme.text.link },
            styles.linkText,
          ]}
        >
          Registrati
        </Text>
      </Pressable>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  linkText: {
    textAlign: "center",
    marginTop: spacing.md,
  },
  errorText: {
    textAlign: "center",
    marginBottom: spacing.sm,
  },
});
