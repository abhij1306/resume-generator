import { useState, useRef } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import { Download, FileText, Upload, FileJson, X, FileUp, User, Briefcase, GraduationCap, Award, FolderOpen, Plus, Save, Share2, Sparkles } from 'lucide-react'
import { generateLatexStylePDF } from './utils/pdfGenerator'
import { extractResumeFromFile } from './utils/resumeParser'

function App() {
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: {
      technical: [],
      soft: []
    },
    certifications: [],
    projects: []
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [isImportingLinkedIn, setIsImportingLinkedIn] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const fileInputRef = useRef(null)
  const resumeFileInputRef = useRef(null)

  // Check if required fields are filled
  const isFormValid = () => {
    return (
      resumeData.personal.fullName.trim() !== '' &&
      resumeData.personal.email.trim() !== '' &&
      resumeData.personal.phone.trim() !== ''
    )
  }

  const steps = [
    { icon: User, label: 'Personal', key: 'personal' },
    { icon: Briefcase, label: 'Experience', key: 'experience' },
    { icon: GraduationCap, label: 'Education', key: 'education' },
    { icon: Award, label: 'Skills', key: 'skills' },
    { icon: FolderOpen, label: 'Projects', key: 'projects' }
  ]

  const handleLinkedInImport = async () => {
    if (!linkedinUrl.trim()) {
      alert('Please enter a LinkedIn profile URL')
      return
    }

    if (!linkedinUrl.includes('linkedin.com/in/')) {
      alert('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)')
      return
    }

    setIsImportingLinkedIn(true)
    try {
      alert('LinkedIn import feature requires LinkedIn API integration.\\n\\nFor now, please:\\n1. Copy your LinkedIn profile information\\n2. Manually fill in the form fields\\n\\nOr use the resume file upload option to parse your existing resume.')
    } catch (error) {
      alert(`Error importing from LinkedIn: ${error.message}`)
    } finally {
      setIsImportingLinkedIn(false)
    }
  }

  const handleResumeFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsParsingResume(true)
      try {
        const extractedData = await extractResumeFromFile(file)
        setResumeData(extractedData)
        setShowImportModal(false)
        alert('Resume parsed successfully! Please review and edit the extracted information.')
      } catch (error) {
        alert(`Error parsing resume: ${error.message}`)
      } finally {
        setIsParsingResume(false)
        if (resumeFileInputRef.current) {
          resumeFileInputRef.current.value = ''
        }
      }
    }
  }

  const handleImportFile = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          setResumeData(data)
          setShowImportModal(false)
          alert('Resume imported successfully!')
        } catch (error) {
          alert('Invalid JSON file. Please check the format and try again.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleImportJSON = () => {
    try {
      const data = JSON.parse(jsonInput)
      setResumeData(data)
      setShowImportModal(false)
      setJsonInput('')
      alert('Resume imported successfully!')
    } catch (error) {
      alert('Invalid JSON format. Please check and try again.')
    }
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resumeData.personal.fullName || 'resume'}_data.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPDF = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields:\\n- Full Name\\n- Email\\n- Phone Number')
      return
    }

    setIsGenerating(true)
    try {
      const pdf = generateLatexStylePDF(resumeData)
      pdf.save(`${resumeData.personal.fullName || 'resume'}_ATS.pdf`)
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Form Section */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Bar */}
          <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">Resume Builder</h1>
                    <p className="text-sm text-gray-500">Create a professional resume in minutes</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Progress</div>
                    <div className="text-lg font-semibold">{currentStep + 1}/5</div>
                  </div>
                  <div className="w-48 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  {/* Section Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {steps[currentStep].label} Information
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentStep === 0 && 'Include your full name and multiple ways for employers to reach you.'}
                      {currentStep === 1 && 'Add your work experience and achievements.'}
                      {currentStep === 2 && 'List your educational background.'}
                      {currentStep === 3 && 'Highlight your technical and soft skills.'}
                      {currentStep === 4 && 'Showcase your projects and certifications.'}
                    </p>
                  </div>

                  {/* Form */}
                  <div className="p-6">
                    <ResumeForm
                      resumeData={resumeData}
                      setResumeData={setResumeData}
                      currentStep={currentStep}
                      setCurrentStep={setCurrentStep}
                      steps={steps}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="lg:col-span-1">
                <div className="space-y-4">
                  {/* Validation Warning */}
                  {!isFormValid() && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-yellow-600 mt-0.5">⚠️</div>
                        <div>
                          <p className="font-semibold text-yellow-900">Required Fields Missing</p>
                          <p className="text-sm text-yellow-800">Please fill in: Full Name, Email, Phone Number</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Success Message */}
                  {showSuccessMessage && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
                      <div className="flex items-start gap-3">
                        <div className="text-green-600 mt-0.5">✅</div>
                        <div>
                          <p className="font-semibold text-green-900">Resume Generated Successfully!</p>
                          <p className="text-sm text-green-800">Your PDF resume has been downloaded.</p>
                        </div>
                        <button
                          onClick={() => setShowSuccessMessage(false)}
                          className="ml-auto text-green-600 hover:text-green-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <div className="space-y-3">
                      <button
                        onClick={handleDownloadPDF}
                        disabled={isGenerating || !isFormValid()}
                        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                          isFormValid()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Download className="w-5 h-5" />
                        <span>{isGenerating ? 'Generating...' : 'Download PDF'}</span>
                      </button>
                      
                      <button
                        onClick={handleExportJSON}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                      >
                        <FileJson className="w-5 h-5" />
                        <span>Export JSON</span>
                      </button>

                      <button
                        onClick={() => setShowImportModal(true)}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Import Data</span>
                      </button>
                    </div>
                  </div>

                  {/* Section Navigation */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Sections</h3>
                    <div className="space-y-2">
                      {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = currentStep === index
                        const isCompleted = index < currentStep
                        return (
                          <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                              isActive
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                              <span className={`font-medium ${isActive ? 'text-blue-900' : 'text-gray-700'}`}>
                                {step.label}
                              </span>
                            </div>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              isCompleted
                                ? 'bg-green-100 text-green-700'
                                : isActive
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-500'
                            }`}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section - Right Side */}
        <div className="w-[420px] bg-gray-100 border-l border-gray-200 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                  <p className="text-sm text-gray-500">See how your resume will look</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-all">
                    <span className="text-sm">🔍</span>
                  </button>
                  <button className="w-8 h-8 bg-white border border-gray-300 rounded text-gray-600 hover:bg-gray-50 transition-all">
                    <Share2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Import Resume Data</h2>
                  <p className="text-gray-600">Choose your preferred method to import your information</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setJsonInput('')
                }}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all duration-300 hover:scale-110"
              >
                <X className="w-6 h-6 mx-auto" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LinkedIn Profile Import */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LI</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Import from LinkedIn</h3>
                    <p className="text-sm text-gray-600">Connect your LinkedIn profile</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your LinkedIn profile URL to import your professional information.
                </p>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="https://linkedin.com/in/your-profile"
                    disabled={isImportingLinkedIn}
                  />
                  <button
                    onClick={handleLinkedInImport}
                    disabled={isImportingLinkedIn || !linkedinUrl.trim()}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  >
                    <Upload className="w-5 h-5" />
                    {isImportingLinkedIn ? 'Importing...' : 'Import from LinkedIn'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Note: LinkedIn API integration required for automated import
                </p>
              </div>

              {/* Resume File Upload Option */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                    <FileUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Upload Resume File</h3>
                    <p className="text-sm text-gray-600">Extract from DOCX or TXT</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Upload your existing resume and we'll automatically extract the information.
                </p>
                <div className="flex gap-3">
                  <input
                    ref={resumeFileInputRef}
                    type="file"
                    accept=".docx,.txt"
                    onChange={handleResumeFileUpload}
                    disabled={isParsingResume}
                    className="hidden"
                  />
                  <button
                    onClick={() => resumeFileInputRef.current?.click()}
                    disabled={isParsingResume}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <FileUp className="w-5 h-5" />
                    {isParsingResume ? 'Parsing Resume...' : 'Choose Resume File'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Supported formats: DOCX, TXT (PDF upload temporarily unavailable)
                </p>
              </div>

              {/* JSON File Upload Option */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                    <FileJson className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Upload JSON File</h3>
                    <p className="text-sm text-gray-600">Import from exported JSON</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  If you previously exported your resume data as JSON, upload it here.
                </p>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <FileJson className="w-5 h-5" />
                    Choose JSON File
                  </button>
                </div>
              </div>

              {/* Paste JSON Option */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{}]</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Paste JSON Data</h3>
                    <p className="text-sm text-gray-600">Direct JSON input</p>
                  </div>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 font-mono text-sm resize-none"
                  placeholder='Paste your resume JSON data here...'
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleImportJSON}
                    disabled={!jsonInput.trim()}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  >
                    <Upload className="w-5 h-5" />
                    Import from JSON
                  </button>
                  <button
                    onClick={() => setJsonInput('')}
                    disabled={!jsonInput.trim()}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center mt-0.5">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-2">How it works:</p>
                  <p className="text-sm text-blue-800">
                    All import methods will populate the form fields with your data.
                    You can review and edit the information before generating your PDF resume.
                    Your data is processed locally and never sent to any server.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
