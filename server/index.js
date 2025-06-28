const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const natural = require('natural')

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

// ATS Keywords database
const commonATSKeywords = [
  'leadership', 'management', 'teamwork', 'communication', 'problem-solving',
  'analytical', 'strategic', 'innovative', 'collaborative', 'detail-oriented',
  'results-driven', 'customer service', 'project management', 'data analysis',
  'software development', 'marketing', 'sales', 'finance', 'operations',
  'quality assurance', 'process improvement', 'training', 'budget management'
]

// Text extraction functions
async function extractTextFromFile(filePath, mimetype) {
  try {
    switch (mimetype) {
      case 'application/pdf':
        const pdfBuffer = fs.readFileSync(filePath)
        const pdfData = await pdfParse(pdfBuffer)
        return pdfData.text
      
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ path: filePath })
        return docxResult.value
      
      case 'application/msword':
        // For .doc files, we'll use a simplified approach
        const docBuffer = fs.readFileSync(filePath)
        return docBuffer.toString('utf8').replace(/[^\x20-\x7E]/g, ' ')
      
      case 'text/plain':
        return fs.readFileSync(filePath, 'utf8')
      
      default:
        throw new Error('Unsupported file type')
    }
  } catch (error) {
    console.error('Error extracting text:', error)
    throw error
  }
}

// Resume analysis functions
function analyzeFormatting(text, filePath) {
  const issues = []
  const suggestions = []
  let score = 100

  // Check for common formatting issues
  if (text.includes('|') || text.includes('┌') || text.includes('─')) {
    issues.push('Contains table formatting that may not parse correctly in ATS')
    score -= 15
  }

  if (text.length < 200) {
    issues.push('Resume appears to be very short or text extraction failed')
    score -= 25
  }

  if (!/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
    issues.push('Phone number not found or incorrectly formatted')
    score -= 10
  }

  if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    issues.push('Email address not found or incorrectly formatted')
    score -= 10
  }

  // Suggestions
  if (issues.length === 0) {
    suggestions.push('Great! Your resume formatting appears to be ATS-friendly')
  } else {
    suggestions.push('Use simple formatting without tables, text boxes, or graphics')
    suggestions.push('Ensure contact information is clearly visible at the top')
    suggestions.push('Use standard fonts like Arial, Calibri, or Times New Roman')
  }

  return {
    score: Math.max(0, score),
    issues,
    suggestions
  }
}

function analyzeContent(text) {
  const sections = {
    contact: { present: false, score: 0, issues: [] },
    summary: { present: false, score: 0, issues: [] },
    experience: { present: false, score: 0, issues: [] },
    education: { present: false, score: 0, issues: [] },
    skills: { present: false, score: 0, issues: [] }
  }

  let overallScore = 0

  // Check for contact information
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text) && 
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) {
    sections.contact.present = true
    sections.contact.score = 90
  } else {
    sections.contact.issues.push('Missing or incorrectly formatted contact information')
    sections.contact.score = 20
  }

  // Check for summary/objective
  if (/summary|objective|profile/i.test(text)) {
    sections.summary.present = true
    sections.summary.score = 85
  } else {
    sections.summary.issues.push('Missing professional summary or objective')
    sections.summary.score = 30
  }

  // Check for experience section
  if (/experience|employment|work history/i.test(text)) {
    sections.experience.present = true
    sections.experience.score = 90
    
    // Check for dates and achievements
    if (!/\b20\d{2}\b/.test(text)) {
      sections.experience.issues.push('Missing or unclear employment dates')
      sections.experience.score -= 20
    }
    
    if (!/achieved|improved|increased|decreased|managed|led|developed/i.test(text)) {
      sections.experience.issues.push('Consider adding more action verbs and quantified achievements')
      sections.experience.score -= 15
    }
  } else {
    sections.experience.issues.push('Missing work experience section')
    sections.experience.score = 10
  }

  // Check for education
  if (/education|degree|university|college|school/i.test(text)) {
    sections.education.present = true
    sections.education.score = 80
  } else {
    sections.education.issues.push('Missing education section')
    sections.education.score = 40
  }

  // Check for skills
  if (/skills|competencies|proficiencies/i.test(text)) {
    sections.skills.present = true
    sections.skills.score = 85
  } else {
    sections.skills.issues.push('Missing skills section')
    sections.skills.score = 30
  }

  // Calculate overall content score
  overallScore = Object.values(sections).reduce((sum, section) => sum + section.score, 0) / 5

  return {
    score: Math.round(overallScore),
    sections
  }
}

function analyzeKeywords(text, jobDescription = '') {
  const textWords = natural.WordTokenizer().tokenize(text.toLowerCase())
  const stopWords = natural.stopwords
  const filteredWords = textWords.filter(word => 
    !stopWords.includes(word) && 
    word.length > 2 && 
    /^[a-zA-Z]+$/.test(word)
  )

  let targetKeywords = [...commonATSKeywords]
  
  // If job description is provided, extract keywords from it
  if (jobDescription) {
    const jobWords = natural.WordTokenizer().tokenize(jobDescription.toLowerCase())
    const jobKeywords = jobWords.filter(word => 
      !stopWords.includes(word) && 
      word.length > 3 && 
      /^[a-zA-Z]+$/.test(word)
    )
    
    // Get most frequent words from job description
    const wordFreq = {}
    jobKeywords.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1
    })
    
    const sortedJobKeywords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word)
    
    targetKeywords = [...new Set([...targetKeywords, ...sortedJobKeywords])]
  }

  const matched = []
  const missing = []

  targetKeywords.forEach(keyword => {
    if (filteredWords.includes(keyword.toLowerCase())) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  })

  const keywordDensity = (matched.length / Math.max(targetKeywords.length, 1)) * 100
  let score = Math.round(keywordDensity)

  // Boost score if many relevant keywords are found
  if (matched.length >= 10) score += 10
  if (matched.length >= 15) score += 10

  return {
    score: Math.min(100, score),
    matched: matched.slice(0, 15), // Limit for display
    missing: missing.slice(0, 10), // Limit for display
    density: Math.round(keywordDensity)
  }
}

function generateRecommendations(analysis) {
  const recommendations = []
  
  // Formatting recommendations
  if (analysis.formatting.score < 80) {
    recommendations.push('Simplify your resume formatting - avoid tables, text boxes, and complex layouts')
    recommendations.push('Use standard fonts (Arial, Calibri, Times New Roman) and simple bullet points')
  }
  
  // Content recommendations
  if (!analysis.content.sections.summary.present) {
    recommendations.push('Add a professional summary at the top to immediately highlight your value proposition')
  }
  
  if (analysis.content.sections.experience.score < 80) {
    recommendations.push('Include more quantified achievements in your work experience (e.g., "Increased sales by 25%")')
    recommendations.push('Use strong action verbs to start each bullet point (achieved, managed, developed, improved)')
  }
  
  // Keyword recommendations
  if (analysis.keywords.score < 60) {
    recommendations.push('Include more relevant keywords throughout your resume, especially in skills and experience sections')
    recommendations.push('Tailor your resume to include keywords from the specific job posting')
  }
  
  // General recommendations
  recommendations.push('Save your resume as a PDF to preserve formatting across different systems')
  recommendations.push('Ensure all contact information is up-to-date and professional')
  
  return recommendations
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

    // Extract text from the uploaded file
    const text = await extractTextFromFile(filePath, req.file.mimetype)
    
    if (!text || text.length < 50) {
      throw new Error('Unable to extract sufficient text from the file')
    }

    // Perform analysis
    const formatting = analyzeFormatting(text, filePath)
    const content = analyzeContent(text)
    const keywords = analyzeKeywords(text, jobDescription)

    // Calculate overall score
    const overallScore = Math.round((formatting.score + content.score + keywords.score) / 3)

    const analysis = {
      formatting,
      content,
      keywords
    }

    const recommendations = generateRecommendations(analysis)

    // Clean up uploaded file
    fs.unlinkSync(filePath)

    res.json({
      score: overallScore,
      analysis,
      recommendations,
      fileName
    })

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
  console.log(`ATS Resume Checker server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
