import { StyleSheet } from "react-native";
import { BaseTheme } from "../types";

const createInputStyles = (theme: BaseTheme) => {
  const { colors, spacing, radii, typography } = theme;

  return StyleSheet.create({
    container: {
      width: "75%",
      alignSelf: "center",
      marginBottom: spacing.sm + 2,
    },
    field: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      color: colors.text,
      ...typography.variants.body,
    },
    focused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    errorField: {
      borderColor: colors.error,
    },
    label: {
      color: colors.textMuted,
      marginBottom: spacing.xs,
      ...typography.variants.caption,
    },
    errorText: {
      color: colors.error,
      marginTop: spacing.xs,
      ...typography.variants.caption,
    },
  });
};

export default createInputStyles;
