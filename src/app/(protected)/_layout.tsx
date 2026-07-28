import { Redirect, Stack, usePathname } from "expo-router";
import { Platform, View } from "react-native";
import TopBar from "../../components/ui/TopBar";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

// Route principali su cui mostrare la TopBar fissa. I form interni (es. nuovo
// appuntamento) hanno un proprio header con back e restano senza TopBar.
const TOP_BAR_ROUTES = [
  "/home",
  "/daily-activity",
  "/appointments",
  "/water-consumed",
  "/weekly-statistics",
];

// Sul web la TopBar è l'unico modo per tornare indietro/navigare senza tab
// bar: la mostriamo anche su schermate extra come "Frase del giorno", che su
// mobile restano invece con il proprio header back-only.
const WEB_ONLY_TOP_BAR_ROUTES = ["/motivation"];

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const showTopBar =
    TOP_BAR_ROUTES.includes(pathname) ||
    (Platform.OS === "web" && WEB_ONLY_TOP_BAR_ROUTES.includes(pathname));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {showTopBar ? <TopBar /> : null}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
