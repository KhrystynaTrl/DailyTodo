import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Appointment } from "../../mocks/appointments.mock";
import Card from "../ui/Card";
import StatusBadge from "../ui/StatusBadge";

type AppointmentCardProps = {
  appointment: Appointment;
  onPress?: () => void;
  onCancel?: () => void;
};

const statusLabel: Record<Appointment["stato"], string> = {
  confermato: "Confermato",
  "in attesa": "In attesa",
  annullato: "Annullato",
};

const statusColor: Record<
  Appointment["stato"],
  "default" | "primary" | "warning" | "error"
> = {
  confermato: "primary",
  "in attesa": "warning",
  annullato: "default",
};

export default function AppointmentCard({
  appointment,
  onPress,
  onCancel,
}: AppointmentCardProps) {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <Card variant="flat" style={{ marginBottom: theme.spacing.sm }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.colors.text, ...theme.text.body, fontWeight: "700" }}>
              {appointment.titolo}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                marginTop: 2,
                ...theme.text.caption,
              }}
            >
              {appointment.professionista}
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                marginTop: 2,
                ...theme.text.caption,
              }}
            >
              {appointment.data} · {appointment.ora} · {appointment.durata} min
            </Text>
            {appointment.note ? (
              <Text
                style={{
                  color: theme.colors.textMuted,
                  marginTop: theme.spacing.xs,
                  ...theme.text.caption,
                }}
              >
                Note: {appointment.note}
              </Text>
            ) : null}
          </View>

          <StatusBadge
            label={statusLabel[appointment.stato]}
            color={statusColor[appointment.stato]}
          />
        </View>

        {onCancel && appointment.stato !== "annullato" ? (
          <Pressable onPress={onCancel} style={{ marginTop: theme.spacing.sm }}>
            <Text style={{ color: theme.colors.error, ...theme.text.link }}>
              Annulla appuntamento
            </Text>
          </Pressable>
        ) : null}
      </Card>
    </Pressable>
  );
}
