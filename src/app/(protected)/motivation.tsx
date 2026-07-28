import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";
import { useTheme } from "../../context/ThemeContext";
import {
  Quote,
  getMotivationalQuotes,
} from "../../services/motivation.service";

type Status = "loading" | "error" | "success";

export default function Motivation() {
  const { theme } = useTheme();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setStatus("loading");

    try {
      const data = await getMotivationalQuotes();
      setQuotes(data);
      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Si è verificato un errore",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await load(true);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.sm,
        }}
      >
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </Pressable>
        <Text
          style={{
            color: theme.colors.text,
            marginLeft: theme.spacing.sm,
            ...theme.text.h1,
          }}
        >
          Frase del giorno
        </Text>
      </View>

      {status === "loading" ? (
        <LoadingState message="Caricamento frasi motivazionali..." />
      ) : status === "error" ? (
        <ErrorView message={errorMessage} onRetry={() => load()} />
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: theme.spacing.lg,
            flexGrow: 1,
            justifyContent: "center",
            width: "100%",
            maxWidth: 640,
            alignSelf: "center",
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
        >
          {quotes.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center" }}>
              <EmptyState message="Nessuna frase disponibile al momento. Trascina verso il basso per aggiornare." />
            </View>
          ) : (
            <Card variant="base" style={{ marginBottom: theme.spacing.md }}>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={theme.colors.primary}
                style={{ marginBottom: theme.spacing.sm }}
              />
              <Text
                style={{
                  color: theme.colors.text,
                  ...theme.text.body,
                  fontStyle: "italic",
                }}
              >
                “{quotes[0].text}”
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  marginTop: theme.spacing.sm,
                  textAlign: "right",
                  ...theme.text.caption,
                  fontWeight: "700",
                }}
              >
                — {quotes[0].author}
              </Text>
            </Card>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.lg,
      }}
    >
      <Ionicons
        name="cloud-offline-outline"
        size={56}
        color={theme.colors.textMuted}
      />
      <Text
        style={{
          color: theme.colors.text,
          textAlign: "center",
          marginTop: theme.spacing.md,
          ...theme.text.h2,
        }}
      >
        Qualcosa è andato storto
      </Text>
      <Text
        style={{
          color: theme.colors.textMuted,
          textAlign: "center",
          marginTop: theme.spacing.sm,
          marginBottom: theme.spacing.lg,
          ...theme.text.body,
        }}
      >
        {message}
      </Text>

      <Pressable
        onPress={onRetry}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          backgroundColor: theme.colors.primary,
          borderRadius: theme.radii.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.xl,
        }}
      >
        <Ionicons name="refresh" size={18} color={theme.colors.onPrimary} />
        <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
          Riprova
        </Text>
      </Pressable>
    </View>
  );
}
