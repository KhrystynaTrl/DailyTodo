// Persistenza locale dei token di autenticazione del backend Spring Boot.
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dailytodo:tokens";

export type TokenSet = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
};

// Cache in memoria per evitare una lettura async ad ogni chiamata API.
let cachedTokens: TokenSet | null = null;

export async function saveTokens(tokens: TokenSet): Promise<void> {
  cachedTokens = tokens;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export async function loadTokens(): Promise<TokenSet | null> {
  if (cachedTokens) return cachedTokens;

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  cachedTokens = raw ? (JSON.parse(raw) as TokenSet) : null;
  return cachedTokens;
}

export async function getAccessToken(): Promise<string | null> {
  const tokens = await loadTokens();
  return tokens?.accessToken ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const tokens = await loadTokens();
  return tokens?.refreshToken ?? null;
}

export async function clearTokens(): Promise<void> {
  cachedTokens = null;
  await AsyncStorage.removeItem(STORAGE_KEY);
}
