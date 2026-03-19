import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createProject,
  fetchProjects,
  fetchProjectById,
  updateProject,
  deleteProject,
  uploadProjectImage,
} from '../Thunks/projectThunks'
import type {
  ProjectState,
  ProjectDocument,
  UploadResponse,
} from '../Type/projectType'

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ProjectState = {
  projects:     [],
  selected:     null,
  fetchStatus:  'idle',
  createStatus: 'idle',
  updateStatus: 'idle',
  uploadStatus: 'idle',
  deleteStatus: 'idle',   // ✅ added
  error:        null,
}

// ─── Slice ────────────────────────────────────────────────────────────────────

const projectSlice = createSlice({
  name: 'project',
  initialState,

  reducers: {
    selectProject(state, action: PayloadAction<ProjectDocument | null>) {
      state.selected = action.payload
    },
    clearProjectError(state) {
      state.error = null
    },
    resetCreateStatus(state) {
      state.createStatus = 'idle'
    },
    resetUpdateStatus(state) {
      state.updateStatus = 'idle'
    },
    resetUploadStatus(state) {
      state.uploadStatus = 'idle'
    },
    resetDeleteStatus(state) {              // ✅ added
      state.deleteStatus = 'idle'
    },
  },

  extraReducers: (builder) => {

    // ── uploadProjectImage ────────────────────────────────────────────────────
    builder
      .addCase(uploadProjectImage.pending, (state) => {
        state.uploadStatus = 'loading'
        state.error = null
      })
      .addCase(uploadProjectImage.fulfilled, (
        state,
        action: PayloadAction<UploadResponse & { field: 'businessLogo' | 'coverImage' }>
      ) => {
        state.uploadStatus = 'succeeded'
        if (state.selected) {
          state.selected.websiteDetails[action.payload.field] = action.payload.url
        }
      })
      .addCase(uploadProjectImage.rejected, (state, action) => {
        state.uploadStatus = 'failed'
        state.error = action.payload as string
      })

    // ── createProject ─────────────────────────────────────────────────────────
    builder
      .addCase(createProject.pending, (state) => {
        state.createStatus = 'loading'
        state.error = null
      })
      .addCase(createProject.fulfilled, (state, action: PayloadAction<ProjectDocument>) => {
        state.createStatus = 'succeeded'
        state.projects.unshift(action.payload)
        state.selected = action.payload
      })
      .addCase(createProject.rejected, (state, action) => {
        state.createStatus = 'failed'
        state.error = action.payload as string
      })

    // ── fetchProjects ─────────────────────────────────────────────────────────
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.fetchStatus = 'loading'
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<ProjectDocument[]>) => {
        state.fetchStatus = 'succeeded'
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.error = action.payload as string
      })

    // ── fetchProjectById ──────────────────────────────────────────────────────
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.fetchStatus = 'loading'
      })
      .addCase(fetchProjectById.fulfilled, (state, action: PayloadAction<ProjectDocument>) => {
        state.fetchStatus = 'succeeded'
        state.selected = action.payload
        const idx = state.projects.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.projects[idx] = action.payload
        else state.projects.unshift(action.payload)
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.fetchStatus = 'failed'
        state.error = action.payload as string
      })

    // ── updateProject ─────────────────────────────────────────────────────────
    builder
      .addCase(updateProject.pending, (state) => {
        state.updateStatus = 'loading'
        state.error = null
      })
      .addCase(updateProject.fulfilled, (state, action: PayloadAction<ProjectDocument>) => {
        state.updateStatus = 'succeeded'
        const idx = state.projects.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.projects[idx] = action.payload
        if (state.selected?._id === action.payload._id) state.selected = action.payload
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.updateStatus = 'failed'
        state.error = action.payload as string
      })

    // ── deleteProject ─────────────────────────────────────────────────────────
    // ✅ now uses deleteStatus — was incorrectly using updateStatus before
    builder
      .addCase(deleteProject.pending, (state) => {
        state.deleteStatus = 'loading'
        state.error = null
      })
      .addCase(deleteProject.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteStatus = 'succeeded'
        state.projects = state.projects.filter((p) => p._id !== action.payload)
        if (state.selected?._id === action.payload) state.selected = null
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.deleteStatus = 'failed'
        state.error = action.payload as string
      })
  },
})

export const {
  selectProject,
  clearProjectError,
  resetCreateStatus,
  resetUpdateStatus,
  resetUploadStatus,
  resetDeleteStatus,   // ✅ exported
} = projectSlice.actions

export default projectSlice.reducer