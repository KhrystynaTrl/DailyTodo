import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonLogIn from "../components/ButtonLogIn";
import colors from "../theme/colors";

function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmailAddress = () => {};
  return (
    <Pressable accessible={false} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView>
          <View style={styles.form}>
            <Text style={styles.h1}>
              Benvenuto nella tua app di gestione degli impegni quotidiani
            </Text>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry={!showPassword}
            />
            <ButtonLogIn />
            <Text style={styles.h3Text}>Password dimenticata? Clicca qui</Text>
            <Text style={styles.h3Text}>Registrati</Text>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.greenLight,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
  form: {
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  h3Text: {
    fontWeight: "600",
    textAlign: "center",
    marginTop: 15,
  },
  h1: {
    fontSize: 24,
    color: colors.greenSages,
    textAlign: "center",
    fontWeight: "800",
    marginBottom: 20,
  },
  iconContainer: {
    padding: 4,
  },
});

export default SignInScreen;
