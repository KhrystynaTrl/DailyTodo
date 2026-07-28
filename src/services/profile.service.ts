// Gestione profilo utente reale contro il backend Spring Boot
// (PUT /api/users/me e /api/users/me/password, entrambi autenticati).
import { SessionUser } from "../storage/session.storage";
import { apiFetch } from "./api.client";
import { AuthUser, toSessionUser } from "./auth.types";

export type ProfileUpdate = Partial<{
  name: string;
  surname: string;
  phone: string;
  birthDate: string;
  profilePicture: string;
  bio: string;
}>;

export async function updateProfile(
  current: SessionUser,
  changes: ProfileUpdate,
): Promise<SessionUser> {
  const body = {
    firstName: changes.name ?? current.name ?? "",
    lastName: changes.surname ?? current.surname ?? "",
    phone: changes.phone ?? current.phone ?? "",
    birthDate: changes.birthDate ?? current.birthDate ?? "",
    avatarUrl: changes.profilePicture ?? current.profilePicture ?? "",
    bio: changes.bio ?? current.bio ?? "",
  };

  const updated = await apiFetch<AuthUser>("/api/users/me", {
    method: "PUT",
    body,
  });

  return toSessionUser(updated);
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await apiFetch<void>("/api/users/me/password", {
    method: "PATCH",
    body: { currentPassword, newPassword },
  });
}
