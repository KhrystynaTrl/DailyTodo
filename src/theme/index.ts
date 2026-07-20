import { darkColors, lightColors } from "./colors";
import radii from "./radii";
import { darkShadow, lightShadow } from "./shadows";
import spacing from "./spacing";
import { fontSize, text } from "./typography";

export const themes = {
  light: {
    mode: "light" as const,
    colors: lightColors,
    shadow: lightShadow,
    spacing,
    radii,
    fontSize,
    text,
  },
  dark: {
    mode: "dark" as const,
    colors: darkColors,
    shadow: darkShadow,
    spacing,
    radii,
    fontSize,
    text,
  },
};

export type Theme = (typeof themes)["light"] | (typeof themes)["dark"];

export default themes.light;
