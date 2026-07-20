export interface Notification {
  id: number;
  titolo: string;
  messaggio: string;
  data: string;
  letta: boolean;
  tipo: "informazione" | "successo" | "avviso" | "errore";
}

export const notifications: Notification[] = [
  {
    id: 1,
    titolo: "Promemoria appuntamento",
    messaggio: "Hai un appuntamento domani alle 10:00",
    data: "19/07/2026",
    letta: false,
    tipo: "informazione",
  },
];
