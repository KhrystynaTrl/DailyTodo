// Client HTTP condiviso per il backend Spring Boot: aggiunge l'header di
// autenticazione, normalizza gli errori e gestisce il refresh automatico
// dell'access token scaduto (401).
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  type TokenSet,
} from "../storage/token.storage";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  validationErrors?: Record<string, string>;

  constructor(
    status: number,
    message: string,
    validationErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

// Chiamata quando il refresh token non è più valido: forza il logout globale.
let onSessionExpired: (() => void) | null = null;

export function setOnSessionExpired(callback: (() => void) | null) {
  onSessionExpired = callback;
}

// Alcune risposte (es. 204 su un update) non hanno body: evitiamo che
// response.json() lanci un errore di parsing su stringa vuota.
async function parseSuccessBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  try {
    const body = await response.json();
    return new ApiError(
      response.status,
      body.message ?? "Si è verificato un errore",
      body.validationErrors,
    );
  } catch {
    return new ApiError(response.status, "Si è verificato un errore");
  }
}

// Chiamata "cruda", senza header di auth né retry: usata solo per il refresh
// per evitare ricorsione infinita con apiFetch.
async function rawPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  return response.json() as Promise<T>;
}

async function tryRefreshSession(): Promise<string | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearTokens();
    onSessionExpired?.();
    return null;
  }

  try {
    const tokens = await rawPost<TokenSet>("/api/auth/refresh", {
      refreshToken,
    });
    await saveTokens(tokens);
    return tokens.accessToken;
  } catch {
    await clearTokens();
    onSessionExpired?.();
    return null;
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  authenticated?: boolean;
};

// Wrapper principale: da usare per tutte le chiamate verso endpoint protetti.
export async function apiFetch<T>(
  path: string,
  { method = "GET", body, authenticated = true }: ApiFetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (authenticated) {
    const accessToken = await getAccessToken();
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && authenticated) {
    const newAccessToken = await tryRefreshSession();
    if (!newAccessToken) throw await parseErrorResponse(response);

    const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!retryResponse.ok) throw await parseErrorResponse(retryResponse);
    return parseSuccessBody<T>(retryResponse);
  }

  if (!response.ok) throw await parseErrorResponse(response);

  return parseSuccessBody<T>(response);
}

export { rawPost };
