export interface Activity {
  id: number;
  titolo: string;
  descrizione?: string;
  categoria: "allenamento" | "salute" | "alimentazione" | "altro";
  data: string;
  ora?: string;
  completata: boolean;
  priorita: "bassa" | "media" | "alta";
}

export const activities: Activity[] = [
  {
    id: 1,
    titolo: "Visita medica",
    categoria: "salute",
    data: "20/09/2026",
    ora: "16:00",
    completata: false,
    priorita: "media",
  },
];
