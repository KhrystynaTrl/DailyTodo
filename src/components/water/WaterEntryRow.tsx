import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { WaterEntry } from "../../services/water.service";
import Card from "../ui/Card";

export default function WaterEntryRow({
  entry,
  onRemove,
}: {
  entry: WaterEntry;
  onRemove: (id: number) => void;
}) {
  const { theme } = useTheme();

  return (
    <Card
      variant="flat"
      style={{
        marginBottom: theme.spacing.sm,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: theme.colors.text, ...theme.text.body, fontWeight: "700" }}>
          {entry.quantita} ml
        </Text>
        <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
          {entry.orario}
        </Text>
      </View>
      <Pressable onPress={() => onRemove(entry.id)} hitSlop={8}>
        <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
      </Pressable>
    </Card>
  );
}
