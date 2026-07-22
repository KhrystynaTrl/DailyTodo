import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate, parseDate } from "../../utils/date";
import { isValidDate } from "../../utils/validators";
import {
  DateFieldError,
  DateFieldProps,
  getDateFieldWrapperStyle,
} from "./DateField.shared";

// Sul web usiamo l'input data nativo del browser: il picker della community
// non ha implementazione web. L'input gestisce sia digitazione sia calendario.

// Converte una Date nel formato ISO (yyyy-mm-dd) richiesto da <input type="date">,
// usando i componenti locali per evitare slittamenti di fuso orario.
const toISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function DateField({
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  minimumDate,
  maximumDate,
}: DateFieldProps) {
  const { theme } = useTheme();

  const handleWebChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const iso = event.target.value; // yyyy-mm-dd (vuoto se cancellato)
    if (!iso) {
      onChangeText("");
      return;
    }
    const [year, month, day] = iso.split("-").map(Number);
    onChangeText(formatDate(new Date(year, month - 1, day)));
  };

  return (
    <View style={getDateFieldWrapperStyle(theme)}>
      <input
        type="date"
        value={isValidDate(value) ? toISODate(parseDate(value)) : ""}
        onChange={handleWebChange}
        onBlur={onBlur}
        min={minimumDate ? toISODate(minimumDate) : undefined}
        max={maximumDate ? toISODate(maximumDate) : undefined}
        style={{
          width: "100%",
          boxSizing: "border-box",
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.colors.border,
          paddingTop: theme.spacing.md,
          paddingBottom: theme.spacing.md,
          paddingLeft: theme.spacing.lg,
          paddingRight: theme.spacing.lg,
          fontSize: theme.fontSize.md,
          textAlign: "center",
          outline: "none",
        }}
      />
      <DateFieldError error={error} theme={theme} />
    </View>
  );
}
