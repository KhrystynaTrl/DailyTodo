import React, { useState } from "react";
import {
    StyleProp,
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

const AppTextField = React.forwardRef<TextInput, AppTextFieldProps>(
  function AppTextField(
    { error, containerStyle, style, onFocus, onBlur, ...props },
    ref,
  ) {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View
        style={[
          {
            width: "75%" as const,
            alignSelf: "center" as const,
            marginBottom: theme.spacing.sm + 2,
          },
          containerStyle,
        ]}
      >
        <TextInput
          ref={ref}
          placeholderTextColor={theme.colors.textMuted}
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: isFocused ? theme.colors.primary : theme.colors.border,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              color: theme.colors.text,
              textAlign: "center" as const,
              ...theme.text.body,
            },
            style,
          ]}
        />
        {error ? (
          <Text
            style={{
              color: theme.colors.error,
              marginTop: theme.spacing.xs,
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

export default AppTextField;
