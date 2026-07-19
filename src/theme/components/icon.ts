import { BaseTheme } from "../types";

export const iconSizes = {
  sm: 16,
  md: 22,
  lg: 28,
  xl: 36,
} as const;

const createIconStyles = (theme: BaseTheme) => ({
  sizes: iconSizes,
  color: theme.colors.text,
  colorMuted: theme.colors.textMuted,
  colorOnPrimary: theme.colors.onPrimary,
  colorError: theme.colors.error,
});

export default createIconStyles;
