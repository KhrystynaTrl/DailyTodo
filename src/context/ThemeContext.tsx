import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "../hooks/use-color-scheme";
import { Theme, themes } from "../theme";

const THEME_STORAGE_KEY = "dailytodo:theme";

type ColorScheme = "light" | "dark";
type ColorSchemeOverride = ColorScheme | "system";

type ThemeContextType = {
  theme: Theme;
  colorScheme: ColorScheme;
  override: ColorSchemeOverride;
  setOverride: (override: ColorSchemeOverride) => void;
  hydrateFromServer: (override: ColorSchemeOverride) => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [override, setOverrideState] = useState<ColorSchemeOverride>("system");

  // Recupera la preferenza del tema salvata al precedente avvio.
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setOverrideState(saved);
      }
    });
  }, []);

  const setOverride = (value: ColorSchemeOverride) => {
    setOverrideState(value);
    AsyncStorage.setItem(THEME_STORAGE_KEY, value).catch(() => {});
  };

  // Idrata il tema salvato sul backend (es. dopo login su un nuovo
  // dispositivo). Non sovrascrive mai una preferenza già salvata in locale:
  // AsyncStorage resta sempre la fonte di verità quando presente.
  const hydrateFromServer = (value: ColorSchemeOverride) => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved) return;
      setOverride(value);
    });
  };

  const colorScheme: ColorScheme =
    override === "system" ? (systemScheme ?? "light") : override;

  const value = useMemo(
    () => ({
      theme: themes[colorScheme],
      colorScheme,
      override,
      setOverride,
      hydrateFromServer,
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
