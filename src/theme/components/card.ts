import { StyleSheet } from "react-native";
import { BaseTheme } from "../types";

const createCardStyles = (theme: BaseTheme) => {
  const { colors, spacing, radii, shadows } = theme;

  return StyleSheet.create({
    base: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.lg,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.lg,
      ...shadows.md,
    },
    flat: {
      backgroundColor: colors.surfaceAlt,
      borderRadius: radii.lg,
      padding: spacing.lg,
    },
  });
};

export default createCardStyles;
