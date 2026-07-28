// Autenticazione reale contro il backend Spring Boot (POST /api/auth/*).
import { SessionUser } from "../storage/session.storage";
import { TokenSet } from "../storage/token.storage";
import { rawPost } from "./api.client";
import { AuthUser, toSessionUser } from "./auth.types";

type AuthResponse = TokenSet & { user: AuthUser };

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function login(
  payload: LoginPayload,
): Promise<{ tokens: TokenSet; user: SessionUser }> {
  const { accessToken, refreshToken, tokenType, user } =
    await rawPost<AuthResponse>("/api/auth/login", payload);

  return {
    tokens: { accessToken, refreshToken, tokenType },
    user: toSessionUser(user),
  };
}

export async function register(
  payload: RegisterPayload,
): Promise<{ tokens: TokenSet; user: SessionUser }> {
  const { accessToken, refreshToken, tokenType, user } =
    await rawPost<AuthResponse>("/api/auth/register", payload);

  return {
    tokens: { accessToken, refreshToken, tokenType },
    user: toSessionUser(user),
  };
}
