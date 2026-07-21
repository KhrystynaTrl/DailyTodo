import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate, formatDateInput, parseDate } from "../../utils/date";
import { isValidDate } from "../../utils/validators";

type DateFieldProps = {
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

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
  const [showPicker, setShowPicker] = useState(false);

  const pickerValue = isValidDate(value) ? parseDate(value) : new Date();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (event.type === "set" && selectedDate) {
      onChangeText(formatDate(selectedDate));
    }
  };

  const errorText = error ? (
    <Text
      style={{
        color: theme.colors.error,
        marginTop: theme.spacing.xs,
        ...theme.text.caption,
      }}
    >
      {error}
    </Text>
  ) : null;

  const wrapperStyle = {
    width: "75%" as const,
    alignSelf: "center" as const,
    marginBottom: theme.spacing.sm + 2,
  };

  // Sul web usiamo l'input data nativo del browser: il picker della community
  // non ha implementazione web. L'input gestisce sia digitazione sia calendario.
  if (Platform.OS === "web") {
    const handleWebChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const iso = event.target.value; // yyyy-mm-dd (vuoto se cancellato)
      if (!iso) {
        onChangeText("");
        return;
      }
      const [year, month, day] = iso.split("-").map(Number);
      onChangeText(formatDate(new Date(year, month - 1, day)));
    };

    return (
      <View style={wrapperStyle}>
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
        {errorText}
      </View>
    );
  }

  return (
    <View style={wrapperStyle}>
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

        <Pressable
          onPress={() => setShowPicker(true)}
          style={{ padding: 4 }}
          hitSlop={8}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color={theme.colors.textMuted}
          />
        </Pressable>
      </View>

      {errorText}

      {showPicker ? (
        <>
          <DateTimePicker
            value={pickerValue}
            mode="date"
            display="default"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            themeVariant={theme.mode}
            onChange={handleChange}
          />
          {Platform.OS === "ios" ? (
            <Pressable
              onPress={() => setShowPicker(false)}
              style={{ alignSelf: "center", marginTop: theme.spacing.xs }}
            >
              <Text style={{ color: theme.colors.primary, ...theme.text.link }}>
                Fatto
              </Text>
            </Pressable>
          ) : null}
        </>
      ) : null}
    </View>
  );
}
