import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">ATS Resume Checker</h3>
            <p className="text-gray-300 mb-4">
              Optimize your resume for Applicant Tracking Systems and increase your chances 
              of landing your dream job. Get instant feedback and actionable recommendations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-300">
              <li>ATS Compatibility Check</li>
              <li>Keyword Analysis</li>
              <li>Format Optimization</li>
              <li>Detailed Reports</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>How it Works</li>
              <li>Best Practices</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 ATS Resume Checker. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
