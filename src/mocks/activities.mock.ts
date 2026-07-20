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
  {
    id: 2,
    titolo: "Camminata mattutina",
    categoria: "allenamento",
    data: "20/07/2026",
    ora: "08:00",
    completata: true,
    priorita: "bassa",
  },
  {
    id: 3,
    titolo: "Bere 2L di acqua",
    categoria: "salute",
    data: "20/07/2026",
    completata: false,
    priorita: "media",
  },
  {
    id: 4,
    titolo: "Preparare i pasti della settimana",
    categoria: "alimentazione",
    data: "20/07/2026",
    completata: false,
    priorita: "alta",
  },
];
