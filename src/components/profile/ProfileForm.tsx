import React, { useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import AppButton from "../ui/AppButton";
import AppTextField from "../ui/AppTextField";
import Card from "../ui/Card";
import DateField from "../ui/DateField";
import ImgCard from "../ui/ImgCard";
import ChangePasswordModal from "./ChangePasswordModal";
import { useProfileForm } from "./useProfileForm";

const maxBirthDate = new Date();
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 16);

type ProfileFormProps = {
  onDirtyChange?: (dirty: boolean) => void;
};

export default function ProfileForm({ onDirtyChange }: ProfileFormProps) {
  const { theme } = useTheme();
  const {
    user,
    isEditing,
    fields,
    setField,
    nameError,
    surnameError,
    phoneError,
    birthDateError,
    profilePictureError,
    submitError,
    success,
    isSaving,
    validateName,
    validateSurname,
    validatePhone,
    validateBirthDate,
    handleSave,
    startEdit,
    cancelEdit,
  } = useProfileForm(onDirtyChange);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const surnameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const birthDateRef = useRef<TextInput>(null);

  return (
    <>
      <Card variant="flat">
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <Text style={{ color: theme.colors.text, ...theme.text.h2 }}>
            Il tuo profilo
          </Text>
          {!isEditing ? (
            <Pressable onPress={startEdit}>
              <Text style={{ color: theme.colors.primary, ...theme.text.link }}>
                Modifica
              </Text>
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <ImgCard
            value={fields.profilePicture}
            onChange={(uri) => setField("profilePicture", uri)}
            error={profilePictureError}
          />
        ) : fields.profilePicture ? (
          <Image
            source={{ uri: fields.profilePicture }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              alignSelf: "center",
              marginBottom: theme.spacing.lg,
            }}
          />
        ) : null}

        {isEditing ? (
          <AppTextField
            placeholder="Nome"
            value={fields.name}
            onChangeText={(text) => setField("name", text)}
            onBlur={validateName}
            error={nameError}
            returnKeyType="next"
            onSubmitEditing={() => surnameRef.current?.focus()}
          />
        ) : (
          <ProfileRow label="Nome" value={fields.name} />
        )}

        {isEditing ? (
          <AppTextField
            ref={surnameRef}
            placeholder="Cognome"
            value={fields.surname}
            onChangeText={(text) => setField("surname", text)}
            onBlur={validateSurname}
            error={surnameError}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
        ) : (
          <ProfileRow label="Cognome" value={fields.surname} />
        )}

        {isEditing ? (
          <AppTextField
            placeholder="Email"
            value={user?.email ?? ""}
            editable={false}
            containerStyle={{ opacity: 0.6 }}
          />
        ) : (
          <ProfileRow label="Email" value={user?.email ?? ""} />
        )}

        {isEditing ? (
          <Pressable
            onPress={() => setPasswordModalVisible(true)}
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.radii.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              width: "75%",
              alignSelf: "center",
              marginBottom: theme.spacing.md,
            }}
          >
            <Text
              style={{
                color: theme.colors.textMuted,
                textAlign: "center",
                ...theme.text.body,
              }}
            >
              Cambia password
            </Text>
          </Pressable>
        ) : null}

        {isEditing ? (
          <AppTextField
            ref={phoneRef}
            placeholder="Telefono"
            value={fields.phone}
            onChangeText={(text) => setField("phone", text)}
            onBlur={validatePhone}
            error={phoneError}
            keyboardType="phone-pad"
            returnKeyType="next"
            onSubmitEditing={() => birthDateRef.current?.focus()}
          />
        ) : (
          <ProfileRow label="Telefono" value={fields.phone} />
        )}

        {isEditing ? (
          <DateField
            placeholder="Data di nascita (GG/MM/AAAA)"
            value={fields.birthDate}
            onChangeText={(text) => setField("birthDate", text)}
            onBlur={validateBirthDate}
            error={birthDateError}
            maximumDate={maxBirthDate}
          />
        ) : (
          <ProfileRow label="Data di nascita" value={fields.birthDate} />
        )}

        {isEditing ? (
          <AppTextField
            placeholder="Raccontaci qualcosa di te (opzionale)"
            value={fields.bio}
            onChangeText={(text) => setField("bio", text)}
            multiline
          />
        ) : (
          <ProfileRow label="Bio" value={fields.bio} />
        )}

        {submitError ? (
          <Text
            style={{
              color: theme.colors.error,
              textAlign: "center",
              marginBottom: theme.spacing.sm,
              ...theme.text.caption,
            }}
          >
            {submitError}
          </Text>
        ) : null}

        {success ? (
          <Text
            style={{
              color: theme.colors.primary,
              textAlign: "center",
              marginBottom: theme.spacing.sm,
              ...theme.text.caption,
            }}
          >
            Profilo aggiornato con successo
          </Text>
        ) : null}

        {isEditing ? (
          <>
            <AppButton title="Salva" onPress={handleSave} loading={isSaving} />
            <Pressable onPress={cancelEdit} style={{ marginTop: theme.spacing.sm }}>
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
          </>
        ) : null}
      </Card>

      <ChangePasswordModal
        visible={passwordModalVisible}
        onClose={() => setPasswordModalVisible(false)}
      />
    </>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text
        style={{
          color: theme.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          ...theme.text.caption,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: theme.colors.text,
          ...theme.text.body,
          fontWeight: "700",
        }}
      >
        {value || "—"}
      </Text>
    </View>
  );
}
