export type User = {
  id: number;
  email: string;
  password: string;
  name?: string;
  surname?: string;
  phone?: string;
  birthDate?: string;
  profilePicture?: string;
  bio?: string;
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
  {
    id: 3,
    email: "test@wellness.com",
    password: "Password1234",
  },
];
