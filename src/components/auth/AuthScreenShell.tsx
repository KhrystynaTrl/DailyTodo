import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import spacing from "../../theme/spacing";
import AuthHeader from "./AuthHeader";

export default function AuthScreenShell({
  scrollable = false,
  children,
}: {
  scrollable?: boolean;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessible={false}
      style={[styles.container, { backgroundColor: theme.colors.surfaceAlt }]}
    >
      <KeyboardAvoidingView
        style={[styles.keyboardAvoidingView, !scrollable && styles.centered]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={[styles.safeArea, !scrollable && styles.centered]}>
          {scrollable ? (
            <ScrollView contentContainerStyle={styles.form}>
              <AuthHeader />
              {children}
            </ScrollView>
          ) : (
            <View style={styles.form}>
              <AuthHeader />
              {children}
            </View>
          )}
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
  },
  centered: {
    justifyContent: "center",
  },
  safeArea: {
    flex: 1,
  },
  form: {
    padding: spacing.lg,
  },
});
