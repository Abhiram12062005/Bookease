import { Router } from 'express'
import multer from 'multer'
import { protect } from '../middleware/authMiddleware'
import { validateCreateProject, validateUpdateProject } from '../middleware/projectValidation'
import {
  uploadFile,
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController'

// ─── Multer (memory storage — buffer piped to S3 or saved locally) ────────────

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG, PNG and WEBP images are allowed'))
  },
})

const projectRouter = Router()

projectRouter.post('/upload', protect, upload.single('file'), uploadFile)


projectRouter
  .route('/')
  .post(protect, validateCreateProject, createProject)
  .get(protect, getProjects)

projectRouter
  .route('/:id')
  .get(protect, getProjectById)
  .patch(protect, validateUpdateProject, updateProject)
  .delete(protect, deleteProject)

export default projectRouter;