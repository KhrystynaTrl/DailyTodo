import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { isAtLeastAge, isRequired, isValidDate } from "../../utils/validators";

export type ProfileFields = {
  name: string;
  surname: string;
  phone: string;
  birthDate: string;
  profilePicture: string;
  bio: string;
};

const toFields = (user: ReturnType<typeof useAuth>["user"]): ProfileFields => ({
  name: user?.name ?? "",
  surname: user?.surname ?? "",
  phone: user?.phone ?? "",
  birthDate: user?.birthDate ?? "",
  profilePicture: user?.profilePicture ?? "",
  bio: user?.bio ?? "",
});

export function useProfileForm(onDirtyChange?: (dirty: boolean) => void) {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

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

  const isDirty =
    mode === "edit" && JSON.stringify(fields) !== JSON.stringify(snapshot);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const setField = <K extends keyof ProfileFields>(
    key: K,
    value: ProfileFields[K],
  ) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const resetErrors = () => {
    setNameError("");
    setSurnameError("");
    setPhoneError("");
    setBirthDateError("");
    setProfilePictureError("");
  };

  const startEdit = () => {
    setSnapshot(toFields(user));
    setFields(toFields(user));
    resetErrors();
    setSubmitError("");
    setSuccess(false);
    setMode("edit");
  };

  const cancelEdit = () => {
    setFields(snapshot);
    resetErrors();
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
      showToast("Profilo aggiornato con successo");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Errore durante il salvataggio",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    isEditing: mode === "edit",
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
  };
}
