import { Plus, Trash2 } from "lucide-react";

export default function ResumeForm({
  resumeData,
  setResumeData,
  currentStep,
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
   -----------------------------*/
  const addItem = (section, template) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], template],
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

  /** -----------------------------
   * EXPERIENCE RESPONSIBILITIES
   -----------------------------*/
  const addResponsibility = (i) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) =>
        idx === i
          ? { ...exp, responsibilities: [...exp.responsibilities, ""] }
          : exp
      ),
    }));
  };

  const updateResponsibility = (i, j, value) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) =>
        idx === i
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((r, k) =>
                k === j ? value : r
              ),
            }
          : exp
      ),
    }));
  };

  const removeResponsibility = (i, j) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, idx) =>
        idx === i
          ? {
              ...exp,
              responsibilities: exp.responsibilities.filter(
                (_, k) => k !== j
              ),
            }
          : exp
      ),
    }));
  };

  /** -----------------------------
   * SKILLS
   -----------------------------*/
  const addSkill = (type) => {
    const skill = prompt(`Add ${type} skill`);
    if (!skill) return;
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], skill],
      },
    }));
  };

  const removeSkill = (type, index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index),
      },
    }));
  };

  /** -----------------------------
   * UI HELPERS
   -----------------------------*/
  const Input = ({ label, ...props }) => (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const TextArea = ({ label, ...props }) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...props}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );

  /** ============================================================
   *  RENDER SECTIONS
   * ============================================================
   */

  /* ---------------------------------------------------------------
     PERSONAL
  ----------------------------------------------------------------*/
  if (currentStep === 0)
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          rows="4"
          value={resumeData.personal.summary}
          onChange={(e) => updatePersonal("summary", e.target.value)}
        />

        <p className="text-xs text-gray-500 text-right">
          {resumeData.personal.summary.length}/500
        </p>
      </div>
    );

  /* ---------------------------------------------------------------
     EXPERIENCE
  ----------------------------------------------------------------*/
  if (currentStep === 1)
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">
            Work Experience
          </h3>

          <button
            onClick={() =>
              addItem("experience", {
                title: "",
                company: "",
                location: "",
                startDate: "",
                endDate: "",
                responsibilities: [""],
              })
            }
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>

        {resumeData.experience.map((exp, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow-sm bg-white space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">
                Experience {i + 1}
              </h4>
              <button
                onClick={() => removeItem("experience", i)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                value={exp.title}
                onChange={(e) =>
                  updateItem("experience", i, "title", e.target.value)
                }
              />

              <Input
                label="Company"
                value={exp.company}
                onChange={(e) =>
                  updateItem("experience", i, "company", e.target.value)
                }
              />

              <Input
                label="Location"
                value={exp.location}
                onChange={(e) =>
                  updateItem("experience", i, "location", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Start"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateItem("experience", i, "startDate", e.target.value)
                  }
                />
                <Input
                  label="End"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateItem("experience", i, "endDate", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-medium text-sm text-gray-700">
                  Responsibilities
                </label>
                <button
                  onClick={() => addResponsibility(i)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>

              {exp.responsibilities.map((r, j) => (
                <div key={j} className="flex gap-2">
                  <input
                    value={r}
                    onChange={(e) =>
                      updateResponsibility(i, j, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeResponsibility(i, j)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {resumeData.experience.length === 0 && (
          <p className="text-center text-gray-500">
            No experience added yet.
          </p>
        )}
      </div>
    );

  /* ---------------------------------------------------------------
     EDUCATION
  ----------------------------------------------------------------*/
  if (currentStep === 2)
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">Education</h3>

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
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>

        {resumeData.education.map((edu, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow-sm bg-white space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">
                Education {i + 1}
              </h4>
              <button
                onClick={() => removeItem("education", i)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                label="Start"
                value={edu.startDate}
                onChange={(e) =>
                  updateItem("education", i, "startDate", e.target.value)
                }
              />

              <Input
                label="End"
                value={edu.endDate}
                onChange={(e) =>
                  updateItem("education", i, "endDate", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        {resumeData.education.length === 0 && (
          <p className="text-center text-gray-500">
            No education added yet.
          </p>
        )}
      </div>
    );

  /* ---------------------------------------------------------------
     SKILLS
  ----------------------------------------------------------------*/
  if (currentStep === 3)
    return (
      <div className="space-y-6">
        {/* Technical Skills */}
        <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
          <div className="flex justify-between">
            <h4 className="font-semibold text-gray-800">Technical Skills</h4>
            <button
              onClick={() => addSkill("technical")}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {resumeData.skills.technical.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2 text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill("technical", i)}
                  className="hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}

            {resumeData.skills.technical.length === 0 && (
              <p className="text-gray-500 text-sm">No technical skills yet.</p>
            )}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
          <div className="flex justify-between">
            <h4 className="font-semibold text-gray-800">Soft Skills</h4>
            <button
              onClick={() => addSkill("soft")}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {resumeData.skills.soft.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full flex items-center gap-2 text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill("soft", i)}
                  className="hover:text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}

            {resumeData.skills.soft.length === 0 && (
              <p className="text-gray-500 text-sm">No soft skills yet.</p>
            )}
          </div>
        </div>
      </div>
    );

  /* ---------------------------------------------------------------
     PROJECTS
  ----------------------------------------------------------------*/
  if (currentStep === 4)
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 text-lg">Projects</h3>

          <button
            onClick={() =>
              addItem("projects", {
                name: "",
                technologies: "",
                description: "",
                link: "",
              })
            }
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>

        {resumeData.projects.map((project, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg bg-white shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">
                Project {i + 1}
              </h4>
              <button
                onClick={() => removeItem("projects", i)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <Input
              label="Project Name"
              value={project.name}
              onChange={(e) =>
                updateItem("projects", i, "name", e.target.value)
              }
            />

            <Input
              label="Technologies"
              value={project.technologies}
              onChange={(e) =>
                updateItem("projects", i, "technologies", e.target.value)
              }
            />

            <TextArea
              label="Description"
              rows="3"
              value={project.description}
              onChange={(e) =>
                updateItem("projects", i, "description", e.target.value)
              }
            />

            <Input
              label="Link (optional)"
              value={project.link}
              onChange={(e) =>
                updateItem("projects", i, "link", e.target.value)
              }
            />
          </div>
        ))}

        {resumeData.projects.length === 0 && (
          <p className="text-center text-gray-500">
            No projects added yet.
          </p>
        )}
      </div>
    );

  return null;
}
