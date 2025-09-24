const multer = require('multer')
const path = require('path')
const sharp = require('sharp')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs').promises

// Configure multer for file uploads
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  }
})

// Process and save uploaded images
const processImage = async (file, options = {}) => {
  try {
    const {
      width = 800,
      height = 600,
      quality = 80,
      format = 'jpeg'
    } = options

    const filename = `${uuidv4()}.${format}`
    const uploadDir = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads')
    const filePath = path.join(uploadDir, filename)

    // Ensure upload directory exists
    try {
      await fs.access(uploadDir)
    } catch {
      await fs.mkdir(uploadDir, { recursive: true })
    }

    // Process image with Sharp
    await sharp(file.buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toFile(filePath)

    return {
      filename,
      path: filePath,
      url: `/uploads/${filename}`,
      size: file.size,
      mimetype: `image/${format}`
    }
  } catch (error) {
    console.error('Image processing error:', error)
    throw new Error('Failed to process image')
  }
}

// Middleware for single file upload
const uploadSingle = (fieldName) => {
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      try {
        if (req.file) {
          const processedFile = await processImage(req.file)
          req.file = { ...req.file, ...processedFile }
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  ]
}

// Middleware for multiple file upload
const uploadMultiple = (fieldName, maxCount = 5) => {
  return [
    upload.array(fieldName, maxCount),
    async (req, res, next) => {
      try {
        if (req.files && req.files.length > 0) {
          const processedFiles = await Promise.all(
            req.files.map(file => processImage(file))
          )
          req.files = req.files.map((file, index) => ({
            ...file,
            ...processedFiles[index]
          }))
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  ]
}

// Middleware for fields with files
const uploadFields = (fields) => {
  return [
    upload.fields(fields),
    async (req, res, next) => {
      try {
        if (req.files) {
          for (const fieldName of Object.keys(req.files)) {
            const processedFiles = await Promise.all(
              req.files[fieldName].map(file => processImage(file))
            )
            req.files[fieldName] = req.files[fieldName].map((file, index) => ({
              ...file,
              ...processedFiles[index]
            }))
          }
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  ]
}

// Delete uploaded file
const deleteFile = async (filename) => {
  try {
    const filePath = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads', filename)
    await fs.unlink(filePath)
    return true
  } catch (error) {
    console.error('File deletion error:', error)
    return false
  }
}

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  processImage,
  deleteFile
}
