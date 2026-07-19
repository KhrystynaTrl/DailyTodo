import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Theme, themes } from "../theme";

type ColorScheme = "light" | "dark";
type ColorSchemeOverride = ColorScheme | "system";

type ThemeContextType = {
  theme: Theme;
  colorScheme: ColorScheme;
  override: ColorSchemeOverride;
  setOverride: (override: ColorSchemeOverride) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState<ColorSchemeOverride>("system");

  const colorScheme: ColorScheme =
    override === "system" ? systemScheme ?? "light" : override;

  const value = useMemo(
    () => ({
      theme: themes[colorScheme],
      colorScheme,
      override,
      setOverride,
    }),
    [colorScheme, override],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve essere usato dentro ThemeProvider");
  }

  return context;
}
