import React from "react";
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
  function AppTextField({ error, containerStyle, style, ...props }, ref) {
    const { theme } = useTheme();

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
          {...props}
          style={[
            {
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
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
