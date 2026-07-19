export type User = {
  id: number;
  email: string;
  password: string;
};

export const users: User[] = [
  {
    id: 1,
    email: "k@k.it",
    password: "12345678",
  },
  {
    id: 2,
    email: "annarossi@prova.it",
    password: "12345678",
  },
];
