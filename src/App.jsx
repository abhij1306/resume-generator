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

  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);

  /** --------------------------
   * VALIDATION
   ---------------------------*/
  const isFormValid = () => {
    const p = resumeData.personal;
    return p.fullName.trim() && p.email.trim() && p.phone.trim();
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
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">
            Resume Builder
          </h1>
          <p className="text-sm text-gray-500">
            Create a professional resume
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const active = currentStep === i;

            return (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${active
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <Icon className={`w-5 h-5`} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Upload className="w-4 h-4" />
            Import Data
          </button>

          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border rounded-lg hover:bg-gray-50"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------
        MAIN FORM AREA
       ------------------------------------------------------------ */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Step {currentStep + 1} / {steps.length}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all"
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
      <aside className="w-[450px] border-l bg-gray-100 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 flex justify-center">
          <div className="bg-white shadow-2xl min-h-[500px] w-full">
            <ResumePreview resumeData={resumeData} />
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 bg-white border-t flex gap-3 shadow-lg z-10">
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
                {/* JSON Upload */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-gray-100 rounded-lg border flex justify-center gap-3 hover:bg-gray-200"
                >
                  <FileJson className="w-5 h-5" />
                  Upload JSON File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImportFile}
                  accept=".json"
                />

                {/* Paste JSON area */}
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste JSON data here..."
                  className="w-full h-40 border rounded-lg p-3"
                />

                <button
                  onClick={handleImportJSON}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  Import JSON
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
