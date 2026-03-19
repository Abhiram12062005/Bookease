'use client'

import { ChevronsUpDown, Search, Plus, FolderOpen, Menu, X, Loader2, MoreVertical, Trash2, AlertTriangle } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import CreateProjectModal, { StepConfig } from '../components/ui/inputPopup'
import {
  fetchProjects,
  createProject,
  uploadProjectImage,
  deleteProject,
} from '../api/Thunks/projectThunks'
import { selectProject, resetCreateStatus, clearProjectError } from '../api/Slice/projectSlice'
import type { CreateProjectPayload } from '../api/Type/projectType'
import { useAppDispatch, useAppSelector } from '../api/hooks'

const MY_STEPS: StepConfig[] = [
  {
    id: 1,
    label: 'Business Basics',
    fields: [
      { key: 'businessName',    label: 'Business Name',    type: 'text',            placeholder: 'e.g. The Grand Café' },
      { key: 'businessType',    label: 'Business Type',    type: 'dropdown',        placeholder: 'Select business type',
        options: ['Café / Restaurant', 'Corporate Events', 'Event Organizer', 'Workshops / Classes', 'Other'] },
      { key: 'contactEmail',    label: 'Contact Email',    type: 'email',           placeholder: 'hello@yourbusiness.com' },
      { key: 'phoneNumber',     label: 'Phone Number',     type: 'phone',           placeholder: '+91 98765 43210 (WhatsApp preferred)' },
      { key: 'businessAddress', label: 'Business Address', type: 'text',            placeholder: 'Street / Area' },
      { key: 'websiteDomain',   label: 'Website Domain',   type: 'text-with-suffix', placeholder: 'yourbusiness', suffix: '.bookease.in' },
      { key: 'city',            label: 'City',             type: 'text',            placeholder: 'e.g. Mumbai' },
      { key: 'state',           label: 'State',            type: 'text',            placeholder: 'e.g. Maharashtra' },
      { key: 'country',         label: 'Country',          type: 'dropdown',        placeholder: 'Select country',
        options: ['India', 'United States', 'United Kingdom', 'UAE', 'Singapore', 'Australia', 'Canada', 'Other'] },
      { key: 'googleMapsLink',  label: 'Google Maps Link', type: 'text',            placeholder: 'https://maps.google.com/... (optional)' },
    ],
  },
  {
    id: 2,
    label: 'Branding',
    fields: [
      { key: 'businessLogo',  label: 'Business Logo',          type: 'image-upload', accept: 'image/*' },
      { key: 'tagline',       label: 'Tagline',                type: 'text',         placeholder: 'e.g. Where every event feels special (optional)' },
      { key: 'primaryColor',  label: 'Primary Color Theme',    type: 'color',        placeholder: '#7C3AED' },
      { key: 'coverImage',    label: 'Cover Image / Banner',   type: 'image-upload', accept: 'image/*' },
    ],
  },
  {
    id: 3,
    label: 'Payments',
    fields: [
      { key: 'currency',           label: 'Currency',             type: 'dropdown', placeholder: '₹ INR (default)',
        options: ['₹ INR', '$ USD', '£ GBP', '€ EUR', 'AED', 'SGD', 'AUD'] },
      { key: 'paymentGateway',     label: 'Payment Gateway',      type: 'dropdown', placeholder: 'Select gateway',
        options: ['Razorpay', 'Stripe', 'UPI', 'Bank Account'] },
      { key: 'bankAccountDetails', label: 'Bank Account Details', type: 'text',     placeholder: 'Account no. / IFSC / UPI ID (for payouts)' },
      { key: 'gstNumber',          label: 'GST Number',           type: 'text',     placeholder: '22AAAAA0000A1Z5 (optional)' },
    ],
  },
]

function dataURLtoFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',')
  const mime             = header.match(/:(.*?);/)?.[1] ?? 'image/png'
  const binary           = atob(base64)
  const buffer           = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i)
  return new File([buffer], filename, { type: mime })
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────

interface DeleteConfirmModalProps {
  projectName: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmModal = ({ projectName, isDeleting, onConfirm, onCancel }: DeleteConfirmModalProps) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    />

    {/* Dialog */}
    <div className="relative w-full max-w-sm bg-[#1a1a26] border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col gap-5">
      {/* Icon */}
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mx-auto">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>

      {/* Text */}
      <div className="text-center">
        <h3 className="text-white text-base font-semibold mb-1">Delete Project</h3>
        <p className="text-white/50 text-sm leading-relaxed">
          Are you sure you want to delete{' '}
          <span className="text-white/80 font-medium">"{projectName}"</span>?
          This action cannot be undone.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 py-2.5 text-sm text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-2.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isDeleting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Deleting…
            </>
          ) : (
            <>
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)

// ── Project Card Three-Dot Menu ───────────────────────────────────────────────

interface ProjectCardMenuProps {
  projectId: string
  projectName: string
  onDeleteClick: (id: string, name: string) => void
}

const ProjectCardMenu = ({ projectId, projectName, onDeleteClick }: ProjectCardMenuProps) => {
  const [open, setOpen] = useState(false)
  const menuRef         = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Three-dot button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`p-1.5 rounded-lg transition-all ${
          open
            ? 'bg-white/10 text-white'
            : 'text-white/0 group-hover:text-white/40 hover:!text-white hover:bg-white/10'
        }`}
        aria-label="Project options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-40 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false)
              onDeleteClick(projectId, projectName)
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            Delete project
          </button>
        </div>
      )}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Page
// ══════════════════════════════════════════════════════════════════════════════

const Page = () => {
  const dispatch = useAppDispatch()

  const { projects, fetchStatus, createStatus, uploadStatus, deleteStatus, error } =
    useAppSelector((s) => s.project)

  const [isScrolled,       setIsScrolled]       = useState(false)
  const [isProjectsClick,  setIsProjectClicked] = useState(false)
  const [selectedProject,  setSelectedProject]  = useState('All Projects')
  const [searchTerm,       setSearchTerm]        = useState('')
  const [projectSearch,    setProjectSearch]     = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen]  = useState(false)
  const [isModalOpen,      setIsModalOpen]       = useState(false)
  const [submitError,      setSubmitError]       = useState<string | null>(null)

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { dispatch(fetchProjects()) }, [dispatch])

  useEffect(() => {
    if (createStatus === 'succeeded') {
      setIsModalOpen(false)
      dispatch(resetCreateStatus())
      setSubmitError(null)
    }
  }, [createStatus, dispatch])

  useEffect(() => {
    if (createStatus === 'failed' && error) {
      setSubmitError(error)
      dispatch(clearProjectError())
    }
  }, [createStatus, error, dispatch])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProjectClicked(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleModalSubmit = useCallback(async (flat: Record<string, string>) => {
    setSubmitError(null)
    try {
      let businessLogoUrl: string | null = null
      if (flat.businessLogo?.startsWith('data:')) {
        const file   = dataURLtoFile(flat.businessLogo, 'business-logo.png')
        const result = await dispatch(uploadProjectImage({ file, field: 'businessLogo' })).unwrap()
        businessLogoUrl = result.url
      }

      let coverImageUrl: string | null = null
      if (flat.coverImage?.startsWith('data:')) {
        const file   = dataURLtoFile(flat.coverImage, 'cover-image.png')
        const result = await dispatch(uploadProjectImage({ file, field: 'coverImage' })).unwrap()
        coverImageUrl = result.url
      }

      const clean       = (v?: string) => v?.trim() ?? ''
      const nullIfEmpty = (v?: string) => (v?.trim() ? v.trim() : null)

      const cleanDomain = clean(flat.websiteDomain)
        .toLowerCase()
        .replace(/\.bookease\.in$/i, '')
        .replace(/[^a-z0-9-]/g, '')

      const payload: CreateProjectPayload = {
        businessDetails: {
          businessName:    clean(flat.businessName),
          businessType:    flat.businessType as CreateProjectPayload['businessDetails']['businessType'],
          contactEmail:    clean(flat.contactEmail).toLowerCase(),
          phoneNumber:     clean(flat.phoneNumber),
          businessAddress: clean(flat.businessAddress),
          city:            clean(flat.city),
          state:           clean(flat.state),
          country:         flat.country,
          googleMapsLink:  nullIfEmpty(flat.googleMapsLink),
        },
        websiteDetails: {
          websiteDomain: cleanDomain,
          businessLogo:  businessLogoUrl,
          tagline:       nullIfEmpty(flat.tagline),
          primaryColor:  clean(flat.primaryColor) || '#9B5CF6',
          coverImage:    coverImageUrl,
        },
        paymentDetails: {
          currency:           flat.currency           as CreateProjectPayload['paymentDetails']['currency'],
          paymentGateway:     flat.paymentGateway     as CreateProjectPayload['paymentDetails']['paymentGateway'],
          bankAccountDetails: clean(flat.bankAccountDetails),
          gstNumber:          nullIfEmpty(flat.gstNumber),
        },
      }

      await dispatch(createProject(payload)).unwrap()
    } catch (err: unknown) {
      setSubmitError((err as string) ?? 'Something went wrong. Please try again.')
    }
  }, [dispatch])

  // ── Delete handlers ───────────────────────────────────────────────────────────

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await dispatch(deleteProject(deleteTarget.id)).unwrap()
      // If deleted project was selected, reset to All Projects
      if (selectedProject === deleteTarget.name) {
        setSelectedProject('All Projects')
        dispatch(selectProject(null))
      }
    } catch {
      // error handled by slice
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleDeleteCancel = () => setDeleteTarget(null)

  // ── Misc helpers ──────────────────────────────────────────────────────────────

  const openModal = () => {
    setIsProjectClicked(false)
    setIsMobileMenuOpen(false)
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const handleSelect = (name: string) => {
    setSelectedProject(name)
    setIsProjectClicked(false)
    setIsMobileMenuOpen(false)
    setSearchTerm('')
    const found = projects.find((p) => p.businessDetails.businessName === name) ?? null
    dispatch(selectProject(found))
  }

  // ── Derived lists ─────────────────────────────────────────────────────────────

  const filteredDropdown = projects.filter((p) =>
    p.businessDetails.businessName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredProjects = projects.filter((p) =>
    selectedProject === 'All Projects'
      ? p.businessDetails.businessName.toLowerCase().includes(projectSearch.toLowerCase())
      : p.businessDetails.businessName === selectedProject
  )

  const isSubmitting  = createStatus === 'loading' || uploadStatus === 'loading'
  const isDeletingNow = deleteStatus === 'loading'

  // ══════════════════════════════════════════════════════════════════════════════
  // Render
  // ══════════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-[#0d0d14]">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <div className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-[#111118]/95 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent border-b border-white/7'
      }`}>
        <div className="relative flex items-center justify-between px-4 sm:px-6 h-16">

          {/* Desktop project dropdown */}
          <div className="hidden sm:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProjectClicked(!isProjectsClick)}
              className={`flex items-center gap-2.5 px-4 py-2 text-sm transition-all rounded-md ${
                isProjectsClick ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{selectedProject}</span>
              <ChevronsUpDown className="w-4 h-4" />
            </button>

            {isProjectsClick && (
              <div className="absolute left-0 mt-3 w-64 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl py-3 z-50">
                <div className="px-3 mb-3 relative">
                  <Search className="absolute left-5 top-2.5 w-4 h-4 text-white/40" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search project..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white/5 rounded-md text-white placeholder:text-white/40 focus:outline-none"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto pr-1">
                  <button
                    onClick={() => handleSelect('All Projects')}
                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    All Projects
                  </button>
                  {filteredDropdown.length > 0 ? (
                    filteredDropdown.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => handleSelect(p.businessDetails.businessName)}
                        className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {p.businessDetails.businessName}
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-white/40">No projects found</p>
                  )}
                </div>
                <div className="border-t border-white/10 my-2" />
                <div className="px-3">
                  <button
                    onClick={openModal}
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm bg-[#9B5CF6] text-white rounded-md hover:bg-[#8b4ce6] transition"
                  >
                    <Plus className="w-4 h-4" /> Create Project
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden text-white/70 hover:text-white p-1 rounded-md hover:bg-white/5 transition"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center title */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-white text-sm sm:text-md font-normal">Overview</h1>
          </div>

          <div className="w-8 sm:w-[150px]" />
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-white/8 bg-[#111118]/95 px-4 py-4 space-y-3">
            <p className="text-white/40 text-xs uppercase tracking-wider px-1">Filter by project</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
            <div className="space-y-0.5 max-h-48 overflow-y-auto">
              <button
                onClick={() => handleSelect('All Projects')}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedProject === 'All Projects' ? 'bg-[#9B5CF6]/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                All Projects
              </button>
              {filteredDropdown.map((p) => (
                <button
                  key={p._id}
                  onClick={() => handleSelect(p.businessDetails.businessName)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedProject === p.businessDetails.businessName ? 'bg-[#9B5CF6]/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.businessDetails.businessName}
                </button>
              ))}
            </div>
            <button
              onClick={openModal}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm bg-[#9B5CF6] text-white rounded-lg hover:bg-[#8b4ce6] transition"
            >
              <Plus className="w-4 h-4" /> Create Project
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="pt-24 px-4 sm:px-6 max-w-6xl mx-auto">

        {/* Search + Create row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-[#9B5CF6]/60 transition-all"
            />
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm bg-[#9B5CF6] text-white rounded-lg hover:bg-[#8b4ce6] transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create New Project</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Loading state */}
        {fetchStatus === 'loading' && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 text-[#9B5CF6] animate-spin" />
          </div>
        )}

        {/* Error state */}
        {fetchStatus === 'failed' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-400 text-sm">Failed to load projects. Please refresh.</p>
          </div>
        )}

        {/* Projects grid */}
        {fetchStatus === 'succeeded' && (
          filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => dispatch(selectProject(project))}
                  className="group relative p-5 bg-white/3 border border-white/8 rounded-xl hover:bg-white/6 hover:border-white/15 transition-all cursor-pointer"
                >
                  {/* ── Card Header ── */}
                  <div className="flex items-start justify-between mb-4">
                    {/* Logo or fallback icon */}
                    {project.websiteDetails.businessLogo ? (
                      <img
                        src={project.websiteDetails.businessLogo}
                        alt={project.businessDetails.businessName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="p-2 bg-[#9B5CF6]/15 rounded-lg">
                        <FolderOpen className="w-5 h-5 text-[#9B5CF6]" />
                      </div>
                    )}

                    {/* Right side: domain badge + three-dot menu */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-white/30 font-mono bg-white/5 px-2 py-1 rounded-md">
                        {project.websiteDetails.websiteDomain}.bookease.in
                      </span>

                      {/* ── Three-dot menu ── */}
                      <ProjectCardMenu
                        projectId={project._id}
                        projectName={project.businessDetails.businessName}
                        onDeleteClick={handleDeleteClick}
                      />
                    </div>
                  </div>

                  <h3 className="text-white text-sm font-medium mb-0.5">
                    {project.businessDetails.businessName}
                  </h3>
                  <p className="text-white/40 text-xs mb-3">
                    {project.businessDetails.businessType}
                  </p>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/6">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: project.websiteDetails.primaryColor ?? '#9B5CF6' }}
                    />
                    <span className="text-white/30 text-xs truncate">
                      {project.paymentDetails.paymentGateway} · {project.paymentDetails.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="p-4 bg-white/5 rounded-2xl mb-4">
                <FolderOpen className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/50 text-sm font-medium">No projects yet</p>
              <p className="text-white/25 text-xs mt-1">Create your first project to get started</p>
            </div>
          )
        )}
      </div>

      {/* ── Create Project Modal ────────────────────────────────────────────── */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSubmitError(null)
          dispatch(resetCreateStatus())
        }}
        onSubmit={handleModalSubmit}
        steps={MY_STEPS}
        title="Create New Project"
        description="Fill in the details to set up your project"
      />

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteConfirmModal
          projectName={deleteTarget.name}
          isDeleting={isDeletingNow}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}

      {/* ── Submit error toast ──────────────────────────────────────────────── */}
      {submitError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-sm shadow-xl">
          <span>{submitError}</span>
          <button onClick={() => setSubmitError(null)} className="text-red-400/60 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Global submitting overlay ───────────────────────────────────────── */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#9B5CF6] animate-spin" />
            <p className="text-white/60 text-sm">
              {uploadStatus === 'loading' ? 'Uploading images…' : 'Creating project…'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Page