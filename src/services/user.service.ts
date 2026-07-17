import { User, users } from "../mocks/user.mock";

export function findByEmail(email: string): User | undefined {
  //TODO return Promise
  return users.filter((user) => user.email === email).at(0);
}

export function changePassword(email: string, password: string): void {
  let user = findByEmail(email);
  if (user) {
    user.password = password;
    return;
  }
  throw new Error("User not found");
}
