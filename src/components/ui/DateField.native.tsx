import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatDate, formatDateInput, parseDate } from "../../utils/date";
import { isValidDate } from "../../utils/validators";
import {
  DateFieldError,
  DateFieldProps,
  getDateFieldWrapperStyle,
} from "./DateField.shared";

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

      <DateFieldError error={error} theme={theme} />

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
