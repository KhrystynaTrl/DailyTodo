import { SessionUser } from "../storage/session.storage";

export type AuthUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  birthDate: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
};

export function toSessionUser(user: AuthUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.firstName,
    surname: user.lastName,
    phone: user.phone ?? undefined,
    birthDate: user.birthDate ?? undefined,
    profilePicture: user.avatarUrl ?? undefined,
    bio: user.bio ?? undefined,
  };
}
