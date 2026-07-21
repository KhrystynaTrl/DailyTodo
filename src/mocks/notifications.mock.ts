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
    messaggio:
      "Hai un appuntamento domani alle 10:00 con la Dott.ssa Bianchi. Ricordati di arrivare con 10 minuti di anticipo.",
    data: "21/07/2026 08:30",
    letta: false,
    tipo: "informazione",
  },
  {
    id: 2,
    titolo: "Obiettivo acqua raggiunto",
    messaggio: "Complimenti! Hai raggiunto il tuo obiettivo giornaliero di 2000 ml.",
    data: "20/07/2026 19:45",
    letta: false,
    tipo: "successo",
  },
  {
    id: 3,
    titolo: "Attività non completata",
    messaggio:
      "Non hai completato l'attività \"Camminata serale\" prevista per ieri.",
    data: "20/07/2026 22:10",
    letta: false,
    tipo: "avviso",
  },
  {
    id: 4,
    titolo: "Errore di sincronizzazione",
    messaggio:
      "Non è stato possibile sincronizzare i dati del profilo. Riprova più tardi.",
    data: "19/07/2026 14:05",
    letta: true,
    tipo: "errore",
  },
  {
    id: 5,
    titolo: "Nuova funzionalità disponibile",
    messaggio:
      "Ora puoi monitorare la quantità di acqua bevuta durante la giornata dalla sezione dedicata.",
    data: "18/07/2026 09:00",
    letta: true,
    tipo: "informazione",
  },
];
