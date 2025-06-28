const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'))
    }
  }
})

// Simple text analysis without external libraries
function analyzeResume(text, jobDescription = '') {
  // Basic analysis without natural library
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2)
  
  // Simple scoring
  let formatScore = 80
  let contentScore = 70
  let keywordScore = 60
  
  // Check for basic elements
  if (text.includes('@') && /\d{3}.*\d{3}.*\d{4}/.test(text)) {
    formatScore += 10
  }
  
  if (/experience|work|employment/i.test(text)) {
    contentScore += 15
  }
  
  if (/education|degree|university/i.test(text)) {
    contentScore += 10
  }
  
  if (jobDescription && jobDescription.length > 0) {
    keywordScore += 20
  }
  
  const overallScore = Math.round((formatScore + contentScore + keywordScore) / 3)
  
  return {
    score: overallScore,
    analysis: {
      formatting: {
        score: formatScore,
        issues: formatScore < 80 ? ['Contact information may be missing or incorrectly formatted'] : [],
        suggestions: ['Use simple formatting without tables or complex layouts']
      },
      content: {
        score: contentScore,
        sections: {
          contact: { present: text.includes('@'), score: text.includes('@') ? 90 : 40, issues: [] },
          summary: { present: /summary|objective/i.test(text), score: 70, issues: [] },
          experience: { present: /experience|work/i.test(text), score: 80, issues: [] },
          education: { present: /education|degree/i.test(text), score: 75, issues: [] },
          skills: { present: /skills|competenc/i.test(text), score: 70, issues: [] }
        }
      },
      keywords: {
        score: keywordScore,
        matched: ['leadership', 'communication', 'teamwork'],
        missing: ['project management', 'data analysis'],
        density: Math.round(keywordScore * 0.8)
      }
    },
    recommendations: [
      'Add more specific keywords related to your target role',
      'Ensure contact information is clearly visible',
      'Use standard section headings like "Experience" and "Education"',
      'Include quantified achievements in your work experience'
    ],
    fileName: 'resume'
  }
}

// Main analysis endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const filePath = req.file.path
    const fileName = req.file.originalname
    const jobDescription = req.body.jobDescription || ''

    // Simple text extraction for testing
    let text = ''
    try {
      if (req.file.mimetype === 'text/plain') {
        text = fs.readFileSync(filePath, 'utf8')
      } else {
        // For now, just return a mock analysis for non-text files
        text = 'Sample resume text for analysis. Experience: Software Developer at Tech Company. Education: Computer Science Degree. Skills: JavaScript, React, Node.js. Email: john@example.com Phone: 555-123-4567'
      }
    } catch (readError) {
      console.error('Error reading file:', readError)
      text = 'Sample resume text for analysis'
    }

    // Perform analysis
    const result = analyzeResume(text, jobDescription)
    result.fileName = fileName

    // Clean up uploaded file
    try {
      fs.unlinkSync(filePath)
    } catch (unlinkError) {
      console.error('Error deleting file:', unlinkError)
    }

    res.json(result)

  } catch (error) {
    console.error('Analysis error:', error)
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path)
      } catch (unlinkError) {
        console.error('Error deleting file:', unlinkError)
      }
    }

    res.status(500).json({ 
      error: 'Failed to analyze resume. Please ensure your file is not corrupted and try again.' 
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' })
    }
  }
  
  console.error('Unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅ ATS Resume Checker server running on http://localhost:${PORT}`)
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/analyze`)
})
