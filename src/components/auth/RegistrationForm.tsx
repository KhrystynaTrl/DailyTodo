import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import spacing from "../../theme/spacing";
import { isRequired, isValidEmail, minLength } from "../../utils/validators";
import AppButton from "../ui/AppButton";
import AppTextField from "../ui/AppTextField";
import PasswordField from "../ui/PasswordField";
import AuthScreenShell from "./AuthScreenShell";

export default function RegistrationForm() {
  const { theme } = useTheme();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [surname, setSurname] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const surnameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const validateName = () => {
    if (!isRequired(name)) {
      setNameError("Inserisci il tuo nome");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateSurname = () => {
    if (!isRequired(surname)) {
      setSurnameError("Inserisci il tuo cognome");
      return false;
    }
    setSurnameError("");
    return true;
  };

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

  const validateConfirmPassword = () => {
    if (!isRequired(confirmPassword)) {
      setConfirmPasswordError("Conferma la password");
      return false;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Le password non coincidono");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  const handleRegister = async () => {
    setSubmitError("");

    const isNameValid = validateName();
    const isSurnameValid = validateSurname();
    const isEmailValid = validateEmailAddress();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    if (
      !isNameValid ||
      !isSurnameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmPasswordValid
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await register({ name, surname, email, password });
      router.replace("/home");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante la registrazione",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell scrollable>
      <AppTextField
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        onBlur={validateName}
        error={nameError}
        returnKeyType="next"
        onSubmitEditing={() => surnameRef.current?.focus()}
      />

      <AppTextField
        ref={surnameRef}
        placeholder="Cognome"
        value={surname}
        onChangeText={setSurname}
        onBlur={validateSurname}
        error={surnameError}
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />

      <AppTextField
        ref={emailRef}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        onBlur={validateEmailAddress}
        error={emailError}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      <PasswordField
        ref={passwordRef}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        onBlur={validatePassword}
        error={passwordError}
        returnKeyType="next"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />

      <PasswordField
        ref={confirmPasswordRef}
        placeholder="Conferma password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={validateConfirmPassword}
        error={confirmPasswordError}
        returnKeyType="done"
        onSubmitEditing={() => handleRegister()}
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
        title="Registrati"
        onPress={handleRegister}
        loading={isLoading}
      />

      <Pressable onPress={() => router.back()}>
        <Text
          style={[
            { color: theme.colors.primary, ...theme.text.link },
            styles.linkText,
          ]}
        >
          Hai già un account? Accedi
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
