import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { Activity } from "../../mocks/activities.mock";
import { formatTimeInput, isValidTime, parseDate } from "../../utils/date";
import { isRequired, isValidDate } from "../../utils/validators";
import AppButton from "../ui/AppButton";
import AppTextField from "../ui/AppTextField";
import BottomSheetModal from "../ui/BottomSheetModal";
import ChipSelector from "../ui/ChipSelector";
import DateField from "../ui/DateField";

type ActivityFormProps = {
  visible: boolean;
  initialActivity: Activity | null;
  onSave: (activity: Omit<Activity, "id">) => void;
  onClose: () => void;
};

const categories: Activity["categoria"][] = [
  "allenamento",
  "salute",
  "alimentazione",
  "altro",
];

const categoryLabel: Record<Activity["categoria"], string> = {
  allenamento: "Allenamento",
  salute: "Salute",
  alimentazione: "Alimentazione",
  altro: "Altro",
};

const priorities: Activity["priorita"][] = ["bassa", "media", "alta"];

const priorityLabel: Record<Activity["priorita"], string> = {
  bassa: "Bassa",
  media: "Media",
  alta: "Alta",
};

const emptyForm = {
  titolo: "",
  descrizione: "",
  categoria: "altro" as Activity["categoria"],
  data: "",
  ora: "",
  priorita: "media" as Activity["priorita"],
  durataMinuti: "",
};

export default function ActivityForm({
  visible,
  initialActivity,
  onSave,
  onClose,
}: ActivityFormProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [titolo, setTitolo] = useState(emptyForm.titolo);
  const [titoloError, setTitoloError] = useState("");
  const [descrizione, setDescrizione] = useState(emptyForm.descrizione);
  const [categoria, setCategoria] = useState(emptyForm.categoria);
  const [data, setData] = useState(emptyForm.data);
  const [dataError, setDataError] = useState("");
  const [ora, setOra] = useState(emptyForm.ora);
  const [priorita, setPriorita] = useState(emptyForm.priorita);
  const [durataMinuti, setDurataMinuti] = useState(emptyForm.durataMinuti);

  useEffect(() => {
    if (!visible) return;

    if (initialActivity) {
      setTitolo(initialActivity.titolo);
      setDescrizione(initialActivity.descrizione ?? "");
      setCategoria(initialActivity.categoria);
      setData(initialActivity.data);
      setOra(initialActivity.ora ?? "");
      setPriorita(initialActivity.priorita);
      setDurataMinuti(
        initialActivity.durataMinuti !== undefined
          ? String(initialActivity.durataMinuti)
          : "",
      );
    } else {
      setTitolo(emptyForm.titolo);
      setDescrizione(emptyForm.descrizione);
      setCategoria(emptyForm.categoria);
      setData(emptyForm.data);
      setOra(emptyForm.ora);
      setPriorita(emptyForm.priorita);
      setDurataMinuti(emptyForm.durataMinuti);
    }

    setTitoloError("");
    setDataError("");
  }, [visible, initialActivity]);

  const validateTitolo = () => {
    if (!isRequired(titolo)) {
      setTitoloError("Inserisci un titolo");
      return false;
    }
    setTitoloError("");
    return true;
  };

  const validateData = () => {
    if (!isRequired(data) || !isValidDate(data)) {
      setDataError("Inserisci una data valida (GG/MM/AAAA)");
      return false;
    }

    const chosen = parseDate(data);
    chosen.setHours(0, 0, 0, 0);

    if (chosen.getTime() < today.getTime()) {
      setDataError("Non puoi scegliere una data precedente a oggi");
      return false;
    }

    if (chosen.getTime() === today.getTime() && ora && isValidTime(ora)) {
      const [hours, minutes] = ora.split(":").map(Number);
      const chosenDateTime = new Date();
      chosenDateTime.setHours(hours, minutes, 0, 0);

      if (chosenDateTime.getTime() < Date.now()) {
        setDataError("Non puoi scegliere un orario già passato");
        return false;
      }
    }

    setDataError("");
    return true;
  };

  const handleSave = () => {
    const isTitoloValid = validateTitolo();
    const isDataValid = validateData();

    if (!isTitoloValid || !isDataValid) return;

    onSave({
      titolo,
      descrizione: descrizione || undefined,
      categoria,
      data,
      ora: ora || undefined,
      completata: initialActivity?.completata ?? false,
      priorita,
      durataMinuti: durataMinuti ? Number(durataMinuti) : undefined,
    });
  };

  return (
    <BottomSheetModal visible={visible} onRequestClose={onClose} maxHeight="95%">
      <ScrollView
        style={{ flexShrink: 1 }}
        contentContainerStyle={{ padding: theme.spacing.lg }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.lg,
            ...theme.text.h2,
          }}
        >
          {initialActivity ? "Modifica attività" : "Nuova attività"}
        </Text>

        <AppTextField
          placeholder="Titolo"
          value={titolo}
          onChangeText={setTitolo}
          onBlur={validateTitolo}
          error={titoloError}
        />

        <AppTextField
          placeholder="Descrizione (opzionale)"
          value={descrizione}
          onChangeText={setDescrizione}
          multiline
        />

        <Text
          style={{
            color: theme.colors.textMuted,
            marginBottom: theme.spacing.xs,
            ...theme.text.caption,
          }}
        >
          Categoria
        </Text>
        <View style={{ marginBottom: theme.spacing.md }}>
          <ChipSelector
            options={categories}
            labels={categoryLabel}
            value={categoria}
            onChange={setCategoria}
          />
        </View>

        <DateField
          placeholder="Data (GG/MM/AAAA)"
          value={data}
          onChangeText={setData}
          onBlur={validateData}
          error={dataError}
          minimumDate={today}
        />

        <AppTextField
          placeholder="Ora (opzionale, HH:MM)"
          value={ora}
          onChangeText={(text) => setOra(formatTimeInput(text))}
          onBlur={validateData}
          keyboardType="numeric"
          maxLength={5}
        />

        <Text
          style={{
            color: theme.colors.textMuted,
            marginBottom: theme.spacing.xs,
            ...theme.text.caption,
          }}
        >
          Priorità
        </Text>
        <View style={{ marginBottom: theme.spacing.lg }}>
          <ChipSelector
            options={priorities}
            labels={priorityLabel}
            value={priorita}
            onChange={setPriorita}
          />
        </View>

        <AppTextField
          placeholder="Durata (minuti, opzionale)"
          value={durataMinuti}
          onChangeText={(text) => setDurataMinuti(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
        />
      </ScrollView>

      <View
        style={{
          padding: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.lg + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      >
        <AppButton title="Salva" onPress={handleSave} />

        <Pressable onPress={onClose} style={{ marginTop: theme.spacing.sm }}>
          <Text
            style={{
              color: theme.colors.textMuted,
              textAlign: "center",
              ...theme.text.link,
            }}
          >
            Annulla
          </Text>
        </Pressable>
      </View>
    </BottomSheetModal>
  );
}
