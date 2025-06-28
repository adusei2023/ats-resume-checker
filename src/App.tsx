import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AnalysisPage from './pages/AnalysisPage'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
