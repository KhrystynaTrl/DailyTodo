import React from "react";
import { Text } from "react-native";
import { Theme } from "../../theme";

export type DateFieldProps = {
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

export function getDateFieldWrapperStyle(theme: Theme) {
  return {
    width: "75%" as const,
    alignSelf: "center" as const,
    marginBottom: theme.spacing.sm + 2,
  };
}

export function DateFieldError({
  error,
  theme,
}: {
  error?: string;
  theme: Theme;
}) {
  if (!error) return null;

  return (
    <Text
      style={{
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        ...theme.text.caption,
      }}
    >
      {error}
    </Text>
  );
}
