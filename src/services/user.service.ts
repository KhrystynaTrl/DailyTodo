import { User, users } from "../mocks/user.mock";

const DELAY = 800;

export function findByEmail(email: string): Promise<User | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users.find((user) => user.email === email));
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

