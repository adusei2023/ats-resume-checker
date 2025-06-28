import { Link } from 'react-router-dom'
import { 
  Upload, 
  CheckCircle, 
  FileText, 
  TrendingUp, 
  Shield, 
  Zap,
  Users,
  Star
} from 'lucide-react'

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Beat the ATS,<br />
              <span className="text-primary-200">Land Your Dream Job</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Get instant feedback on your resume's ATS compatibility. 
              Our AI-powered analyzer helps you optimize your resume for maximum visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/analysis" className="btn-primary bg-white text-primary-600 hover:bg-gray-50">
                <Upload className="h-5 w-5 mr-2" />
                Check My Resume
              </Link>
              <button className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="card">
              <div className="text-3xl font-bold text-primary-600 mb-2">500K+</div>
              <div className="text-gray-600">Resumes Analyzed</div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-success-600 mb-2">85%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-warning-600 mb-2">30s</div>
              <div className="text-gray-600">Average Analysis Time</div>
            </div>
            <div className="card">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get professional resume analysis in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Upload Resume</h3>
              <p className="text-gray-600">
                Upload your resume in PDF, DOC, or DOCX format. Our secure system 
                processes your file instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your resume for ATS compatibility, 
                keywords, formatting, and content structure.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Get Report</h3>
              <p className="text-gray-600">
                Receive a detailed report with your ATS score and actionable 
                recommendations to improve your resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to optimize your resume for ATS systems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card">
              <div className="bg-success-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ATS Score</h3>
              <p className="text-gray-600">
                Get an overall compatibility score with detailed breakdown of what works and what doesn't.
              </p>
            </div>

            <div className="card">
              <div className="bg-primary-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Keyword Analysis</h3>
              <p className="text-gray-600">
                Compare your resume against job descriptions and identify missing keywords.
              </p>
            </div>

            <div className="card">
              <div className="bg-warning-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-warning-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Format Check</h3>
              <p className="text-gray-600">
                Identify formatting issues that could prevent ATS systems from reading your resume.
              </p>
            </div>

            <div className="card">
              <div className="bg-error-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-error-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get your analysis results in under 30 seconds with actionable recommendations.
              </p>
            </div>

            <div className="card">
              <div className="bg-primary-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Industry Insights</h3>
              <p className="text-gray-600">
                Get recommendations based on your specific industry and job role.
              </p>
            </div>

            <div className="card">
              <div className="bg-success-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-success-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
              <p className="text-gray-600">
                Learn from successful resumes and apply proven strategies to yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of job seekers who have improved their resume with our ATS checker.
          </p>
          <Link to="/analysis" className="btn-primary bg-white text-primary-600 hover:bg-gray-50">
            <Upload className="h-5 w-5 mr-2" />
            Start Free Analysis
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
