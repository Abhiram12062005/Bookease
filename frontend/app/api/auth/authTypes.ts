// ─── Request Payloads ─────────────────────────────────────────────────────────

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  phoneCountryCode: string;   
  phoneNumber: BigInteger;    
  email: string;
  password: string;
  confirmPassword: string;   
  organisationalName: string; 
  location: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────

export interface AuthApiResponse {
  ok: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt?: string; // ISO date string
}

// ─── Redux State ──────────────────────────────────────────────────────────────

export interface AuthState {
  session: Session | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}