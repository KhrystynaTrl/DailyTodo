import { Platform } from "react-native";

// react-native-web deprecò le prop "shadow*" a favore di "boxShadow" (CSS).
// Il tipo esposto resta quello nativo (shadow*/elevation) per non dover
// toccare tutti i punti che fanno `...theme.shadow`: su web, a runtime,
// l'oggetto ha davvero solo `boxShadow`, ignorato senza problemi da RN nativo.
type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export const lightShadow = Platform.select({
  web: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.12)" },
  default: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
}) as ShadowStyle;

export const darkShadow = Platform.select({
  web: { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)" },
  default: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
}) as ShadowStyle;
