import { useState, useRef } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import {
  Download,
  FileJson,
  Upload,
  X,
  FileUp,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderOpen,
  Eye,
  CheckCircle,
  Linkedin,
  FileText,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
} from "lucide-react";

import { generateLatexStylePDF } from "./utils/pdfGenerator";
import { extractResumeFromFile } from "./utils/resumeParser";

export default function App() {
  /** --------------------------
   * STATE
   ---------------------------*/
  const [resumeData, setResumeData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      portfolio: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: { technical: [], soft: [] },
    certifications: [],
    projects: [],
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [isImportingLinkedIn, setIsImportingLinkedIn] = useState(false);

  // Preview State
  const [zoom, setZoom] = useState(0.55); // Default scale to fit sidebar
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  /** --------------------------
   * VALIDATION
   ---------------------------*/
  const isFormValid = () => {
    const p = resumeData.personal;
    return p.fullName.trim() && p.email.trim() && p.phone.trim();
  };

  const isStepComplete = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Personal
        return resumeData.personal.fullName && resumeData.personal.email;
      case 1: // Experience
        return resumeData.experience.length > 0;
      case 2: // Education
        return resumeData.education.length > 0;
      case 3: // Skills
        return resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0;
      case 4: // Projects
        return resumeData.projects.length > 0;
      default:
        return false;
    }
  };

  /** --------------------------
   * NAVIGATION STEPS
   ---------------------------*/
  const steps = [
    { icon: User, label: "Personal" },
    { icon: Briefcase, label: "Experience" },
    { icon: GraduationCap, label: "Education" },
    { icon: Award, label: "Skills" },
    { icon: FolderOpen, label: "Projects" },
  ];

  /** --------------------------
   * ACTION HANDLERS
   ---------------------------*/

  const handleDownloadPDF = async () => {
    if (!isFormValid()) {
      alert("Missing required fields: Full Name, Email, Phone");
      return;
    }

    setIsGenerating(true);

    try {
      const pdf = generateLatexStylePDF(resumeData);
      pdf.save(
        `${resumeData.personal.fullName.replace(/\s+/g, "_")}_ATS.pdf`
      );
    } catch (err) {
      console.error(err);
      alert("PDF generation failed.");
    }

    setIsGenerating(false);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  /** --------------------------
   * NORMALIZE IMPORTED DATA
   ---------------------------*/
  const normalizeImportedData = (data) => {
    // Handle different JSON formats
    const personal = data.personal || data.personal_info || {};
    const experience = data.experience || [];
    const education = data.education || [];
    const skills = data.skills || data.core_competencies || {};
    const projects = data.projects || [];
    const certifications = data.certifications || [];
    const summary = data.summary || personal.summary || "";

    // Normalize personal info
    const normalizedPersonal = {
      fullName: personal.fullName || personal.name || "",
      email: personal.email || "",
      phone: personal.phone || "",
      location: personal.location || "",
      linkedin: personal.linkedin || "",
      portfolio: personal.portfolio || personal.website || "",
      summary: summary,
    };

    // Normalize experience
    const normalizedExperience = experience.map((exp) => ({
      title: exp.title || exp.position || "",
      company: exp.company || exp.organization || "",
      location: exp.location || "",
      startDate: exp.startDate || exp.start_date || exp.dates?.split("--")[0]?.trim() || "",
      endDate: exp.endDate || exp.end_date || exp.dates?.split("--")[1]?.trim() || "",
      responsibilities: exp.responsibilities || exp.bullets || (exp.description ? [exp.description] : []),
    }));

    // Normalize education
    const normalizedEducation = education.map((edu) => ({
      degree: edu.degree || "",
      institution: edu.institution || edu.school || "",
      location: edu.location || "",
      gpa: edu.gpa || "",
      startDate: edu.startDate || edu.start_date || edu.dates?.split("--")[0]?.trim() || "",
      endDate: edu.endDate || edu.end_date || edu.dates?.split("--")[1]?.trim() || "",
    }));

    // Normalize skills
    let normalizedSkills = {
      technical: [],
      soft: [],
    };

    if (Array.isArray(skills)) {
      // If skills is an array (like core_competencies), split into technical and soft
      normalizedSkills.technical = skills.filter(s =>
        s.toLowerCase().includes("technical") ||
        s.toLowerCase().includes("product") ||
        s.toLowerCase().includes("data") ||
        s.toLowerCase().includes("ai")
      );
      normalizedSkills.soft = skills.filter(s =>
        s.toLowerCase().includes("management") ||
        s.toLowerCase().includes("leadership") ||
        s.toLowerCase().includes("problem")
      );
      // If no clear split, put all in technical
      if (normalizedSkills.technical.length === 0 && normalizedSkills.soft.length === 0) {
        normalizedSkills.technical = skills;
      }
    } else {
      normalizedSkills.technical = skills.technical || [];
      normalizedSkills.soft = skills.soft || [];
    }

    // Normalize certifications
    const normalizedCertifications = Array.isArray(certifications)
      ? certifications.map((cert) =>
        typeof cert === "string"
          ? { name: cert, issuer: "", date: "" }
          : cert
      )
      : [];

    return {
      personal: normalizedPersonal,
      experience: normalizedExperience,
      education: normalizedEducation,
      skills: normalizedSkills,
      projects: projects,
      certifications: normalizedCertifications,
    };
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        const normalizedData = normalizeImportedData(importedData);
        setResumeData(normalizedData);
        setShowImportModal(false);
      } catch {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const handleImportJSON = () => {
    try {
      const importedData = JSON.parse(jsonInput);
      const normalizedData = normalizeImportedData(importedData);
      setResumeData(normalizedData);
      setJsonInput("");
      setShowImportModal(false);
    } catch {
      alert("Invalid JSON.");
    }
  };

  const handleLinkedInImport = () => {
    alert("LinkedIn import requires API integration. Not implemented yet.");
  };

  const handleResumeFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);

    try {
      const extracted = await extractResumeFromFile(file);
      setResumeData(extracted);
      setShowImportModal(false);
    } catch (err) {
      alert("Failed to parse resume.");
    }

    setIsParsingResume(false);
  };

  const handlePreviewPDF = async () => {
    if (!isFormValid()) {
      alert("Missing required fields: Full Name, Email, Phone");
      return;
    }

    try {
      const pdf = generateLatexStylePDF(resumeData);
      const blob = pdf.output("bloburl");
      window.open(blob, "_blank");
    } catch (err) {
      console.error(err);
      alert("Preview generation failed.");
    }
  };

  /** --------------------------
   * RENDER
   ---------------------------*/
  return (
    <div className="flex h-screen bg-gray-50">
      {/* ------------------------------------------------------------
        SIDEBAR
       ------------------------------------------------------------ */}
      {/* ------------------------------------------------------------
        SIDEBAR (STEPPER)
       ------------------------------------------------------------ */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col font-sans z-20 shadow-sm">
        <div className="px-6 py-8 border-b border-gray-50 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-blue-200 shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">
                ResumeBuilder
              </h1>
              <p className="text-xs text-gray-400 font-medium mt-1">
                Professional & Private
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = currentStep === i;
            const completed = isStepComplete(i);

            return (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-full group relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 border ${active
                  ? "bg-blue-50 border-blue-100 shadow-sm"
                  : "bg-transparent border-transparent hover:bg-gray-50"
                  }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${active
                    ? "bg-white text-blue-600 shadow-sm"
                    : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-gray-500"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <span
                    className={`block text-sm font-bold ${active ? "text-blue-900" : "text-gray-600 group-hover:text-gray-900"
                      }`}
                  >
                    {s.label}
                  </span>
                  {active && (
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                      In Progress
                    </span>
                  )}
                </div>

                {completed && (
                  <CheckCircle className="w-5 h-5 text-green-500 fill-green-50" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setShowImportModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
          >
            <Upload className="w-4 h-4" />
            Import / Export
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------
        MAIN FORM AREA
       ------------------------------------------------------------ */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Simplified Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8 sticky top-0 bg-gray-50 pt-4 pb-2 z-10 backdrop-blur-sm">
          <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Section Title */}
        <div className="max-w-3xl mx-auto mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {steps[currentStep].label} Information
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the fields below.
          </p>
        </div>

        {/* Actual Form */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
          <ResumeForm
            resumeData={resumeData}
            setResumeData={setResumeData}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />

        </div>
      </main>

      {/* ------------------------------------------------------------
        LIVE PREVIEW
       ------------------------------------------------------------ */}
      <aside className="w-[450px] border-l bg-gray-100/50 flex flex-col relative">
        {/* Floating Zoom Controls */}
        <div className="absolute bottom-24 right-6 flex flex-col gap-2 z-30 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-200 rounded-xl p-1.5 flex flex-col gap-1">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 1.5))}
              className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
              className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(0.55)}
              className="p-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setIsFullScreen(true)}
            className="bg-gray-900 text-white p-3 rounded-xl shadow-lg hover:bg-black transition-all hover:scale-105"
            title="Full Screen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100/50 p-8 flex justify-center items-start relative custom-scrollbar">
          <div
            className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-top"
            style={{
              width: "210mm",
              minHeight: "297mm",
              transform: `scale(${zoom})`,
            }}
          >
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-t flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20 relative">
          <button
            onClick={handlePreviewPDF}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          <button
            disabled={!isFormValid() || isGenerating}
            onClick={handleDownloadPDF}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${isFormValid()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            <Download className="w-4 h-4" />
            {isGenerating ? "Generating..." : "Download"}
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------
        FULL SCREEN MODAL
       ------------------------------------------------------------ */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col h-screen animate-in fade-in duration-200">
          <div className="h-16 flex items-center justify-between px-6 bg-gray-900 text-white border-b border-gray-800">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="font-semibold text-lg tracking-tight">Full Screen Preview</h2>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto flex justify-center p-12 bg-gray-900/50 custom-scrollbar backdrop-blur-sm">
            <div className="shadow-2xl origin-top" style={{ width: "210mm", minHeight: "297mm", backgroundColor: "white" }}>
              {/* Using a separate scale for fullscreen? Or just standard A4. 
                      Standard A4 is readable on desktop. 
                      We'll render it at scale 1 or slightly larger if needed.
                      For now, regular size (no transform) is essentially "100%".
                  */}
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------
        IMPORT MODAL
       ------------------------------------------------------------ */}
      {
        showImportModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Import Resume Data</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Modal Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">

                    {/* 1. Upload Resume */}
                    <button
                      onClick={() => {
                        // This relies on the file input below
                        fileInputRef.current?.click();
                        setIsParsingResume(true);
                      }}
                      className="w-full group flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                    >
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700">Upload Resume File</h3>
                        <p className="text-xs text-gray-500 mt-1">Support for PDF soon (currently uses text/parsing)</p>
                      </div>
                    </button>

                    {/* 2. Paste JSON */}
                    <div className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-all focus-within:ring-2 focus-within:ring-blue-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                          <FileJson className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900">Paste JSON/Text</span>
                      </div>
                      <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste resume JSON data here..."
                        className="w-full h-24 p-3 bg-gray-50 rounded-lg border-0 text-sm focus:ring-0 resize-none font-mono"
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={handleImportJSON}
                          disabled={!jsonInput.trim()}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Import JSON
                        </button>
                      </div>
                    </div>

                    {/* 3. Upload JSON */}
                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setIsParsingResume(false); // Mode switch
                      }}
                      className="w-full group flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="p-2 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-gray-200">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-700">Upload JSON File</h3>
                        <p className="text-xs text-gray-400">Restore from a previously exported file</p>
                      </div>
                    </button>

                    {/* 4. LinkedIn (Disabled) */}
                    <div className="relative group opacity-60">
                      <button disabled className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed text-left">
                        <div className="p-2 bg-blue-50 text-blue-400 rounded-lg">
                          <Linkedin className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-500">Import from LinkedIn</h3>
                          <p className="text-xs text-gray-400">Coming soon</p>
                        </div>
                      </button>
                    </div>

                    {/* Export Option inside modal for completeness */}
                    <div className="pt-4 mt-2 border-t">
                      <button
                        onClick={handleExportJSON}
                        className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-600 py-2"
                      >
                        <FileJson className="w-4 h-4" />
                        Export Current Data as JSON
                      </button>
                    </div>

                  </div>
                </div>

                {/* Hidden Input for Files */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImportFile}
                  accept=".json,.txt"
                />
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
