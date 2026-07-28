// Frasi motivazionali: il backend fa da proxy verso l'API pubblica ZenQuotes
// (GET /api/motivation/quotes). Necessario perché ZenQuotes non espone gli
// header CORS: dal web il browser blocca la risposta di una chiamata diretta,
// mentre da mobile funzionava perché React Native non applica CORS (è una
// restrizione solo dei browser). Le chiamate server-to-server non ne risentono.
import { apiFetch } from "./api.client";

export interface Quote {
  id: string;
  text: string;
  author: string;
}

// Forma grezza restituita da ZenQuotes (e quindi dal nostro proxy, che la
// inoltra invariata): { q: frase, a: autore, h: html }
type ZenQuote = {
  q: string;
  a: string;
  h?: string;
};

export async function getMotivationalQuotes(): Promise<Quote[]> {
  const data = await apiFetch<ZenQuote[]>("/api/motivation/quotes");

  return data
    .filter((item) => item.q)
    .map((item, index) => ({
      id: `${index}-${item.a}`,
      text: item.q,
      author: item.a?.trim() || "Anonimo",
    }));
}
