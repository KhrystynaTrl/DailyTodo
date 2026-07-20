import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import AppTextField from "../ui/AppTextField";

export type StatusFilter = "tutte" | "completate" | "da-completare";
export type CategoryFilter = "tutte" | Activity["categoria"];

type ActivityFiltersProps = {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  search: string;
  onSearchChange: (search: string) => void;
};

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "tutte", label: "Tutte" },
  { value: "da-completare", label: "Da fare" },
  { value: "completate", label: "Completate" },
];

const categoryOptions: { value: CategoryFilter; label: string }[] = [
  { value: "tutte", label: "Tutte" },
  { value: "allenamento", label: "Allenamento" },
  { value: "salute", label: "Salute" },
  { value: "alimentazione", label: "Alimentazione" },
  { value: "altro", label: "Altro" },
];

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
        borderRadius: theme.radii.md,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        marginRight: theme.spacing.xs,
      }}
    >
      <Text
        style={{
          color: selected ? theme.colors.onPrimary : theme.colors.text,
          ...theme.text.caption,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function ActivityFilters({
  status,
  onStatusChange,
  category,
  onCategoryChange,
  search,
  onSearchChange,
}: ActivityFiltersProps) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <AppTextField
        placeholder="Cerca per titolo"
        value={search}
        onChangeText={onSearchChange}
        containerStyle={{ width: "100%" }}
      />

      <View style={{ flexDirection: "row", marginBottom: theme.spacing.sm }}>
        {statusOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={status === option.value}
            onPress={() => onStatusChange(option.value)}
          />
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categoryOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={category === option.value}
            onPress={() => onCategoryChange(option.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
