import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../context/ThemeContext";

export default function AppointmentsList() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.lg,
        }}
      >
        <Text style={{ color: theme.colors.text, ...theme.text.h2 }}>
          Appuntamenti
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            marginTop: theme.spacing.sm,
            ...theme.text.body,
          }}
        >
          Schermata in arrivo
        </Text>
      </View>
    </SafeAreaView>
  );
}
