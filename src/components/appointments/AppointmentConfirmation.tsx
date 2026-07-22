import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { Appointment } from "../../mocks/appointments.mock";
import AppButton from "../ui/AppButton";

export default function AppointmentConfirmation({
  appointment,
  onViewAppointment,
  onGoHome,
}: {
  appointment: Appointment;
  onViewAppointment: () => void;
  onGoHome: () => void;
}) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing.lg,
        }}
      >
        <Ionicons name="checkmark-circle" size={72} color={theme.colors.primary} />
        <Text
          style={{
            color: theme.colors.text,
            textAlign: "center",
            marginTop: theme.spacing.lg,
            ...theme.text.h1,
          }}
        >
          Appuntamento confermato!
        </Text>
        <Text
          style={{
            color: theme.colors.textMuted,
            textAlign: "center",
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.xl,
            ...theme.text.body,
          }}
        >
          {appointment.titolo} con {appointment.professionista}
          {"\n"}
          {appointment.data} · {appointment.ora}
        </Text>

        <AppButton title="Vedi appuntamento" onPress={onViewAppointment} />
        <Pressable onPress={onGoHome} style={{ marginTop: theme.spacing.md }}>
          <Text style={{ color: theme.colors.primary, ...theme.text.link }}>
            Torna alla Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
