import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Appointment } from "../../mocks/appointments.mock";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

type NextAppointmentCardProps = {
  appointment: Appointment | null;
};

export default function NextAppointmentCard({
  appointment,
}: NextAppointmentCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={() => router.push("/appointments")}
      disabled={!appointment}
    >
      <Card variant="flat" style={{ marginBottom: theme.spacing.lg }}>
        <Text
          style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
            ...theme.text.h2,
          }}
        >
          Prossimo appuntamento
        </Text>

        {appointment ? (
          <View>
            <Text style={{ color: theme.colors.text, ...theme.text.body }}>
              {appointment.titolo} — {appointment.professionista}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing.xs,
                ...theme.text.caption,
              }}
            >
              {appointment.data} · {appointment.ora}
            </Text>
          </View>
        ) : (
          <EmptyState message="Nessun appuntamento in programma" />
        )}
      </Card>
    </Pressable>
  );
}
