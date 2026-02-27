import { createSlice } from '@reduxjs/toolkit';
import type { AuthState, Session } from './authTypes';
import { signIn, signUp, signOut } from './authThunks';

// ─── Session rehydration ──────────────────────────────────────────────────────

function loadSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('bookease_session');
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: AuthState = {
  session: loadSession(),
  loading: false,
  error:   null,
  message: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {

    // ── signIn ────────────────────────────────────────────────────────────────
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload; // Session { user, token }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? 'Sign in failed';
      });

    // ── signUp ────────────────────────────────────────────────────────────────
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.message = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload; // Session { user, token }
        state.message = 'Account created successfully!';
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? 'Sign up failed';
      });

    // ── signOut ───────────────────────────────────────────────────────────────
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.session = null;
        state.error   = null;
        state.message = null;
      });
  },
});

export const { clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;