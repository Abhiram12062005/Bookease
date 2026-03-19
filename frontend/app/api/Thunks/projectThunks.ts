import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectDocument,
  UploadResponse,
} from '../Type/projectType'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

const getToken = (): string => {
  try {
    const raw = localStorage.getItem('bookease_session')
    if (!raw) return ''
    const parsed = JSON.parse(raw)
    // handle both { token: '...' } and bare string
    return parsed?.token ?? parsed?.accessToken ?? parsed ?? ''
  } catch {
    return ''
  }
}

const jsonHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization:  `Bearer ${getToken()}`,
})

const multipartHeaders = (): Record<string, string> => ({
  Authorization: `Bearer ${getToken()}`,
})

export const uploadProjectImage = createAsyncThunk<
  UploadResponse & { field: 'businessLogo' | 'coverImage' },
  { file: File, field: 'businessLogo' | 'coverImage' },
  { state: RootState, rejectValue: string }
>('project/uploadImage', async ({ file, field }, { rejectWithValue }) => {
  try {
    const body = new FormData()
    body.append('file', file)

    const res = await fetch(`${BASE}/api/projects/upload`, {
      method:  'POST',
      headers: multipartHeaders(),
      body,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.error ?? err.message ?? 'Upload failed')
    }

    const data = await res.json()
    return { ...data, field }
  } catch (e: unknown) {
    return rejectWithValue((e as Error).message)
  }
})

export const createProject = createAsyncThunk<
  ProjectDocument,
  CreateProjectPayload,
  { state: RootState; rejectValue: string }
>('project/create', async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE}/api/projects`, {
      method:  'POST',
      headers: jsonHeaders(),
      body:    JSON.stringify(payload),
    })

   if (!res.ok) {
      const err = await res.json().catch(() => ({}))

      // ── Surface validation errors clearly ──────────────────────────────
      if (err.errors && Array.isArray(err.errors)) {
        const messages = err.errors
          .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
          .join(' | ')
        console.error('=== VALIDATION ERRORS ===', err.errors)
        return rejectWithValue(messages)
      }

      return rejectWithValue(err.error ?? err.message ?? 'Failed to create project')
    }

    const data = await res.json()
    return data.data ?? data
  } catch (e: unknown) {
    return rejectWithValue((e as Error).message)
  }
})

export const fetchProjects = createAsyncThunk<
  ProjectDocument[],
  void,
  { state: RootState; rejectValue: string }
>('project/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE}/api/projects`, {
      headers: jsonHeaders(),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.error ?? err.message ?? 'Failed to fetch projects')
    }

    const data = await res.json()
    return data.data ?? data
  } catch (e: unknown) {
    return rejectWithValue((e as Error).message)
  }
})

// ══════════════════════════════════════════════════════════════════════════════
// FETCH SINGLE PROJECT
// GET /api/projects/:id
// ══════════════════════════════════════════════════════════════════════════════

export const fetchProjectById = createAsyncThunk<
  ProjectDocument,
  string,
  { state: RootState; rejectValue: string }
>('project/fetchById', async (id, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE}/api/projects/${id}`, {
      headers: jsonHeaders(),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.error ?? err.message ?? 'Project not found')
    }

    const data = await res.json()
    return data.data ?? data
  } catch (e: unknown) {
    return rejectWithValue((e as Error).message)
  }
})

// ══════════════════════════════════════════════════════════════════════════════
// UPDATE PROJECT
// PATCH /api/projects/:id
// ══════════════════════════════════════════════════════════════════════════════

export const updateProject = createAsyncThunk<
  ProjectDocument,
  { id: string; payload: UpdateProjectPayload },
  { state: RootState; rejectValue: string }
>('project/update', async ({ id, payload }, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE}/api/projects/${id}`, {
      method:  'PATCH',
      headers: jsonHeaders(),
      body:    JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.error ?? err.message ?? 'Failed to update project')
    }

    const data = await res.json()
    return data.data ?? data
  } catch (e: unknown) {
    return rejectWithValue((e as Error).message)
  }
})

// ══════════════════════════════════════════════════════════════════════════════
// DELETE PROJECT
// DELETE /api/projects/:id
// ══════════════════════════════════════════════════════════════════════════════

export const deleteProject = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>('project/delete', async (id, { getState, rejectWithValue }) => {
  try {
    const res = await fetch(`${BASE}/api/projects/${id}`, {
      method:  'DELETE',
      headers: jsonHeaders(),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return rejectWithValue(err.error ?? err.message ?? 'Failed to delete project')
    }

    return id
  } catch (e: unknown) {
    return rejectWithValue((e as Error).message)
  }
})