import { StyleSheet } from "react-native";
import { BaseTheme } from "../types";

const createTextStyles = (theme: BaseTheme) => {
  const { colors, typography } = theme;

  return StyleSheet.create({
    h1: { color: colors.text, ...typography.variants.h1 },
    h2: { color: colors.text, ...typography.variants.h2 },
    h3: { color: colors.text, ...typography.variants.h3 },
    body: { color: colors.text, ...typography.variants.body },
    bodyMuted: { color: colors.textMuted, ...typography.variants.body },
    caption: { color: colors.textMuted, ...typography.variants.caption },
    link: { color: colors.primary, ...typography.variants.link },
  });
};

export default createTextStyles;
