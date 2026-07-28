import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../../components/ui/AppButton";
import AppTextField from "../../../components/ui/AppTextField";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingState from "../../../components/ui/LoadingState";
import WaterEntryRow from "../../../components/water/WaterEntryRow";
import WaterProgressCircle from "../../../components/water/WaterProgressCircle";
import { useTheme } from "../../../context/ThemeContext";
import {
  WaterEntry,
  addWaterEntry,
  getWaterState,
  removeWaterEntry,
} from "../../../services/water.service";

const PRESET_AMOUNTS = [150, 250, 500];

export default function WaterConsumed() {
  const { theme } = useTheme();

  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [goalMl, setGoalMl] = useState(2000);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [customAmountError, setCustomAmountError] = useState("");

  const total = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.quantita, 0),
    [entries],
  );
  const percentage = Math.min(100, Math.round((total / goalMl) * 100));
  const goalReached = total >= goalMl;

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => (a.orario < b.orario ? 1 : -1)),
    [entries],
  );

  const loadWaterState = useCallback(() => {
    return getWaterState().then((state) => {
      setEntries(state.entries);
      setGoalMl(state.goalMl);
    });
  }, []);

  const isFirstLoad = useRef(true);

  // Ricarica ogni volta che la schermata torna in primo piano (es. dopo aver
  // aggiunto acqua da un altro dispositivo), non solo al primo avvio.
  useFocusEffect(
    useCallback(() => {
      loadWaterState().finally(() => {
        if (isFirstLoad.current) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      });
    }, [loadWaterState]),
  );

  const handleAdd = async (quantita: number) => {
    setIsSaving(true);
    try {
      const state = await addWaterEntry(quantita);
      setEntries(state.entries);
      setGoalMl(state.goalMl);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustom = async () => {
    if (!customAmount.trim()) {
      setCustomAmountError("");
      return;
    }

    const parsed = Number(customAmount.replace(",", "."));

    if (Number.isNaN(parsed) || parsed <= 0) {
      setCustomAmountError("Inserisci una quantità valida maggiore di zero");
      return;
    }

    setCustomAmountError("");
    await handleAdd(Math.round(parsed));
    setCustomAmount("");
  };

  const handleRemove = async (id: number) => {
    const state = await removeWaterEntry(id);
    setEntries(state.entries);
    setGoalMl(state.goalMl);
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <LoadingState message="Caricamento..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        <Text
          style={{
            color: theme.colors.text,
            ...theme.text.h1,
            marginBottom: theme.spacing.lg,
          }}
        >
          Acqua
        </Text>

        <WaterProgressCircle
          percentage={percentage}
          total={total}
          goal={goalMl}
        />

        {goalReached ? (
          <Card
            variant="flat"
            style={{ marginBottom: theme.spacing.lg, alignItems: "center" }}
          >
            <Text
              style={{
                color: theme.colors.primary,
                textAlign: "center",
                ...theme.text.body,
                fontWeight: "700",
              }}
            >
              Obiettivo raggiunto per oggi!
            </Text>
          </Card>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg,
          }}
        >
          {PRESET_AMOUNTS.map((amount) => (
            <Pressable
              key={amount}
              onPress={() => handleAdd(amount)}
              disabled={isSaving}
              style={{
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radii.md,
                paddingVertical: theme.spacing.sm,
                paddingHorizontal: theme.spacing.md,
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              <Text
                style={{ color: theme.colors.onPrimary, ...theme.text.button }}
              >
                +{amount} ml
              </Text>
            </Pressable>
          ))}
        </View>

        <AppTextField
          placeholder="Quantità personalizzata (ml)"
          value={customAmount}
          onChangeText={setCustomAmount}
          error={customAmountError}
          keyboardType="numeric"
        />
        <AppButton
          title="Aggiungi"
          onPress={handleAddCustom}
          loading={isSaving}
        />

        <Text
          style={{
            color: theme.colors.text,
            marginTop: theme.spacing.xl,
            marginBottom: theme.spacing.md,
            ...theme.text.h2,
          }}
        >
          Storico di oggi
        </Text>

        {sortedEntries.length === 0 ? (
          <EmptyState message="Nessuna quantità registrata oggi" />
        ) : (
          sortedEntries.map((entry) => (
            <WaterEntryRow key={entry.id} entry={entry} onRemove={handleRemove} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
