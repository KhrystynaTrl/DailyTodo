export type ColorTokens = {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  onPrimary: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
};

export const lightColors: ColorTokens = {
  background: "#EEEFE0",
  surface: "#FFFFFF",
  surfaceAlt: "#D1D8BE",
  primary: "#819A91",
  onPrimary: "#FFFFFF",
  text: "#333333",
  textMuted: "#666666",
  border: "#819A91",
  error: "#CE2626",
};

export const darkColors: ColorTokens = {
  background: "#35412c",
  surface: "#262B22",
  surfaceAlt: "#2F332A",
  primary: "#A7C1A8",
  onPrimary: "#1A1A1A",
  text: "#F2F2F2",
  textMuted: "#CBCBCB",
  border: "#A7C1A8",
  error: "#F87171",
};
