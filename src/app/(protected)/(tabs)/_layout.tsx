import { Ionicons } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TopBar from "../../../components/ui/TopBar";
import { useTheme } from "../../../context/ThemeContext";

// Route principali su cui mostrare la TopBar fissa. I form interni (es. nuovo
// appuntamento) hanno un proprio header con back e restano senza TopBar.
const TOP_BAR_ROUTES = [
  "/home",
  "/daily-activity",
  "/appointments",
  "/water-consumed",
  "/weekly-statistics",
];

export default function TabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Su alcuni telefoni (es. Android con navigazione a gesti) insets.bottom è
  // molto piccolo o 0, e la tab bar finisce sotto i tasti di sistema: teniamo
  // uno spazio minimo garantito e un piccolo margine extra di sicurezza.
  const bottomInset = Math.max(insets.bottom, 12) + 8;

  const showTopBar = TOP_BAR_ROUTES.includes(pathname);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {showTopBar ? <TopBar /> : null}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textMuted,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            height: 56 + bottomInset,
            paddingTop: 6,
            paddingBottom: bottomInset,
          },
          tabBarLabelStyle: {
            fontSize: theme.fontSize.sm,
          },
        }}
      >
        <Tabs.Screen
          name="daily-activity"
          options={{
            title: "Attività",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="checkbox-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: "Appuntamenti",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused
                    ? theme.colors.primary
                    : theme.colors.surfaceAlt,
                }}
              >
                <Ionicons
                  name="home"
                  size={20}
                  color={focused ? theme.colors.onPrimary : theme.colors.text}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="water-consumed"
          options={{
            title: "Acqua",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="water-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="weekly-statistics"
          options={{
            title: "Statistiche",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
