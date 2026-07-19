import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

type PasswordFieldProps = TextInputProps & {
  error?: string;
};

export default function PasswordField({
  error,
  style,
  ...props
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;

  return (
    <View style={theme.components.input.container}>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <TextInput
          {...props}
          style={[
            styles.input,
            { paddingVertical: spacing.md, color: colors.text },
            style,
          ]}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword((prev) => !prev)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={theme.components.icon.sizes.md}
            color={theme.components.icon.colorMuted}
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={theme.components.input.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    textAlign: "center",
    paddingLeft: 20,
  },
  eyeIcon: {
    padding: 4,
  },
});
