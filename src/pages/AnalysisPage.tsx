import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import axios from 'axios'

interface AnalysisResult {
  score: number
  analysis: {
    formatting: any
    content: any
    keywords: any
    sections: any
  }
  recommendations: string[]
  fileName: string
}

const AnalysisPage = () => {
  const navigate = useNavigate()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription)
      }

      const response = await axios.post<AnalysisResult>('/api/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Store results in sessionStorage and navigate to report
      sessionStorage.setItem('analysisResult', JSON.stringify(response.data))
      navigate('/report')
    } catch (err) {
      setError('Failed to analyze resume. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }, [jobDescription, navigate])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: isAnalyzing
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ATS Resume Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume to get instant feedback on ATS compatibility and optimization suggestions
          </p>
        </div>

        {/* Job Description Input */}
        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Job Description (Optional)
          </h2>
          <p className="text-gray-600 mb-4">
            Paste the job description to get more targeted keyword analysis and recommendations.
          </p>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for better keyword matching..."
            className="input-field min-h-[120px] resize-y"
            disabled={isAnalyzing}
          />
        </div>

        {/* File Upload Area */}
        <div className="card">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              isDragActive && !isDragReject
                ? 'border-primary-400 bg-primary-50'
                : isDragReject
                ? 'border-error-400 bg-error-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            } ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <Loader className="h-12 w-12 text-primary-600 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Analyzing Your Resume...
                </h3>
                <p className="text-gray-600">
                  This usually takes 10-30 seconds
                </p>
              </div>
            ) : isDragActive ? (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Drop your resume here
                </h3>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your resume here, or click to browse
                </p>
                <button className="btn-primary" disabled={isAnalyzing}>
                  Choose File
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-error-600 mr-2" />
              <span className="text-error-700">{error}</span>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-success-600 mr-2" />
              Supported formats: PDF, DOC, DOCX, TXT
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-success-600 mr-2" />
              Maximum file size: 5MB
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-success-600 mr-2" />
              Secure processing - files deleted after analysis
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-success-600 mr-2" />
              Results ready in under 30 seconds
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📄 What We Analyze
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• ATS compatibility and parsing ability</li>
              <li>• Keyword density and relevance</li>
              <li>• Formatting and structure issues</li>
              <li>• Section completeness and organization</li>
              <li>• Contact information validation</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              💡 Tips for Best Results
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Use standard section headings</li>
              <li>• Avoid images, tables, and complex formatting</li>
              <li>• Include relevant keywords from job postings</li>
              <li>• Use common fonts (Arial, Calibri, Times)</li>
              <li>• Save as PDF for best compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage
