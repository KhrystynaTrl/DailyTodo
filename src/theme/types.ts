import { colorSchemes } from "./colors";
import radii from "./radii";
import shadowSchemes from "./shadows";
import spacing from "./spacing";
import typography from "./typography";

export type ColorScheme = typeof colorSchemes.light;
export type ShadowScale = typeof shadowSchemes.light;

export type BaseTheme = {
  mode: "light" | "dark";
  colors: ColorScheme;
  shadows: ShadowScale;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: typeof radii;
};
