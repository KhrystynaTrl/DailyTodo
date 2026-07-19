import { TextStyle } from "react-native";

const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
} as const satisfies Record<string, TextStyle["fontWeight"]>;

const variants = {
  h1: { fontSize: fontSize.xxxl, fontWeight: fontWeight.extrabold, lineHeight: 34 },
  h2: { fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold, lineHeight: 30 },
  h3: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, lineHeight: 26 },
  body: { fontSize: fontSize.md, fontWeight: fontWeight.regular, lineHeight: 22 },
  bodyLarge: { fontSize: fontSize.lg, fontWeight: fontWeight.regular, lineHeight: 24 },
  caption: { fontSize: fontSize.xs, fontWeight: fontWeight.regular, lineHeight: 16 },
  button: { fontSize: fontSize.md, fontWeight: fontWeight.bold, lineHeight: 20 },
  link: { fontSize: fontSize.sm, fontWeight: fontWeight.semibold, lineHeight: 18 },
} as const satisfies Record<string, TextStyle>;

const typography = { fontSize, fontWeight, variants };

export default typography;
