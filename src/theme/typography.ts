export const fontSize = {
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 28,
} as const;

export const text = {
  h1: { fontSize: fontSize.xxl, fontWeight: "800", lineHeight: 34 },
  h2: { fontSize: fontSize.xl, fontWeight: "700", lineHeight: 28 },
  body: { fontSize: fontSize.md, fontWeight: "400", lineHeight: 22 },
  caption: { fontSize: fontSize.sm, fontWeight: "400", lineHeight: 18 },
  button: { fontSize: fontSize.md, fontWeight: "700" },
  link: { fontSize: fontSize.sm, fontWeight: "600" },
} as const;
