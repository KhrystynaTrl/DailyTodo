export type ColorTokens = {
  background: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  onPrimary: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  info: string;
  error: string;
  warning: string;
};

export const lightColors: ColorTokens = {
  background: "#EFF5F6",
  surface: "#FFFFFF",
  surfaceAlt: "#DFEBED",
  primary: "#0C6C79",
  onPrimary: "#FFFFFF",
  text: "#14262A",
  textMuted: "#526A6F",
  border: "#CFE0E3",
  success: "#1E9E6A",
  info: "#2C74B0",
  error: "#D24B4B",
  warning: "#DA8A2E",
};

export const darkColors: ColorTokens = {
  background: "#0F1D20",
  surface: "#17262A",
  surfaceAlt: "#213035",
  primary: "#45C0CD",
  onPrimary: "#072024",
  text: "#E7F2F3",
  textMuted: "#93ADB2",
  border: "#2C3F44",
  success: "#40C78B",
  info: "#6FB0E8",
  error: "#F5837F",
  warning: "#F0A868",
};
