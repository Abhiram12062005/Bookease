import { createAsyncThunk } from '@reduxjs/toolkit';
import type { SignInPayload, SignUpPayload, AuthApiResponse, Session } from './authTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function saveSession(session: Session): void {
  localStorage.setItem('bookease_session', JSON.stringify(session));
  // Also save token as cookie so Next.js middleware can read it server-side
  document.cookie = `bookease_token=${session.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
}

function clearSession(): void {
  localStorage.removeItem('bookease_session');
  // Clear cookie
  document.cookie = 'bookease_token=; path=/; max-age=0';
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export const signIn = createAsyncThunk<Session, SignInPayload, { rejectValue: string }>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res  = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data: AuthApiResponse = await res.json();

      if (!res.ok || !data.ok) return rejectWithValue(data.error ?? 'Invalid email or password');
      if (!data.user || !data.token) return rejectWithValue('Incomplete response from server');

      const session: Session = { user: data.user, token: data.token };
      saveSession(session);
      return session;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  },
);

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export const signUp = createAsyncThunk<Session, SignUpPayload, { rejectValue: string }>(
  'auth/signUp',
  async (payload, { rejectWithValue }) => {
    try {
      if (payload.password !== payload.confirmPassword) {
        return rejectWithValue('Passwords do not match');
      }
      const res  = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:             payload.name,
          phoneCountryCode: payload.phoneCountryCode,
          phoneNumber:      payload.phoneNumber.toString(),
          email:            payload.email,
          password:         payload.password,
          confirmPassword:  payload.confirmPassword,
          organisationName: payload.organisationalName,
          location:         payload.location,
        }),
      });
      const data: AuthApiResponse = await res.json();

      if (!res.ok || !data.ok) return rejectWithValue(data.error ?? 'Registration failed');
      if (!data.user || !data.token) return rejectWithValue('Incomplete response from server');

      const session: Session = { user: data.user, token: data.token };
      saveSession(session);
      return session;
    } catch {
      return rejectWithValue('Network error. Please try again.');
    }
  },
);

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      clearSession();
    } catch {
      return rejectWithValue('Sign out failed');
    }
  },
);