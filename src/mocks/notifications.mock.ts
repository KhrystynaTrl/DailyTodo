export interface Notification {
  id: number;
  titolo: string;
  messaggio: string;
  data: string;
  letta: boolean;
  tipo: "informazione" | "successo" | "avviso" | "errore";
}
