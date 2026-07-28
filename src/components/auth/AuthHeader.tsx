import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import spacing from "../../theme/spacing";

export default function AuthHeader() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text
        style={[
          theme.text.body,
          { color: theme.colors.primary, textAlign: "center" },
        ]}
      >
        Benvenuto nella tua app di gestione degli impegni quotidiani!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 300,
    height: 120,
    alignSelf: "center",
    marginBottom: spacing.xl,
  },
});
