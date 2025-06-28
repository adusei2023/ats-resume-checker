import { Link } from 'react-router-dom'
import { FileText, Shield, CheckCircle } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ATS Resume Checker</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link to="/analysis" className="text-gray-600 hover:text-primary-600 transition-colors">
              Check Resume
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <CheckCircle className="h-4 w-4" />
                <span>ATS Optimized</span>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
