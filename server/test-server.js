const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'ATS Resume Checker API is running'
  })
})

// Simple test endpoint
app.post('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    received: req.body
  })
})

app.listen(PORT, () => {
  console.log(`✅ ATS Resume Checker server running on http://localhost:${PORT}`)
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/analyze`)
})
