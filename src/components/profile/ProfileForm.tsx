import React, { useEffect, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { isAtLeastAge, isRequired, isValidDate } from "../../utils/validators";
import AppButton from "../ui/AppButton";
import AppTextField from "../ui/AppTextField";
import Card from "../ui/Card";
import DateField from "../ui/DateField";
import ImgCard from "../ui/ImgCard";

const maxBirthDate = new Date();
maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 16);
import ChangePasswordModal from "./ChangePasswordModal";

type ProfileFields = {
  name: string;
  surname: string;
  phone: string;
  birthDate: string;
  profilePicture: string;
  bio: string;
};

type ProfileFormProps = {
  onDirtyChange?: (dirty: boolean) => void;
};

const toFields = (user: ReturnType<typeof useAuth>["user"]): ProfileFields => ({
  name: user?.name ?? "",
  surname: user?.surname ?? "",
  phone: user?.phone ?? "",
  birthDate: user?.birthDate ?? "",
  profilePicture: user?.profilePicture ?? "",
  bio: user?.bio ?? "",
});

export default function ProfileForm({ onDirtyChange }: ProfileFormProps) {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [snapshot, setSnapshot] = useState<ProfileFields>(() => toFields(user));
  const [fields, setFields] = useState<ProfileFields>(() => toFields(user));

  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [profilePictureError, setProfilePictureError] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const surnameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const birthDateRef = useRef<TextInput>(null);

  const isDirty =
    mode === "edit" && JSON.stringify(fields) !== JSON.stringify(snapshot);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const setField = <K extends keyof ProfileFields>(key: K, value: ProfileFields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const startEdit = () => {
    setSnapshot(toFields(user));
    setFields(toFields(user));
    setNameError("");
    setSurnameError("");
    setPhoneError("");
    setBirthDateError("");
    setProfilePictureError("");
    setSubmitError("");
    setSuccess(false);
    setMode("edit");
  };

  const cancelEdit = () => {
    setFields(snapshot);
    setNameError("");
    setSurnameError("");
    setPhoneError("");
    setBirthDateError("");
    setProfilePictureError("");
    setSubmitError("");
    setMode("view");
  };

  const validateName = () => {
    if (!isRequired(fields.name)) {
      setNameError("Inserisci il tuo nome");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateSurname = () => {
    if (!isRequired(fields.surname)) {
      setSurnameError("Inserisci il tuo cognome");
      return false;
    }
    setSurnameError("");
    return true;
  };

  const validatePhone = () => {
    if (!isRequired(fields.phone)) {
      setPhoneError("Inserisci il tuo numero di telefono");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateBirthDate = () => {
    if (!isRequired(fields.birthDate)) {
      setBirthDateError("Inserisci la tua data di nascita");
      return false;
    }
    if (!isValidDate(fields.birthDate)) {
      setBirthDateError("Inserisci una data valida (GG/MM/AAAA)");
      return false;
    }
    if (!isAtLeastAge(fields.birthDate, 16)) {
      setBirthDateError("Devi avere almeno 16 anni");
      return false;
    }
    setBirthDateError("");
    return true;
  };

  const validateProfilePicture = () => {
    if (!isRequired(fields.profilePicture)) {
      setProfilePictureError("Seleziona una foto profilo");
      return false;
    }
    setProfilePictureError("");
    return true;
  };

  const handleSave = async () => {
    setSubmitError("");
    setSuccess(false);

    const isNameValid = validateName();
    const isSurnameValid = validateSurname();
    const isPhoneValid = validatePhone();
    const isBirthDateValid = validateBirthDate();
    const isProfilePictureValid = validateProfilePicture();

    if (
      !isNameValid ||
      !isSurnameValid ||
      !isPhoneValid ||
      !isBirthDateValid ||
      !isProfilePictureValid
    ) {
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        name: fields.name,
        surname: fields.surname,
        phone: fields.phone,
        birthDate: fields.birthDate,
        profilePicture: fields.profilePicture,
        bio: fields.bio || undefined,
      });
      setSnapshot(fields);
      setMode("view");
      setSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante il salvataggio",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isEditing = mode === "edit";

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
