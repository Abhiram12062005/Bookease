'use client'

import { useState, useRef } from 'react'
import {
  X, ArrowRight, ArrowLeft, Check, Search,
  ChevronDown, Upload, Image as ImageIcon, File, Phone, Mail, Type
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FieldType =
  | 'text'
  | 'color'
  | 'email'
  | 'phone'
  | 'dropdown'
  | 'image-upload'
  | 'file-upload'
  | 'text-with-suffix'

export interface FieldConfig {
  key: string
  label: string
  placeholder?: string
  type?: FieldType
  options?: string[]
  suffix?: string
  accept?: string
}

export interface StepConfig {
  id: number
  label: string
  fields: FieldConfig[]
}

export interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: Record<string, string>) => void
  steps: StepConfig[]
  title?: string
  description?: string
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const baseInput =
  'w-full px-3 py-2.5 text-sm bg-white/5 border rounded-lg text-white placeholder:text-white/25 focus:outline-none transition-all'
const errorBorder  = 'border-red-500/60 focus:border-red-500'
const normalBorder = 'border-white/10 focus:border-[#9B5CF6]/60'

interface FieldProps {
  field: FieldConfig
  value: string
  error?: string
  onChange: (key: string, value: string) => void
}

// ─── Field Renderers ──────────────────────────────────────────────────────────

const TextField = ({ field, value, error, onChange }: FieldProps) => {
  const { key, label, placeholder, type = 'text' } = field
  const iconMap: Record<string, React.ReactNode> = {
    email: <Mail  className="w-3.5 h-3.5 text-white/30" />,
    phone: <Phone className="w-3.5 h-3.5 text-white/30" />,
    text:  <Type  className="w-3.5 h-3.5 text-white/30" />,
  }
  const inputType = type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium flex items-center gap-1.5">
        {iconMap[type] ?? iconMap.text}
        {label}
      </label>
      <input
        type={inputType}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        value={value ?? ''}
        onChange={(e) => onChange(key, e.target.value)}
        className={`${baseInput} ${error ? errorBorder : normalBorder}`}
      />
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

const TextWithSuffixField = ({ field, value, error, onChange }: FieldProps) => {
  const { key, label, placeholder, suffix = '' } = field
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium">{label}</label>
      <div className={`flex items-center bg-white/5 border rounded-lg overflow-hidden transition-all ${error ? errorBorder : normalBorder}`}>
        <input
          type="text"
          placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
          value={value ?? ''}
          onChange={(e) => onChange(key, e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent text-white placeholder:text-white/25 focus:outline-none"
        />
        <span className="px-3 py-2.5 text-sm text-white/40 bg-white/5 border-l border-white/10 whitespace-nowrap shrink-0 select-none">
          {suffix}
        </span>
      </div>
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

const DropdownField = ({ field, value, error, onChange }: FieldProps) => {
  const { key, label, placeholder, options = [] } = field
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState('')
  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))

  const handleSelect = (opt: string) => {
    onChange(key, opt)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-white/60 text-xs font-medium">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between px-3 py-2.5 text-sm bg-white/5 border rounded-lg transition-all text-left ${
          error ? errorBorder : open ? 'border-[#9B5CF6]/60' : normalBorder
        }`}
      >
        <span className={value ? 'text-white' : 'text-white/25'}>
          {value || placeholder || `Select ${label.toLowerCase()}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a28] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          {options.length > 5 && (
            <div className="p-2 border-b border-white/8">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 rounded-md text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>
          )}
          <div className="max-h-44 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${
                    value === opt
                      ? 'bg-[#9B5CF6]/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt}
                  {value === opt && <Check className="w-3.5 h-3.5 text-[#9B5CF6]" />}
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-white/40">No results</p>
            )}
          </div>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

const ImageUploadField = ({ field, value, error, onChange }: FieldProps) => {
  const { key, label, accept = 'image/*' } = field
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(key, reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 w-full h-28 bg-white/3 border-2 border-dashed rounded-xl transition-all hover:bg-white/5 hover:border-[#9B5CF6]/50 group ${
          error ? 'border-red-500/50' : value ? 'border-[#9B5CF6]/40' : 'border-white/15'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-40" />
            <div className="relative z-10 flex flex-col items-center gap-1">
              <ImageIcon className="w-5 h-5 text-[#9B5CF6]" />
              <span className="text-xs text-white/60">Click to change</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-[#9B5CF6]/10 transition-colors">
              <ImageIcon className="w-5 h-5 text-white/30 group-hover:text-[#9B5CF6] transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-xs text-white/50">Click to upload image</p>
              <p className="text-[10px] text-white/25 mt-0.5">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </>
        )}
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

const FileUploadField = ({ field, value, error, onChange }: FieldProps) => {
  const { key, label, accept } = field
  const inputRef              = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    onChange(key, file.name)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium">{label}</label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex items-center gap-3 px-3 py-2.5 bg-white/5 border rounded-lg transition-all hover:bg-white/8 hover:border-[#9B5CF6]/40 ${
          error ? errorBorder : value ? 'border-[#9B5CF6]/40' : normalBorder
        }`}
      >
        <div className={`p-1.5 rounded-md transition-colors ${value ? 'bg-[#9B5CF6]/15' : 'bg-white/5'}`}>
          <File className={`w-4 h-4 ${value ? 'text-[#9B5CF6]' : 'text-white/30'}`} />
        </div>
        <div className="flex-1 text-left">
          <p className={`text-sm ${value ? 'text-white' : 'text-white/30'}`}>
            {fileName || 'Choose file…'}
          </p>
          {fileName && <p className="text-[10px] text-white/30 mt-0.5">Click to replace</p>}
        </div>
        <Upload className="w-4 h-4 text-white/25 shrink-0" />
      </button>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFile} />
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

const ColorField = ({ field, value, error, onChange }: FieldProps) => {
  const { key, label, placeholder } = field
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-medium">{label}</label>
      <div className={`flex items-center gap-3 px-3 py-2 bg-white/5 border rounded-lg transition-all ${error ? errorBorder : normalBorder}`}>
        <input
          type="color"
          value={value || '#9B5CF6'}
          onChange={(e) => onChange(key, e.target.value)}
          className="w-8 h-8 rounded-md cursor-pointer bg-transparent border-0 outline-none p-0"
        />
        <span className="text-sm text-white/60 font-mono">{value || placeholder || '#9B5CF6'}</span>
      </div>
      {error && <p className="text-red-400 text-xs mt-0.5">{error}</p>}
    </div>
  )
}

// ─── Field Router ─────────────────────────────────────────────────────────────

const FieldRenderer = (props: FieldProps) => {
  const type = props.field.type ?? 'text'
  switch (type) {
    case 'email':
    case 'phone':
    case 'text':             return <TextField {...props} />
    case 'text-with-suffix': return <TextWithSuffixField {...props} />
    case 'dropdown':         return <DropdownField {...props} />
    case 'image-upload':     return <ImageUploadField {...props} />
    case 'color':            return <ColorField {...props} />
    case 'file-upload':      return <FileUploadField {...props} />
    default:                 return <TextField {...props} />
  }
}

// ─── Modal ────────────────────────────────────────────────────────────────────

const CreateProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  steps,
  title       = 'Create New Project',
  description = 'Fill in the details to get started',
}: CreateProjectModalProps) => {
  const [currentStep,  setCurrentStep]  = useState(1)
  const [completed,    setCompleted]    = useState<number[]>([])
  const [formData,     setFormData]     = useState<Record<string, string>>({})
  const [errors,       setErrors]       = useState<Record<string, string>>({})
  const [apiError,     setApiError]     = useState<string | null>(null)

  if (!isOpen) return null

  const currentStepData = steps.find((s) => s.id === currentStep)!

  // ── Client-side validation (required fields only) ─────────────────────────

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    currentStepData.fields.forEach(({ key, type }) => {
      const isOptional = type === 'image-upload' || type === 'file-upload'
      if (!isOptional && !formData[key]?.trim()) {
        newErrors[key] = 'This field is required'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    setCompleted((prev) => [...new Set([...prev, currentStep])])
    setCurrentStep((s) => s + 1)
    setErrors({})
    setApiError(null)
  }

  const handleBack = () => {
    setCurrentStep((s) => s - 1)
    setErrors({})
    setApiError(null)
  }

  // ✅ FIXED: removed handleClose() — parent closes modal on createStatus === 'succeeded'
  const handleSubmit = () => {
    if (!validate()) return
    setCompleted((prev) => [...new Set([...prev, currentStep])])
    onSubmit?.(formData)
  }

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e })
    if (apiError)    setApiError(null)
  }

  const handleClose = () => {
    setCurrentStep(1)
    setCompleted([])
    setFormData({})
    setErrors({})
    setApiError(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      // ✅ FIXED: removed onClick outside-click handler — modal only closes via X button
    >
      <div className="relative w-full max-w-2xl bg-[#13131e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/8 shrink-0">
          <div>
            <h2 className="text-white text-base font-medium">{title}</h2>
            <p className="text-white/40 text-xs mt-0.5">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-white/40 hover:text-white hover:bg-white/8 rounded-full transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper */}
        {steps.length > 1 && (
          <div className="px-8 py-6 border-b border-white/8 shrink-0">
            <div className="flex items-center">
              {steps.map((step, index) => {
                const isCompleted = completed.includes(step.id)
                const isActive    = currentStep === step.id
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`relative w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#9B5CF6] border-[#9B5CF6]'
                          : isActive
                            ? 'bg-transparent border-[#9B5CF6]'
                            : 'bg-transparent border-white/20'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        ) : (
                          <span className={`text-xs font-semibold ${isActive ? 'text-[#9B5CF6]' : 'text-white/30'}`}>
                            {step.id}
                          </span>
                        )}
                        {isActive && (
                          <span className="absolute inset-0 rounded-full border-2 border-[#9B5CF6]/30 scale-[1.4]" />
                        )}
                      </div>
                      <span className={`text-[11px] font-medium transition-colors whitespace-nowrap ${
                        isCompleted ? 'text-[#9B5CF6]' : isActive ? 'text-white' : 'text-white/30'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-2 mb-5">
                        <div className="relative h-px bg-white/10 overflow-visible">
                          <div
                            className="absolute inset-y-0 left-0 bg-[#9B5CF6] transition-all duration-500"
                            style={{ width: isCompleted ? '100%' : '0%' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentStepData.fields.map((field) => (
              <FieldRenderer
                key={field.key}
                field={field}
                value={formData[field.key] ?? ''}
                error={errors[field.key]}
                onChange={handleChange}
              />
            ))}
          </div>

          {/* ✅ NEW: API / backend validation error banner inside the modal */}
          {apiError && (
            <div className="mt-4 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/25 rounded-xl">
              <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-red-400 text-xs leading-relaxed">{apiError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 flex items-center justify-between shrink-0">
          <p className="text-white/25 text-xs">Step {currentStep} of {steps.length}</p>
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            )}
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#9B5CF6] text-white rounded-lg hover:bg-[#9B5CF6]/75 transition"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#9B5CF6] text-white rounded-lg hover:bg-[#9B5CF6]/75 transition"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Submit
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CreateProjectModal