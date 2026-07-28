export interface Activity {
  id: number;
  titolo: string;
  descrizione?: string;
  categoria: "allenamento" | "salute" | "alimentazione" | "altro";
  data: string;
  ora?: string;
  completata: boolean;
  priorita: "bassa" | "media" | "alta";
  durataMinuti?: number;
}
