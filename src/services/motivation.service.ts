// Servizio collegato a un'API pubblica reale (ZenQuotes) per ottenere frasi
// motivazionali. Include timeout, tipizzazione della risposta e gestione errori.

export interface Quote {
  id: string;
  text: string;
  author: string;
}

// Forma grezza restituita dall'API ZenQuotes: { q: frase, a: autore, h: html }
type ZenQuote = {
  q: string;
  a: string;
  h?: string;
};

// Errore tipizzato per distinguere il timeout dagli altri errori di rete.
export class TimeoutError extends Error {
  constructor() {
    super("La richiesta ha impiegato troppo tempo. Riprova.");
    this.name = "TimeoutError";
  }
}

const API_URL = "https://zenquotes.io/api/quotes";
const TIMEOUT_MS = 8000;

export async function getMotivationalQuotes(): Promise<Quote[]> {
  const controller = new AbortController();
  // Timeout simulato: se l'API non risponde entro TIMEOUT_MS annulliamo.
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Il server ha risposto con un errore (${response.status})`);
    }

    const data = (await response.json()) as ZenQuote[];

    if (!Array.isArray(data)) {
      throw new Error("Risposta non valida dal servizio");
    }

    return data
      .filter((item) => item.q)
      .map((item, index) => ({
        id: `${index}-${item.a}`,
        text: item.q,
        author: item.a?.trim() || "Anonimo",
      }));
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TimeoutError();
    }
    if (error instanceof TimeoutError) {
      throw error;
    }
    // Errori di rete (assenza di connessione, DNS, ecc.)
    throw new Error(
      "Impossibile contattare il servizio. Controlla la connessione e riprova.",
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
