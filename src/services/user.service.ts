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
