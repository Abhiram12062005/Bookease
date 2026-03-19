import { Response } from 'express'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import Project from '../models/projectModel'
import type { AuthRequest } from '../middleware/authMiddleware'

// Helper: resolve owner ID from any JWT payload shape { id | _id | userId }
type AnyPayload = { id?: string; _id?: string; userId?: string } | undefined

const resolveOwnerId = (user: AnyPayload): string | undefined => {
  const id = user?.id ?? user?._id ?? user?.userId
  if (!id) {
    console.error('[resolveOwnerId] req.user has no id/_id/userId. Received:', JSON.stringify(user))
  }
  return id
}

// Local file save (swap for S3 in production)
const saveFile = async (file: Express.Multer.File): Promise<string> => {
  const fs  = await import('fs/promises')
  const dir = path.join(process.cwd(), 'public', 'uploads')

  // Ensure folder exists
  await fs.mkdir(dir, { recursive: true })

  // Validate buffer exists (will be empty if multer not configured correctly)
  if (!file.buffer || file.buffer.length === 0) {
    throw new Error('File buffer is empty — check multer memoryStorage is configured')
  }

  const ext      = path.extname(file.originalname) || '.png'
  const filename = `${uuidv4()}${ext}`
  await fs.writeFile(path.join(dir, filename), file.buffer)

  const base = process.env.API_BASE_URL ?? 'http://localhost:5000'
  return `${base}/uploads/${filename}`
}

// POST /api/projects/upload
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ ok: false, error: 'No file provided' })
      return
    }
    const url = await saveFile(req.file)
    res.status(200).json({ ok: true, url, key: path.basename(url), mimetype: req.file.mimetype, size: req.file.size })
  } catch (err) {
    console.error('[uploadFile]', err)
    res.status(500).json({ ok: false, error: 'File upload failed' })
  }
}

// POST /api/projects
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // === DEBUG BLOCK — check your server terminal after hitting this endpoint ===
    console.log('--- createProject DEBUG ---')
    console.log('req.user          :', JSON.stringify(req.user))
    console.log('req.body keys     :', Object.keys(req.body))
    console.log('businessDetails   :', JSON.stringify(req.body.businessDetails))
    console.log('websiteDetails    :', JSON.stringify(req.body.websiteDetails))
    console.log('paymentDetails    :', JSON.stringify(req.body.paymentDetails))
    console.log('---------------------------')

    const ownerId = resolveOwnerId(req.user as AnyPayload)
    if (!ownerId) {
      res.status(401).json({ ok: false, error: 'Could not resolve user ID from token. Check JWT payload shape.' })
      return
    }

    const { businessDetails, websiteDetails, paymentDetails } = req.body

    if (!businessDetails || !websiteDetails || !paymentDetails) {
      res.status(400).json({
        ok: false,
        error: 'Request body must contain businessDetails, websiteDetails and paymentDetails.',
        received: Object.keys(req.body),
      })
      return
    }

    const domainTaken = await Project.findOne({ 'websiteDetails.websiteDomain': websiteDetails.websiteDomain })
    if (domainTaken) {
      res.status(409).json({ ok: false, error: 'This domain is already taken. Please choose another.' })
      return
    }

    const project = await Project.create({ owner: ownerId, businessDetails, websiteDetails, paymentDetails })
    res.status(201).json({ ok: true, data: project })

  } catch (err: unknown) {
    const e = err as { name?: string; message?: string; code?: number; errors?: Record<string, { message: string }> }

    if (e.name === 'ValidationError') {
      // Log full error so you can see which fields failed
      console.error('[createProject] ValidationError:', JSON.stringify(e.errors ?? e.message))

      const fields = e.errors
        ? Object.entries(e.errors).map(([field, ve]) => ({ field, message: ve.message }))
        : [{ field: 'unknown', message: e.message }]

      res.status(422).json({ ok: false, error: 'Validation failed', fields })
      return
    }

    if (e.code === 11000) {
      res.status(409).json({ ok: false, error: 'Domain already taken' })
      return
    }

    console.error('[createProject] Unexpected error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}

// GET /api/projects
export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = resolveOwnerId(req.user as AnyPayload)
    if (!ownerId) { res.status(401).json({ ok: false, error: 'Could not resolve user ID from token' }); return }

    const projects = await Project.find({ owner: ownerId }).sort({ createdAt: -1 }).lean()
    res.status(200).json({ ok: true, data: projects })
  } catch (err) {
    console.error('[getProjects]', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}

// GET /api/projects/:id
export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = resolveOwnerId(req.user as AnyPayload)
    if (!ownerId) { res.status(401).json({ ok: false, error: 'Could not resolve user ID from token' }); return }

    const project = await Project.findOne({ _id: req.params.id, owner: ownerId }).lean()
    if (!project) { res.status(404).json({ ok: false, error: 'Project not found' }); return }

    res.status(200).json({ ok: true, data: project })
  } catch (err) {
    console.error('[getProjectById]', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}
 
// PATCH /api/projects/:id
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = resolveOwnerId(req.user as AnyPayload)
    if (!ownerId) { res.status(401).json({ ok: false, error: 'Could not resolve user ID from token' }); return }

    delete req.body.owner

    const setPayload: Record<string, unknown> = {}
    const sections = ['businessDetails', 'websiteDetails', 'paymentDetails'] as const
    for (const section of sections) {
      const data = req.body[section] as Record<string, unknown> | undefined
      if (data && typeof data === 'object') {
        for (const [key, value] of Object.entries(data)) {
          setPayload[`${section}.${key}`] = value
        }
      }
    }

    const newDomain = (req.body.websiteDetails as Record<string, string> | undefined)?.websiteDomain
    if (newDomain) {
      const conflict = await Project.findOne({ 'websiteDetails.websiteDomain': newDomain, _id: { $ne: req.params.id } })
      if (conflict) {
        res.status(409).json({ ok: false, error: 'This domain is already taken. Please choose another.' })
        return
      }
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: ownerId },
      { $set: setPayload },
      { new: true, runValidators: true }
    ).lean()

    if (!project) { res.status(404).json({ ok: false, error: 'Project not found or not authorised' }); return }
    res.status(200).json({ ok: true, data: project })
  } catch (err: unknown) {
    const e = err as { name?: string; message?: string }
    if (e.name === 'ValidationError') { res.status(422).json({ ok: false, error: e.message }); return }
    console.error('[updateProject]', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}

// DELETE /api/projects/:id
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = resolveOwnerId(req.user as AnyPayload)
    if (!ownerId) { res.status(401).json({ ok: false, error: 'Could not resolve user ID from token' }); return }

    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: ownerId })
    if (!project) { res.status(404).json({ ok: false, error: 'Project not found or not authorised' }); return }

    res.status(200).json({ ok: true, message: 'Project deleted', _id: req.params.id })
  } catch (err) {
    console.error('[deleteProject]', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
}