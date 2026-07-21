import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Index() {
  const { isAuthenticated, isHydrating } = useAuth();
  const { theme } = useTheme();

  // Attendiamo il ripristino della sessione prima di decidere dove andare,
  // così non compare il login se l'utente era già autenticato.
  if (isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/login" />;
}
