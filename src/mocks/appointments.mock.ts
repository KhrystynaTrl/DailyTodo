export interface Appointment {
  id: number;
  titolo: string;
  professionista: string;
  tipologia: string;
  data: string;
  ora: string;
  durata: number;
  stato: "confermato" | "in attesa" | "annullato";
  note?: string;
}

export const appointments: Appointment[] = [
  {
    id: 1,
    titolo: "Controllo generale",
    professionista: "Dr. Bianchi",
    tipologia: "Visita generale",
    data: "25/09/2026",
    ora: "10:00",
    durata: 30,
    stato: "confermato",
  },
  {
    id: 2,
    titolo: "Fisioterapia",
    professionista: "Dott.ssa Verdi",
    tipologia: "Fisioterapia",
    data: "24/07/2026",
    ora: "09:30",
    durata: 45,
    stato: "confermato",
  },
];
