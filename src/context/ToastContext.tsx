import { Ionicons } from "@expo/vector-icons";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";

type ToastType = "success" | "error" | "info";

type ToastData = {
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
  }, []);

  const hide = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={{ flex: 1 }}>
        {children}
        {toast ? <Toast data={toast} onHide={hide} /> : null}
      </View>
    </ToastContext.Provider>
  );
}

function Toast({ data, onHide }: { data: ToastData; onHide: () => void }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 2500);

    return () => clearTimeout(timeout);
  }, [anim, onHide, data]);

  const config: { icon: React.ComponentProps<typeof Ionicons>["name"]; color: string } =
    data.type === "success"
      ? { icon: "checkmark-circle", color: theme.colors.success }
      : data.type === "error"
        ? { icon: "alert-circle", color: theme.colors.error }
        : { icon: "information-circle", color: theme.colors.info };

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: theme.spacing.lg,
        right: theme.spacing.lg,
        bottom: insets.bottom + 74,
        opacity: anim,
        transform: [
          {
            translateY: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderLeftWidth: 4,
          borderLeftColor: config.color,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          ...theme.shadow,
        }}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
        <Text style={{ flex: 1, color: theme.colors.text, ...theme.text.body }}>
          {data.message}
        </Text>
      </View>
    </Animated.View>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve essere usato dentro ToastProvider");
  }

  return context;
}
