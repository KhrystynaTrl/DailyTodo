import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type ImgCardProps = {
  value?: string | null;
  onChange?: (uri: string) => void;
  error?: string;
};

export default function ImgCard({ value, onChange, error }: ImgCardProps) {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | null>(value ?? null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permesso richiesto",
        "È necessario il permesso per accedere alla libreria immagini.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onChange?.(uri);
    }
  };

  return (
    <View style={{ alignItems: "center", marginBottom: theme.spacing.xl }}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={{
            width: 200,
            height: 150,
            borderRadius: theme.radii.lg,
            marginBottom: theme.spacing.md,
          }}
        />
      ) : (
        <View
          style={{
            width: 200,
            height: 150,
            borderRadius: theme.radii.lg,
            backgroundColor: theme.colors.surfaceAlt,
            borderWidth: 1,
            borderColor: theme.colors.border,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <Text style={{ color: theme.colors.textMuted, ...theme.text.caption }}>
            Nessuna immagine selezionata
          </Text>
        </View>
      )}

      <Pressable
        onPress={pickImage}
        style={({ pressed }) => [
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radii.md,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.lg,
          },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={{ color: theme.colors.onPrimary, ...theme.text.button }}>
          {image ? "Cambia immagine" : "Scegli immagine"}
        </Text>
      </Pressable>

      {error ? (
        <Text
          style={{
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
            ...theme.text.caption,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
