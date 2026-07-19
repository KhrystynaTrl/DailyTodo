import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

type AppTextFieldProps = TextInputProps & {
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function AppTextField({
  error,
  containerStyle,
  style,
  ...props
}: AppTextFieldProps) {
  const { theme } = useTheme();

  return (
    <View style={[theme.components.input.container, containerStyle]}>
      <TextInput
        {...props}
        style={[theme.components.input.field, styles.centered, style]}
      />
      {error ? (
        <Text style={theme.components.input.errorText}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    textAlign: "center",
  },
});
