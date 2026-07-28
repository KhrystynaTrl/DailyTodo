import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityCard from "../../../components/activity/ActivityCard";
import ActivityFilters, {
  CategoryFilter,
  StatusFilter,
} from "../../../components/activity/ActivityFilters";
import ActivityForm from "../../../components/activity/ActivityForm";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import EmptyState from "../../../components/ui/EmptyState";
import FadeInView from "../../../components/ui/FadeInView";
import LoadingState from "../../../components/ui/LoadingState";
import { useTheme } from "../../../context/ThemeContext";
import { useToast } from "../../../context/ToastContext";
import { Activity } from "../../../mocks/activities.mock";
import {
  addActivity,
  deleteActivity,
  getActivities,
  toggleActivityCompletata,
  updateActivity,
} from "../../../services/activities.service";

export default function DailyActivity() {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusFilter>("tutte");
  const [category, setCategory] = useState<CategoryFilter>("tutte");
  const [search, setSearch] = useState("");

  const [formVisible, setFormVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null);

  const isFirstLoad = useRef(true);

  // Al primo caricamento un errore blocca la schermata (nessun dato da
  // mostrare, serve un vero stato di errore con retry). Ai ricaricamenti
  // successivi (refocus) basta un toast: i dati già mostrati restano validi.
  const loadActivities = useCallback(() => {
    return getActivities()
      .then((data) => {
        setActivities(data);
        setLoadError(null);
      })
      .catch((error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Errore nel caricamento delle attività";
        if (isFirstLoad.current) {
          setLoadError(message);
        } else {
          showToast(message, "error");
        }
      });
  }, [showToast]);

  // Ricarica ogni volta che la schermata torna in primo piano (es. dopo aver
  // modificato un'attività da un altro dispositivo), non solo al primo avvio.
  useFocusEffect(
    useCallback(() => {
      loadActivities().finally(() => {
        if (isFirstLoad.current) {
          setIsLoading(false);
          isFirstLoad.current = false;
        }
      });
    }, [loadActivities]),
  );

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (status === "completate" && !activity.completata) return false;
      if (status === "da-completare" && activity.completata) return false;
      if (category !== "tutte" && activity.categoria !== category) return false;
      if (
        search.trim() &&
        !activity.titolo.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [activities, status, category, search]);

  const handleToggle = async (activity: Activity) => {
    try {
      const updated = await toggleActivityCompletata(activity);
      setActivities((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a)),
      );
      showToast(
        updated.completata
          ? "Attività segnata come completata"
          : "Attività segnata come da fare",
      );
    } catch {
      showToast("Errore durante l'aggiornamento", "error");
    }
  };

  const handleAdd = () => {
    setEditingActivity(null);
    setFormVisible(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormVisible(true);
  };

  const handleSave = async (data: Omit<Activity, "id">) => {
    try {
      if (editingActivity) {
        const updated = await updateActivity(editingActivity.id, data);
        setActivities((prev) =>
          prev.map((a) => (a.id === updated.id ? updated : a)),
        );
        showToast("Attività aggiornata");
      } else {
        const created = await addActivity(data);
        setActivities((prev) => [...prev, created]);
        showToast("Attività creata");
      }
      setFormVisible(false);
      setEditingActivity(null);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Errore durante il salvataggio",
        "error",
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteActivity(deleteTarget.id);
      setActivities((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showToast("Attività eliminata");
    } catch {
      showToast("Errore durante l'eliminazione", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        edges={["left", "right"]}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <LoadingState message="Caricamento attività..." />
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
            Attività
          </Text>
          <Pressable
            onPress={handleAdd}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radii.md,
              paddingVertical: theme.spacing.xs,
              paddingHorizontal: theme.spacing.md,
            }}
          >
            <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
              + Nuova
            </Text>
          </Pressable>
        </View>

        <ActivityFilters
          status={status}
          onStatusChange={setStatus}
          category={category}
          onCategoryChange={setCategory}
          search={search}
          onSearchChange={setSearch}
        />

        {filteredActivities.length === 0 ? (
          loadError ? (
            <EmptyState
              icon="cloud-offline-outline"
              message={loadError}
              actionLabel="Riprova"
              onAction={() => loadActivities()}
            />
          ) : (
            <EmptyState message="Nessuna attività trovata" />
          )
        ) : (
          filteredActivities.map((activity, index) => (
            <FadeInView key={activity.id} index={index}>
              <ActivityCard
                activity={activity}
                onToggle={() => handleToggle(activity)}
                onEdit={() => handleEdit(activity)}
                onDelete={() => setDeleteTarget(activity)}
              />
            </FadeInView>
          ))
        )}
      </ScrollView>

      <ActivityForm
        visible={formVisible}
        initialActivity={editingActivity}
        onSave={handleSave}
        onClose={() => {
          setFormVisible(false);
          setEditingActivity(null);
        }}
      />

      <ConfirmationModal
        visible={deleteTarget !== null}
        title="Eliminare l'attività?"
        message={`"${deleteTarget?.titolo}" verrà eliminata definitivamente.`}
        confirmLabel="Elimina"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </SafeAreaView>
  );
}
