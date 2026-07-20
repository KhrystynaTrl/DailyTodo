import { User, users } from "../mocks/user.mock";

const DELAY = 800;

export function findByEmail(email: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users.find((user) => user.email === email));
    }, DELAY);
  });
}

export function register(newUser: Omit<User, "id">): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const alreadyExists = users.some((user) => user.email === newUser.email);

      if (alreadyExists) {
        reject(new Error("Email già registrata"));
        return;
      }

      const user: User = {
        ...newUser,
        id: Math.max(0, ...users.map((u) => u.id)) + 1,
      };
      users.push(user);
      resolve(user);
    }, DELAY);
  });
}

export function changePassword(
  email: string,
  password: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((user) => user.email === email);

      if (!user) {
        reject(new Error("Utente non trovato"));
        return;
      }

      user.password = password;
      resolve();
    }, DELAY);
  });
}

export type ProfileUpdate = Partial<
  Pick<User, "name" | "surname" | "phone" | "birthDate" | "profilePicture" | "bio">
>;

export function updateProfile(
  id: number,
  changes: ProfileUpdate,
): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((user) => user.id === id);

      if (!user) {
        reject(new Error("Utente non trovato"));
        return;
      }

      Object.assign(user, changes);
      resolve({ ...user });
    }, DELAY);
  });
}

export function updatePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find((user) => user.email === email);

      if (!user) {
        reject(new Error("Utente non trovato"));
        return;
      }

      if (user.password !== currentPassword) {
        reject(new Error("Password attuale non corretta"));
        return;
      }

      user.password = newPassword;
      resolve();
    }, DELAY);
  });
}
