import { Plus, Trash2 } from "lucide-react";
import { ExperienceSection } from "./ExperienceSection";
import { ProjectsSection } from "./ProjectsSection";
import { SkillsSection } from "./SkillsSection";

/** -----------------------------
 * UI HELPER COMPONENTS
 -----------------------------*/
const Input = ({ label, ...props }) => (
  <div className="space-y-3">
    {label && (
      <label className="text-label">{label}</label>
    )}
    <input
      {...props}
      className="w-full input-neumorphic"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="space-y-3">
    <label className="text-label">{label}</label>
    <textarea
      {...props}
      className="w-full textarea-neumorphic resize-none"
    />
  </div>
);

export default function ResumeForm({
  resumeData,
  setResumeData,
  activeSection, // "personal" | "experience" | ...
}) {
  /** -----------------------------
   * PERSONAL
   -----------------------------*/
  const updatePersonal = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  /** -----------------------------
   * GENERIC ADD / REMOVE / UPDATE
   * (Kept for Education/Skills)
   -----------------------------*/
  const addItem = (section, template) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], { ...template, id: crypto.randomUUID() }],
    }));
  };

  const removeItem = (section, index) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const updateItem = (section, index, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: prev[section].map((obj, i) =>
        i === index ? { ...obj, [field]: value } : obj
      ),
    }));
  };

  /** ============================================================
   *  RENDER SECTIONS
   * ============================================================
   */

  /* ---------------------------------------------------------------
      PERSONAL
   ----------------------------------------------------------------*/
  if (activeSection === "personal")
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Autosave Status Indicator */}
        <div className="autosave-indicator">
          <div className="autosave-dot"></div>
          <span>Saved</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name *"
            value={resumeData.personal.fullName}
            onChange={(e) => updatePersonal("fullName", e.target.value)}
          />

          <Input
            label="Email *"
            value={resumeData.personal.email}
            onChange={(e) => updatePersonal("email", e.target.value)}
          />

          <Input
            label="Phone *"
            value={resumeData.personal.phone}
            onChange={(e) => updatePersonal("phone", e.target.value)}
          />

          <Input
            label="Location"
            value={resumeData.personal.location}
            onChange={(e) => updatePersonal("location", e.target.value)}
          />

          <Input
            label="LinkedIn"
            value={resumeData.personal.linkedin}
            onChange={(e) => updatePersonal("linkedin", e.target.value)}
          />

          <Input
            label="Portfolio / Website"
            value={resumeData.personal.portfolio}
            onChange={(e) => updatePersonal("portfolio", e.target.value)}
          />
        </div>

        <TextArea
          label="Professional Summary"
          value={resumeData.personal.summary}
          onChange={(e) => updatePersonal("summary", e.target.value)}
        />

        <div className="flex justify-between items-center">
          <span className="text-body text-text-secondary">Tip: Keep your summary concise and impactful</span>
          <span className="text-body text-text-secondary">
            {resumeData.personal.summary.length}/500
          </span>
        </div>
      </div>
    );

  /* ---------------------------------------------------------------
     EXPERIENCE
  ----------------------------------------------------------------*/
  if (activeSection === "experience")
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <ExperienceSection
          experience={resumeData.experience}
          setResumeData={setResumeData}
        />
      </div>
    );

  /* ---------------------------------------------------------------
      EDUCATION
   ----------------------------------------------------------------*/
  if (activeSection === "education")
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex justify-between items-center">
          <h3 className="text-h2 text-text-primary">Education</h3>

          <button
            onClick={() =>
              addItem("education", {
                degree: "",
                institution: "",
                location: "",
                gpa: "",
                startDate: "",
                endDate: "",
              })
            }
            className="flex items-center gap-2 px-4 py-2 bg-accent-mint text-text-primary rounded-xl font-bold shadow-mint-glow hover:bg-teal-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        {resumeData.education.map((edu, i) => (
          <div
            key={i}
            className="p-8 neumorphic-card space-y-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-h2 text-text-primary">
                Education {i + 1}
              </h4>
              <button
                onClick={() => removeItem("education", i)}
                className="text-text-secondary hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateItem("education", i, "degree", e.target.value)
                }
              />

              <Input
                label="Institution"
                value={edu.institution}
                onChange={(e) =>
                  updateItem("education", i, "institution", e.target.value)
                }
              />

              <Input
                label="Location"
                value={edu.location}
                onChange={(e) =>
                  updateItem("education", i, "location", e.target.value)
                }
              />

              <Input
                label="GPA"
                value={edu.gpa}
                onChange={(e) =>
                  updateItem("education", i, "gpa", e.target.value)
                }
              />

              <Input
                label="Start Date"
                value={edu.startDate}
                onChange={(e) =>
                  updateItem("education", i, "startDate", e.target.value)
                }
              />

              <Input
                label="End Date"
                value={edu.endDate}
                onChange={(e) =>
                  updateItem("education", i, "endDate", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        {resumeData.education.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            No education added yet.
          </div>
        )}
      </div>
    );

  /* ---------------------------------------------------------------
     SKILLS
  ----------------------------------------------------------------*/
  if (activeSection === "skills")
    return (
      <SkillsSection
        skills={resumeData.skills}
        setResumeData={setResumeData}
      />
    );

  /* ---------------------------------------------------------------
     PROJECTS
  ----------------------------------------------------------------*/
  if (activeSection === "projects")
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <ProjectsSection
          projects={resumeData.projects}
          setResumeData={setResumeData}
        />
      </div>
    );

  return null;
}
