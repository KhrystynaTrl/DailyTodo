export interface ServiceType {
  id: number;
  nome: string;
  durata: number;
}

export const serviceTypes: ServiceType[] = [
  { id: 1, nome: "Visita generale", durata: 30 },
  { id: 2, nome: "Fisioterapia", durata: 45 },
  { id: 3, nome: "Dermatologia", durata: 20 },
  { id: 4, nome: "Nutrizionista", durata: 40 },
];
