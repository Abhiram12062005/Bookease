import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// ─── Typed base hooks ─────────────────────────────────────────────────────────
// Use these everywhere instead of plain useDispatch / useSelector

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

// ─── Auth convenience selectors ───────────────────────────────────────────────

/** Full auth slice: { session, loading, error, message } */
export const useAuth = () =>
  useAppSelector((state) => state.auth);

/** Current session object { user, token } or null */
export const useSession = () =>
  useAppSelector((state) => state.auth.session);

/** Logged-in user object or null */
export const useAuthUser = () =>
  useAppSelector((state) => state.auth.session?.user ?? null);

/** True when a session exists */
export const useIsAuthenticated = () =>
  useAppSelector((state) => state.auth.session !== null);

/** Auth loading state */
export const useAuthLoading = () =>
  useAppSelector((state) => state.auth.loading);

/** Auth error string or null */
export const useAuthError = () =>
  useAppSelector((state) => state.auth.error);