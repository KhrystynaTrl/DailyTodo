import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AboutModal from "../../components/ui/AboutModal";
import ConfirmationModal from "../../components/ui/ConfirmationModal";
import LoadingState from "../../components/ui/LoadingState";
import LogoutButton from "../../components/ui/LogoutButton";
import SettingsPills from "../../components/ui/SettingsPills";
import SettingsRow from "../../components/ui/SettingsRow";
import SettingsSection from "../../components/ui/SettingsSection";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import {
  Language,
  Preferences,
  defaultPreferences,
  getPreferences,
  updatePreferences,
} from "../../services/preferences.service";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export default function PreferencesScreen() {
  const { theme, setOverride } = useTheme();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

  useEffect(() => {
    getPreferences()
      .then((loaded) => {
        setPrefs(loaded);
        setOverride(loaded.theme);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Aggiorna lo stato, persiste sul backend e conferma con un toast.
  // Il tema va applicato subito anche a ThemeContext, non solo salvato.
  const update = (patch: Partial<Preferences>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    if (patch.theme) setOverride(patch.theme);
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
        <SettingsSection title="Notifiche">
          <SettingsRow
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
          <SettingsRow
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
          <SettingsRow
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
        </SettingsSection>

        {/* Aspetto */}
        <SettingsSection title="Aspetto">
          <SettingsRow
            icon="color-palette-outline"
            label="Tema"
            description="Scegli l'aspetto dell'app"
            isLast
            right={null}
          />
          <SettingsPills<Preferences["theme"]>
            value={prefs.theme}
            options={[
              { key: "light", label: "Chiaro" },
              { key: "dark", label: "Scuro" },
              { key: "system", label: "Sistema" },
            ]}
            onChange={(themeOption) => update({ theme: themeOption })}
          />
        </SettingsSection>

        {/* Lingua */}
        <SettingsSection title="Lingua">
          <SettingsRow
            icon="language-outline"
            label="Lingua dell'app"
            isLast
            right={null}
          />
          <SettingsPills<Language>
            value={prefs.language}
            options={[
              { key: "it", label: "Italiano" },
              { key: "en", label: "English" },
            ]}
            onChange={(language) => update({ language })}
          />
        </SettingsSection>

        {/* Sicurezza */}
        <SettingsSection title="Sicurezza">
          <SettingsRow
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
        </SettingsSection>

        {/* Informazioni */}
        <SettingsSection title="Informazioni">
          <SettingsRow
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
          <SettingsRow
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
        </SettingsSection>

        {/* Logout */}
        <LogoutButton
          onPress={() => setLogoutVisible(true)}
          style={{ marginTop: theme.spacing.md }}
        />
      </ScrollView>

      <AboutModal
        visible={aboutVisible}
        onClose={() => setAboutVisible(false)}
        appVersion={APP_VERSION}
      />

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
