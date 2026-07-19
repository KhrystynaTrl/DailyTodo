// Raw color values. Nothing outside this file should reference a hex code directly.
const palette = {
  green50: "#EEEFE0",
  green100: "#D1D8BE",
  green200: "#A7C1A8",
  green300: "#819A91",

  neutralWhite: "#FFFFFF",
  neutralBlack: "#1A1A1A",
  gray100: "#F2F2F2",
  gray300: "#CBCBCB",
  gray500: "#666666",
  gray700: "#333333",

  red300: "#E88A8A",
  red400: "#F87171",
  red500: "#CE2626",
  red700: "#8E1B1B",

  green600: "#3F8F5F",
  green700: "#2E6B46",

  amber400: "#F2C14E",
  amber600: "#B8860B",

  blue400: "#6FA8D8",
  blue600: "#2F6690",

  darkBackground: "#1C1F1A",
  darkSurface: "#262B22",
  darkSurfaceAlt: "#2F332A",
} as const;

// Semantic tokens: components should reference these, never the palette directly.
type ColorTokens = {
  background: string;
  surface: string;
  surfaceAlt: string;

  primary: string;
  primaryMuted: string;
  onPrimary: string;

  text: string;
  textMuted: string;
  border: string;

  error: string;
  errorMuted: string;
  success: string;
  warning: string;
  info: string;

  white: string;
  gray: string;
};

const light: ColorTokens = {
  background: palette.green50,
  surface: palette.neutralWhite,
  surfaceAlt: palette.green100,

  primary: palette.green300,
  primaryMuted: palette.green200,
  onPrimary: palette.neutralWhite,

  text: palette.gray700,
  textMuted: palette.gray500,
  border: palette.green300,

  error: palette.red500,
  errorMuted: palette.red300,
  success: palette.green600,
  warning: palette.amber600,
  info: palette.blue600,

  white: palette.neutralWhite,
  gray: palette.gray500,
};

const dark: ColorTokens = {
  background: palette.darkBackground,
  surface: palette.darkSurface,
  surfaceAlt: palette.darkSurfaceAlt,

  primary: palette.green200,
  primaryMuted: palette.green300,
  onPrimary: palette.neutralBlack,

  text: palette.gray100,
  textMuted: palette.gray300,
  border: palette.green200,

  error: palette.red400,
  errorMuted: palette.red700,
  success: palette.green600,
  warning: palette.amber400,
  info: palette.blue400,

  white: palette.neutralWhite,
  gray: palette.gray300,
};

export const colorSchemes = { light, dark };
export { palette };
export type { ColorTokens };

// Default export stays on the light scheme until ThemeContext picks the
// active scheme at runtime; existing imports keep working unchanged.
const colors = light;
export default colors;
