export interface User {
  id: number;
  email: string;
  password: string;
}

export const users: User[] = [
  {
    id: 1,
    email: "k@k.it",
    password: "1234",
  },
];
