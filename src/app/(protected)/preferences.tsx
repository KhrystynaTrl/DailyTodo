import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "../../components/ui/Card";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import LoadingState from "../../components/ui/LoadingState";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import {
  getPreferences,
  updatePreferences,
} from "../../services/preferences.service";
import {
  Language,
  Preferences,
  defaultPreferences,
} from "../../storage/preferences.storage";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

type ThemeOption = "light" | "dark" | "system";

export default function PreferencesScreen() {
  const { theme, override, setOverride } = useTheme();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  useEffect(() => {
    getPreferences()
      .then(setPrefs)
      .finally(() => setIsLoading(false));
  }, []);

  // Aggiorna lo stato, persiste in AsyncStorage e conferma con un toast.
  const update = (patch: Partial<Preferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    updatePreferences(next)
      .then(() => showToast("Preferenze salvate"))
      .catch(() => showToast("Errore nel salvataggio", "error"));
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <LoadingState message="Caricamento impostazioni..." />
      </SafeAreaView>
    );
  }

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
          Impostazioni
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: theme.spacing.lg }}>
        {/* Notifiche */}
        <Section title="Notifiche">
          <Row
            icon="notifications-outline"
            label="Notifiche"
            description="Attiva o disattiva tutte le notifiche"
            right={
              <Switch
                value={prefs.notificationsEnabled}
                onValueChange={(v) => update({ notificationsEnabled: v })}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
              />
            }
          />
          <Row
            icon="calendar-outline"
            label="Appuntamenti"
            description="Promemoria per i tuoi appuntamenti"
            disabled={!prefs.notificationsEnabled}
            right={
              <Switch
                value={
                  prefs.notificationsEnabled && prefs.appointmentNotifications
                }
                disabled={!prefs.notificationsEnabled}
                onValueChange={(v) => update({ appointmentNotifications: v })}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
              />
            }
          />
          <Row
            icon="trophy-outline"
            label="Obiettivi"
            description="Avvisi al raggiungimento degli obiettivi"
            disabled={!prefs.notificationsEnabled}
            isLast
            right={
              <Switch
                value={prefs.notificationsEnabled && prefs.goalNotifications}
                disabled={!prefs.notificationsEnabled}
                onValueChange={(v) => update({ goalNotifications: v })}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
              />
            }
          />
        </Section>

        {/* Aspetto */}
        <Section title="Aspetto">
          <Row
            icon="color-palette-outline"
            label="Tema"
            description="Scegli l'aspetto dell'app"
            isLast
            right={null}
          />
          <Pills<ThemeOption>
            value={override}
            options={[
              { key: "light", label: "Chiaro" },
              { key: "dark", label: "Scuro" },
              { key: "system", label: "Sistema" },
            ]}
            onChange={setOverride}
          />
        </Section>

        {/* Lingua */}
        <Section title="Lingua">
          <Row
            icon="language-outline"
            label="Lingua dell'app"
            isLast
            right={null}
          />
          <Pills<Language>
            value={prefs.language}
            options={[
              { key: "it", label: "Italiano" },
              { key: "en", label: "English" },
            ]}
            onChange={(language) => update({ language })}
          />
        </Section>

        {/* Sicurezza */}
        <Section title="Sicurezza">
          <Row
            icon="finger-print-outline"
            label="Accesso con biometria"
            description="Sblocca l'app con impronta o volto (simulato)"
            isLast
            right={
              <Switch
                value={prefs.biometricEnabled}
                onValueChange={(v) => update({ biometricEnabled: v })}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
              />
            }
          />
        </Section>

        {/* Informazioni */}
        <Section title="Informazioni">
          <Row
            icon="information-circle-outline"
            label="Informazioni sull'app"
            onPress={() => setAboutVisible(true)}
            right={
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textMuted}
              />
            }
          />
          <Row
            icon="code-slash-outline"
            label="Versione"
            isLast
            right={
              <Text
                style={{ color: theme.colors.textMuted, ...theme.text.body }}
              >
                {APP_VERSION}
              </Text>
            }
          />
        </Section>

        {/* Logout */}
        <Pressable
          onPress={() => setLogoutVisible(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.sm,
            marginTop: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.radii.md,
            borderWidth: 1,
            borderColor: theme.colors.error,
          }}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.colors.error}
          />
          <Text style={{ color: theme.colors.error, ...theme.text.button }}>
            Esci
          </Text>
        </Pressable>
      </ScrollView>

      {/* Info app */}
      <Modal
        visible={aboutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutVisible(false)}
      >
        <Pressable
          onPress={() => setAboutVisible(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing.lg,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.lg,
              padding: theme.spacing.lg,
              width: "100%",
              maxWidth: 360,
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: 64,
                height: 64,
                marginBottom: theme.spacing.md,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: theme.colors.text,
                marginBottom: theme.spacing.xs,
                ...theme.text.h2,
              }}
            >
              DailyTodo
            </Text>
            <Text
              style={{
                color: theme.colors.textMuted,
                textAlign: "center",
                marginBottom: theme.spacing.md,
                ...theme.text.body,
              }}
            >
              La tua app per il benessere quotidiano: attività, appuntamenti,
              idratazione e statistiche in un unico posto.
            </Text>
            <Text
              style={{ color: theme.colors.textMuted, ...theme.text.caption }}
            >
              Versione {APP_VERSION}
            </Text>

            <Pressable
              onPress={() => setAboutVisible(false)}
              style={{
                marginTop: theme.spacing.lg,
                alignSelf: "stretch",
                alignItems: "center",
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radii.md,
                paddingVertical: theme.spacing.sm,
              }}
            >
              <Text
                style={{ color: theme.colors.onPrimary, ...theme.text.button }}
              >
                Chiudi
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Conferma logout */}
      <ConfirmationModal
        visible={logoutVisible}
        title="Vuoi uscire?"
        message="Verrai disconnesso e riportato alla schermata di accesso."
        confirmLabel="Esci"
        cancelLabel="Annulla"
        onConfirm={() => {
          setLogoutVisible(false);
          logout();
        }}
        onCancel={() => setLogoutVisible(false)}
      />
    </SafeAreaView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text
        style={{
          color: theme.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: theme.spacing.sm,
          marginLeft: theme.spacing.xs,
          ...theme.text.caption,
          fontSize: 12,
        }}
      >
        {title}
      </Text>
      <Card variant="flat" style={{ padding: 0 }}>
        {children}
      </Card>
    </View>
  );
}

type RowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  description?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  isLast?: boolean;
};

function Row({
  icon,
  label,
  description,
  right,
  onPress,
  disabled,
  isLast,
}: RowProps) {
  const { theme } = useTheme();

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: theme.colors.border,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.text, ...theme.text.body }}>
          {label}
        </Text>
        {description ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              marginTop: 2,
              ...theme.text.caption,
              fontSize: 12,
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {right ?? null}
    </View>
  );

  if (onPress && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && { opacity: 0.6 }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

function Pills<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
      }}
    >
      {options.map((option) => {
        const active = value === option.key;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.radii.md,
              backgroundColor: active
                ? theme.colors.primary
                : theme.colors.surface,
              borderWidth: 1,
              borderColor: active ? theme.colors.primary : theme.colors.border,
            }}
          >
            <Text
              style={{
                color: active ? theme.colors.onPrimary : theme.colors.text,
                ...theme.text.caption,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
