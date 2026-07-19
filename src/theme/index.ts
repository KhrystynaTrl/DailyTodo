import { colorSchemes, palette } from "./colors";
import createComponentStyles from "./components";
import radii from "./radii";
import shadowSchemes from "./shadows";
import spacing from "./spacing";
import { BaseTheme } from "./types";
import typography from "./typography";

const buildTheme = (mode: "light" | "dark") => {
  const base: BaseTheme = {
    mode,
    colors: colorSchemes[mode],
    shadows: shadowSchemes[mode],
    spacing,
    typography,
    radii,
  };

  return { ...base, components: createComponentStyles(base) };
};

export const themes = {
  light: buildTheme("light"),
  dark: buildTheme("dark"),
};

export type Theme = ReturnType<typeof buildTheme>;
export type { BaseTheme };

export { colorSchemes, palette, radii, spacing, typography };
export default themes.light;
