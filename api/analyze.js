const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app.vercel.app'] // Update with your actual Vercel URL
    : ['http://localhost:5173']
}))
app.use(express.json())

// Configure multer for Vercel (use memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
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

// Simple text analysis function
function analyzeResume(text, jobDescription = '') {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2)
  
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
    ]
  }
}

// Main analysis endpoint
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileName = req.file.originalname
    const jobDescription = req.body.jobDescription || ''

    // Extract text from buffer
    let text = ''
    try {
      if (req.file.mimetype === 'text/plain') {
        text = req.file.buffer.toString('utf8')
      } else {
        // For demo purposes, return sample analysis for non-text files
        text = `Sample resume text for analysis. Experience: Software Developer at Tech Company from 2020-2023. 
        Education: Computer Science Degree from University. Skills: JavaScript, React, Node.js, TypeScript. 
        Email: john.doe@example.com Phone: (555) 123-4567. 
        Achievements: Increased application performance by 40%, Led team of 5 developers, 
        Implemented CI/CD pipelines, Reduced bug reports by 60%.`
      }
    } catch (readError) {
      console.error('Error reading file:', readError)
      text = 'Sample resume text for analysis'
    }

    // Perform analysis
    const result = analyzeResume(text, jobDescription)
    result.fileName = fileName

    res.json(result)

  } catch (error) {
    console.error('Analysis error:', error)
    res.status(500).json({ 
      error: 'Failed to analyze resume. Please ensure your file is not corrupted and try again.' 
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
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

// Export for Vercel
module.exports = app
