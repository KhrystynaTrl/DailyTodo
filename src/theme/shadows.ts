import { ViewStyle } from "react-native";

type Shadow = Pick<
  ViewStyle,
  | "shadowColor"
  | "shadowOffset"
  | "shadowOpacity"
  | "shadowRadius"
  | "elevation"
>;

const build = (
  shadowColor: string,
  opacity: number,
): Record<"sm" | "md" | "lg", Shadow> => ({
  sm: {
    shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: opacity,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: opacity,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: 8,
    elevation: 8,
  },
});

const shadowSchemes = {
  light: build("#000000", 0.12),
  dark: build("#000000", 0.4),
};

export default shadowSchemes;
