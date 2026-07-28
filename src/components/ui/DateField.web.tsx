import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate, formatDateInput, parseDate } from "../../utils/date";
import { isValidDate } from "../../utils/validators";
import {
  DateFieldError,
  DateFieldProps,
  getDateFieldWrapperStyle,
} from "./DateField.shared";

// La digitazione passa da un campo di testo mascherato (come su native), non
// dal segmento "anno" dell'<input type="date"> nativo del browser: nei
// browser Chromium quel segmento ha un comportamento inaffidabile digitando
// a mano (es. scrivere "2" può risultare in un anno tipo "1902"). L'input
// nativo resta, nascosto, solo per aprire il calendario visuale.

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
  const pickerRef = useRef<HTMLInputElement>(null);

  const handlePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const iso = event.target.value; // yyyy-mm-dd (vuoto se cancellato)
    if (!iso) return;
    const [year, month, day] = iso.split("-").map(Number);
    onChangeText(formatDate(new Date(year, month - 1, day)));
  };

  const openPicker = () => {
    pickerRef.current?.showPicker?.();
  };

  return (
    <View style={getDateFieldWrapperStyle(theme)}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          paddingHorizontal: theme.spacing.md,
        }}
      >
        <TextInput
          value={value}
          onChangeText={(text) => onChangeText(formatDateInput(text))}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          keyboardType="numeric"
          maxLength={10}
          style={{
            flex: 1,
            textAlign: "center" as const,
            paddingVertical: theme.spacing.md,
            color: theme.colors.text,
            ...theme.text.body,
          }}
        />

        <Pressable onPress={openPicker} style={{ padding: 4 }} hitSlop={8}>
          <Ionicons
            name="calendar-outline"
            size={22}
            color={theme.colors.textMuted}
          />
        </Pressable>
      </View>

      {/* Input nativo nascosto: solo per il calendario visuale via showPicker(). */}
      <input
        ref={pickerRef}
        type="date"
        value={isValidDate(value) ? toISODate(parseDate(value)) : ""}
        onChange={handlePickerChange}
        min={minimumDate ? toISODate(minimumDate) : undefined}
        max={maximumDate ? toISODate(maximumDate) : undefined}
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      />

      <DateFieldError error={error} theme={theme} />
    </View>
  );
}
