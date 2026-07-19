import { StyleSheet } from "react-native";
import { BaseTheme } from "../types";

const createButtonStyles = (theme: BaseTheme) => {
  const { colors, spacing, radii, typography } = theme;

  return StyleSheet.create({
    primary: {
      backgroundColor: colors.primary,
      borderRadius: radii.md,
      paddingVertical: spacing.md + 2,
      width: "75%",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.md,
      paddingVertical: spacing.md + 2,
      width: "75%",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    pressed: {
      opacity: 0.9,
    },
    disabled: {
      opacity: 0.6,
    },
    textPrimary: {
      color: colors.onPrimary,
      textAlign: "center",
      ...typography.variants.button,
    },
    textSecondary: {
      color: colors.primary,
      textAlign: "center",
      ...typography.variants.button,
    },
  });
};

export default createButtonStyles;
