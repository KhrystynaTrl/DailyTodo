import React from "react";
import { ScrollView, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import AppTextField from "../ui/AppTextField";
import ChipSelector from "../ui/ChipSelector";

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

const statusOptions: StatusFilter[] = ["tutte", "da-completare", "completate"];
const statusLabel: Record<StatusFilter, string> = {
  tutte: "Tutte",
  "da-completare": "Da fare",
  completate: "Completate",
};

const categoryOptions: CategoryFilter[] = [
  "tutte",
  "allenamento",
  "salute",
  "alimentazione",
  "altro",
];
const categoryLabel: Record<CategoryFilter, string> = {
  tutte: "Tutte",
  allenamento: "Allenamento",
  salute: "Salute",
  alimentazione: "Alimentazione",
  altro: "Altro",
};

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

      <View style={{ marginBottom: theme.spacing.sm }}>
        <ChipSelector
          options={statusOptions}
          labels={statusLabel}
          value={status}
          onChange={onStatusChange}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ChipSelector
          options={categoryOptions}
          labels={categoryLabel}
          value={category}
          onChange={onCategoryChange}
        />
      </ScrollView>
    </View>
  );
}
