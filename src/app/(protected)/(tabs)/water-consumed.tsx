import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppButton from "../../../components/ui/AppButton";
import AppTextField from "../../../components/ui/AppTextField";
import Card from "../../../components/ui/Card";
import EmptyState from "../../../components/ui/EmptyState";
import LoadingState from "../../../components/ui/LoadingState";
import { useTheme } from "../../../context/ThemeContext";
import {
  WATER_GOAL_ML,
  addWaterEntry,
  getWaterState,
  removeWaterEntry,
  resetWaterState,
} from "../../../services/water.service";
import { WaterEntry } from "../../../storage/water.storage";

const PRESET_AMOUNTS = [150, 250, 500];
const CIRCLE_SIZE = 200;

export default function WaterConsumed() {
  const { theme } = useTheme();

  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [customAmountError, setCustomAmountError] = useState("");

  const fillAnim = useRef(new Animated.Value(0)).current;

  const total = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.quantita, 0),
    [entries],
  );
  const percentage = Math.min(100, Math.round((total / WATER_GOAL_ML) * 100));
  const goalReached = total >= WATER_GOAL_ML;

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => (a.orario < b.orario ? 1 : -1)),
    [entries],
  );

  useEffect(() => {
    getWaterState()
      .then((state) => setEntries(state.entries))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percentage, fillAnim]);

  const handleAdd = async (quantita: number) => {
    setIsSaving(true);
    try {
      const state = await addWaterEntry(quantita);
      setEntries(state.entries);
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
  };

  const handleReset = async () => {
    const state = await resetWaterState();
    setEntries(state.entries);
  };

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, CIRCLE_SIZE],
  });

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.lg,
          }}
        >
          <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
            Acqua
          </Text>
          <Pressable onPress={handleReset}>
            <Text
              style={{ color: theme.colors.textMuted, ...theme.text.caption }}
            >
              Reset giornata (demo)
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
            backgroundColor: theme.colors.surfaceAlt,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            alignSelf: "center",
            overflow: "hidden",
            marginBottom: theme.spacing.lg,
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: fillHeight,
              backgroundColor: theme.colors.primary,
            }}
          />
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ color: theme.colors.text, ...theme.text.h1 }}>
              {percentage}%
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                marginTop: theme.spacing.xs,
                ...theme.text.caption,
              }}
            >
              {total} / {WATER_GOAL_ML} ml
            </Text>
          </View>
        </View>

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
            <Card
              key={entry.id}
              variant="flat"
              style={{
                marginBottom: theme.spacing.sm,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{
                    color: theme.colors.text,
                    ...theme.text.body,
                    fontWeight: "700",
                  }}
                >
                  {entry.quantita} ml
                </Text>
                <Text
                  style={{
                    color: theme.colors.textMuted,
                    ...theme.text.caption,
                  }}
                >
                  {entry.orario}
                </Text>
              </View>
              <Pressable onPress={() => handleRemove(entry.id)} hitSlop={8}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={theme.colors.error}
                />
              </Pressable>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
