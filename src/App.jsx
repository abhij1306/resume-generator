import { useState, useRef, useEffect } from "react";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import { CustomSection } from "./components/CustomSection";
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
  Plus,
  Languages,
  FileText,
  Maximize,
} from "lucide-react";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { generateLatexStylePDF } from "./utils/pdfGenerator";
import { extractResumeFromFile } from "./utils/resumeParser";
import { generateId } from "./utils/uuid";
import { SortableItem } from "./components/SortableItem"; // Re-use generic wrapper if possible, or create SidebarItem
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  /** --------------------------
   * STATE
   ---------------------------*/
  /* ---------------------------------------------------------------
     STATE
  ----------------------------------------------------------------*/
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
    languages: [],
    certifications: [],
    projects: [],
    customSections: {}, // { id: { title: "Title", items: [text, text] } }
  });

  // Debounced state
  const [debouncedResumeData, setDebouncedResumeData] = useState(resumeData);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedResumeData(resumeData);
    }, 300);
    return () => clearTimeout(handler);
  }, [resumeData]);

  // Section Order
  const [sectionOrder, setSectionOrder] = useState([
    "experience",
    "education",
    "skills",
    "certifications",
    "languages",
    "projects",
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [isParsingResume, setIsParsingResume] = useState(false);

  // Preview State
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fileInputRef = useRef(null);
  const resumeFileInputRef = useRef(null);
  const pdfFileInputRef = useRef(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  /** --------------------------
   * VALIDATION
   ---------------------------*/
  const isFormValid = () => {
    const p = resumeData.personal;
    return p.fullName.trim() && p.email.trim() && p.phone.trim();
  };

  const isStepComplete = (sectionName) => {
    switch (sectionName) {
      case "personal":
        return resumeData.personal.fullName && resumeData.personal.email;
      case "experience":
        return resumeData.experience.length > 0;
      case "education":
        return resumeData.education.length > 0;
      case "skills":
        return resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0;
      case "certifications":
        return resumeData.certifications.length > 0;
      case "languages":
        return resumeData.languages?.length > 0;
      case "projects":
        return resumeData.projects.length > 0;
      default:
        return false;
    }
  };

  /** --------------------------
   * NAVIGATION LOOKUP
   ---------------------------*/
  const getSectionConfig = (sectionId) => {
    switch (sectionId) {
      case "personal":
        return { icon: User, label: "Personal" };
      case "experience":
        return { icon: Briefcase, label: "Experience" };
      case "education":
        return { icon: GraduationCap, label: "Education" };
      case "skills":
        return { icon: Award, label: "Skills" };
      case "certifications":
        return { icon: Award, label: "Certifications" };
      case "languages":
        return { icon: Languages, label: "Languages" };
      case "projects":
        return { icon: FolderOpen, label: "Projects" };
      default:
        if (sectionId.startsWith("custom-")) {
          return {
            icon: FolderOpen,
            label: resumeData.customSections[sectionId]?.title || "Custom Section",
          };
        }
        return { icon: FolderOpen, label: "Unknown" };
    }
  };

  // effectiveSteps = ["personal", ...sectionOrder]
  const effectiveSteps = ["personal", ...sectionOrder];
  const activeSection = effectiveSteps[currentStep];

  /** --------------------------
    * NAVIGATION TITLE
    ---------------------------*/
  const getActiveTitle = () => {
    switch (activeSection) {
      case "personal":
        return "Personal Information";
      case "experience":
        return "Professional Experience";
      case "education":
        return "Education";
      case "skills":
        return "Skills";
      case "certifications":
        return "Certifications";
      case "languages":
        return "Languages";
      case "projects":
        return "Projects";
      default:
        if (activeSection.startsWith('custom-')) {
          return resumeData.customSections[activeSection]?.title || "Custom Section";
        }
        return "Resume Section";
    }
  };

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
      id: exp.id || generateId(), // Ensure ID for DnD
    }));

    // Normalize education
    const normalizedEducation = education.map((edu) => ({
      degree: edu.degree || "",
      institution: edu.institution || edu.school || "",
      location: edu.location || "",
      gpa: edu.gpa || "",
      startDate: edu.startDate || edu.start_date || edu.dates?.split("--")[0]?.trim() || "",
      endDate: edu.endDate || edu.end_date || edu.dates?.split("--")[1]?.trim() || "",
      id: edu.id || generateId(),
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
      projects: projects.map(p => ({ ...p, id: p.id || generateId() })),
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
      console.error('Resume upload error:', err);
      alert(err.message || "Failed to parse resume. Please check the file format and try again.");
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
  /** --------------------------
   * RENDER
   ---------------------------*/
  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#222831] font-sans selection:bg-[#9EE8C8] selection:text-[#222831] relative overflow-hidden">

      {/* ------------------------------------------------------------
          BACKGROUND BLOBS (Subtle/Faint)
        ------------------------------------------------------------ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#A6EBCF] opacity-[0.08] blur-[120px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-blue-400 opacity-[0.05] blur-[150px] rounded-full animate-float"></div>
      </div>

      {/* ------------------------------------------------------------
        SIDEBAR - Neumorphic Design
        ------------------------------------------------------------ */}
      <aside className="w-72 bg-[#FFFFFF] flex flex-col z-20 relative border-r border-[rgba(0,0,0,0.08)]">
        {/* BRAND */}
        <div className="px-8 py-10">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="w-10 h-10 bg-[#FFFFFF] rounded-xl shadow-neumorphic flex items-center justify-center text-[#222831]">
              <span className="font-display font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-[#222831] tracking-tight leading-none">
                Resume<span className="text-[#222831] border-b-2 border-[#A6EBCF]">Edge</span>
              </h1>
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* 1. PERSONAL (Fixed) */}
          <button
            onClick={() => setCurrentStep(0)}
            className={`w-full group flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${currentStep === 0
              ? "bg-[#FFFFFF] shadow-neumorphic border-l-4 border-[#9EE8C8] text-[#222831]"
              : "hover:bg-[#FFFFFF] hover:shadow-neumorphic text-[#6B7280]"
              }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${currentStep === 0
                ? "text-[#222831]"
                : "text-[#6B7280] group-hover:text-[#222831]"
                }`}
            >
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="block text-[13px] font-semibold tracking-wide text-[#6B7280]">
                PERSONAL
              </span>
            </div>
            {isStepComplete("personal") && <div className="w-2 h-2 rounded-full bg-[#A6EBCF]"></div>}
          </button>

          {/* 2. SORTABLE SECTIONS */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sectionOrder}
              strategy={verticalListSortingStrategy}
            >
              {sectionOrder.map((sectionId, i) => {
                const config = getSectionConfig(sectionId);
                const Icon = config.icon;
                const stepIndex = i + 1;
                const active = currentStep === stepIndex;
                const completed = isStepComplete(sectionId);

                return (
                  <SortableItem key={sectionId} id={sectionId}>
                    <button
                      onClick={() => setCurrentStep(stepIndex)}
                      className={`w-full group flex items-center gap-4 px-4 py-3 rounded-2xl text-left transition-all duration-200 ${active
                        ? "bg-[#FFFFFF] shadow-neumorphic border-l-4 border-[#9EE8C8] text-[#222831]"
                        : "hover:bg-[#FFFFFF] hover:shadow-neumorphic text-[#6B7280]"
                        }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active
                          ? "text-[#222831]"
                          : "text-[#6B7280] group-hover:text-[#222831]"
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <span className="block text-[13px] font-semibold tracking-wide text-[#6B7280]">
                          {config.label.toUpperCase()}
                        </span>
                      </div>

                      {completed && (
                        <div className="w-2 h-2 rounded-full bg-[#A6EBCF]"></div>
                      )}
                    </button>
                  </SortableItem>
                );
              })}
            </SortableContext>
          </DndContext>

          {/* ADD SECTION BUTTON */}
          <button
            onClick={() => {
              const title = prompt("Enter Section Title (e.g. Certifications, Languages):");
              if (title) {
                const id = `custom-${generateId()}`;
                setResumeData(prev => ({
                  ...prev,
                  customSections: {
                    ...prev.customSections,
                    [id]: { title, items: [] }
                  }
                }));
                setSectionOrder(prev => [...prev, id]);
                setCurrentStep(sectionOrder.length + 1); // Select the new section
              }
            }}
            className="mt-2 mx-auto flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#9EE8C8] border border-[rgba(158,232,200,0.3)] rounded-xl hover:bg-[#9EE8C8] hover:text-[#222831] transition-all uppercase tracking-wider opacity-80 hover:opacity-100"
          >
            <Plus className="w-3 h-3" /> Add Section
          </button>
        </nav>

        <div className="p-6 border-t border-[rgba(0,0,0,0.08)] mx-4">
          <button
            onClick={() => setShowImportModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FFFFFF] text-[#6B7280] text-xs font-semibold rounded-xl shadow-neumorphic hover:text-[#222831] hover:scale-[1.02] transition-all"
          >
            <Upload className="w-4 h-4" />
            Import Data
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------
        MAIN FORM AREA - Three Column Layout
        ------------------------------------------------------------ */}
      <div className="flex-1 flex overflow-hidden z-10 relative">

        {/* CENTER: FORM - Wide and Airy */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <div className="max-w-4xl mx-auto pb-32">

            {/* Container - Neumorphic Card */}
            <div className="bg-[#FFFFFF] rounded-[24px] shadow-neumorphic p-8 lg:p-12 animate-slide-up relative overflow-hidden">
              {/* Decorative Gradient Blob inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#A6EBCF] opacity-[0.1] blur-[80px] rounded-full pointer-events-none"></div>

              {/* Header */}
              <div className="mb-8 pl-2">
                <h2 className="text-2xl font-display font-bold text-[#222831] tracking-tight">
                  {getActiveTitle()}
                </h2>
                <p className="text-[#6B7280] mt-1 text-[13px]">
                  {activeSection === 'experience' ? "Add your relevant professional history." : "Fill in the details below to complete your profile."}
                </p>
              </div>

              {activeSection.startsWith('custom-') && (
                <CustomSection
                  sectionId={activeSection}
                  data={resumeData.customSections[activeSection]}
                  setResumeData={setResumeData}
                />
              )}
              {!activeSection.startsWith('custom-') && (
                <ResumeForm
                  key="resume-form"
                  currentStep={currentStep} // Only for visual, can refactor
                  activeSection={activeSection}
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                />
              )}
            </div>
          </div>
        </main>

        {/* RIGHT COLUMN: PREVIEW - Narrower A4 Frame */}
        <aside className="w-[360px] bg-[#F5F7FA] border-l border-[rgba(0,0,0,0.08)] flex flex-col relative h-full shrink-0 shadow-preview-float z-30">

          {/* Top Bar */}
          <div className="absolute top-4 right-4 z-30 flex gap-2">
            <button
              onClick={() => setIsFullScreen(true)}
              className="bg-[#FFFFFF] text-[#6B7280] p-2 rounded-xl hover:text-[#222831] hover:shadow-neumorphic transition-all"
              title="Full Screen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Preview Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex justify-center bg-[#F1F3F6]/50">
            {/* Preview Frame - No scaling needed since we set width to 360px */}
            <div className="flex-1 min-w-0">
              <ErrorBoundary>
                <ResumePreview
                  resumeData={debouncedResumeData}
                  sectionOrder={sectionOrder}
                />
              </ErrorBoundary>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-5 bg-[#FFFFFF]/80 backdrop-blur border-t border-[rgba(0,0,0,0.08)] z-20">
            <button
              disabled={!isFormValid() || isGenerating}
              onClick={handleDownloadPDF}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[15px] tracking-wide transition-all transform active:scale-95 duration-200 bg-[linear-gradient(135deg,#9EE8C8,#84D9B5)] text-[#1B1B1B] shadow-mint-glow hover:shadow-mint-glow-strong ${isFormValid()
                ? "opacity-100"
                : "opacity-50 cursor-not-allowed grayscale"
                }`}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#1B1B1B]"></span>
                  GENERATING...
                </span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  DOWNLOAD PDF
                </>
              )}
            </button>
          </div>
        </aside>

      </div>

      {/* ------------------------------------------------------------
        FULL SCREEN MODAL
        ------------------------------------------------------------ */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-[#222831]/95 backdrop-blur-lg flex flex-col h-screen animate-fade-in">
          <div className="h-20 flex items-center justify-between px-10 border-b border-white/10">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-[#A6EBCF]" />
              <h2 className="font-display font-bold text-xl tracking-tight text-white">Preview</h2>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex justify-center p-16 custom-scrollbar">
            <div className="shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <ErrorBoundary>
                <ResumePreview
                  resumeData={debouncedResumeData}
                  sectionOrder={sectionOrder}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------
        IMPORT MODAL (Light Theme)
        ------------------------------------------------------------ */}
      {
        showImportModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-6 z-50 animate-fade-in">
            <div className="glass-panel bg-white border border-gray-200 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative overflow-hidden">

              {/* Decor */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400 opacity-10 blur-[60px] rounded-full"></div>

              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-display font-bold text-gray-900">Import Data</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 relative z-10">
                {/* 1. Upload PDF Resume */}
                <button
                  onClick={() => {
                    pdfFileInputRef.current?.click();
                  }}
                  disabled={isParsingResume}
                  className="w-full group flex items-start gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="p-3 bg-red-100 text-red-500 rounded-xl group-hover:bg-teal-200 group-hover:text-teal-800 transition-colors">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">Upload PDF Resume</h3>
                    <p className="text-sm text-gray-500 mt-1">Extract data from PDF files</p>
                  </div>
                  {isParsingResume && (
                    <div className="absolute right-4 top-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-500"></div>
                    </div>
                  )}
                </button>

                {/* 2. Upload DOCX/TXT Resume */}
                <button
                  onClick={() => {
                    resumeFileInputRef.current?.click();
                  }}
                  className="w-full group flex items-start gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all text-left"
                >
                  <div className="p-3 bg-blue-100 text-blue-500 rounded-xl group-hover:bg-teal-200 group-hover:text-teal-800 transition-colors">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-teal-700 transition-colors">Upload DOCX/TXT Resume</h3>
                    <p className="text-sm text-gray-500 mt-1">Auto-fill from DOCX or TXT files</p>
                  </div>
                </button>

                {/* 3. Paste JSON */}
                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-teal-300 transition-all focus-within:ring-1 focus-within:ring-teal-300">
                  <div className="flex items-center gap-3 mb-4">
                    <FileJson className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-gray-900">Paste JSON</span>
                  </div>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Paste resume JSON data here..."
                    className="w-full h-24 p-4 bg-white rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-teal-300 resize-none font-mono tracking-tight"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleImportJSON}
                      disabled={!jsonInput.trim()}
                      className="px-5 py-2 bg-teal-400 text-gray-900 font-bold rounded-lg hover:bg-teal-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Import
                    </button>

                  </div>
                </div>


              </div>

              {/* Hidden Input for Files */}
              <input
                type="file"
                ref={pdfFileInputRef}
                className="hidden"
                onChange={handleResumeFileUpload}
                accept=".pdf"
              />
              <input
                type="file"
                ref={resumeFileInputRef}
                className="hidden"
                onChange={handleResumeFileUpload}
                accept=".docx,.txt"
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImportFile}
                accept=".json,.txt"
              />

            </div>
          </div>
        )
      }
    </div >
  );
}
