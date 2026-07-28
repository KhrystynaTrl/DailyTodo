export interface Appointment {
  id: number;
  titolo: string;
  professionista: string;
  professionalId: number;
  tipologia: string;
  serviceTypeId: number;
  data: string;
  ora: string;
  durata: number;
  stato: "confermato" | "in attesa" | "annullato";
  note?: string;
}
