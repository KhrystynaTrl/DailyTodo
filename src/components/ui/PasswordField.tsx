import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
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

const PasswordField = React.forwardRef<TextInput, PasswordFieldProps>(
  function PasswordField({ error, style, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);
    const { theme } = useTheme();
    const { colors, spacing, radii } = theme;

    return (
      <View
        style={{
          width: "75%" as const,
          alignSelf: "center" as const,
          marginBottom: spacing.sm + 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
          }}
        >
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textMuted}
            {...props}
            style={[
              {
                flex: 1,
                textAlign: "center" as const,
                paddingLeft: 20,
                paddingVertical: spacing.md,
                color: colors.text,
              },
              style,
            ]}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ padding: 4 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        {error ? (
          <Text
            style={{
              color: colors.error,
              marginTop: spacing.xs,
              ...theme.text.caption,
            }}
          >
            {error}
          </Text>
        ) : null}
      </View>
    );
  },
);

export default PasswordField;
