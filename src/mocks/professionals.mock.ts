export interface Professional {
  id: number;
  nome: string;
  specializzazione: string;
  serviceTypeIds: number[];
}

export const professionals: Professional[] = [
  {
    id: 1,
    nome: "Dr. Bianchi",
    specializzazione: "Medico generico",
    serviceTypeIds: [1],
  },
  {
    id: 2,
    nome: "Dott.ssa Verdi",
    specializzazione: "Fisioterapista",
    serviceTypeIds: [2],
  },
  {
    id: 3,
    nome: "Dott. Neri",
    specializzazione: "Dermatologo",
    serviceTypeIds: [3],
  },
  {
    id: 4,
    nome: "Dott.ssa Rossi",
    specializzazione: "Nutrizionista",
    serviceTypeIds: [4],
  },
];
