import React from "react";
import PreviewWrapper from "./PreviewWrapper";

export default function ResumePreview({ resumeData, ...props }) {
  const { personal, education, experience, skills, projects, certifications } =
    resumeData;

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h2 className="text-h2 text-text-primary border-b border-border-light pb-1 mb-3 tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );

  if (!personal.fullName) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-xl font-semibold mb-2">Resume Preview</p>
        <p className="text-gray-500">
          Start filling out the form to see your resume preview
        </p>
      </div>
    );
  }

  /* 
   * HELPER: Render Section
   */
  const renderSection = (id) => {
    switch (id) {
      case "experience":
        return experience.length > 0 && (
          <Section key={id} title="Professional Experience">
            <div className="space-y-5">
              {experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-text-primary text-body">
                        {exp.title || "Role"}
                      </p>
                      <p className="text-text-secondary text-body">
                        {exp.company || ""}
                        {exp.location ? ` • ${exp.location}` : ""}
                      </p>
                    </div>
                    <p className="text-text-secondary text-body whitespace-nowrap">
                      {exp.startDate} – {exp.endDate || "Present"}
                    </p>
                  </div>
                  {exp.responsibilities?.length > 0 && (
                    <ul className="list-disc ml-5 mt-2 text-body text-text-primary space-y-1">
                      {exp.responsibilities
                        .filter((r) => r && typeof r === "string" && r.trim())
                        .map((resp, j) => (
                          <li key={j}>{resp}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );

      case "education":
        return education.length > 0 && (
          <Section key={id} title="Education">
            <div className="space-y-4">
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-text-primary text-body">
                        {edu.degree}
                      </p>
                      <p className="text-text-secondary text-body">{edu.institution}</p>
                      {edu.location && (
                        <p className="text-text-secondary text-body">{edu.location}</p>
                      )}
                    </div>
                    <p className="text-text-secondary text-body whitespace-nowrap">
                      {edu.startDate} – {edu.endDate}
                    </p>
                  </div>
                  {edu.gpa && (
                    <p className="text-text-secondary text-body mt-1">GPA: {edu.gpa}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        );

      case "skills":
        return (skills.technical.length > 0 || skills.soft.length > 0) && (
          <Section key={id} title="Core Skills">
            <div className="grid grid-cols-1 gap-2 text-body">
              {skills.technical.length > 0 && (
                <div>
                  <span className="font-semibold text-text-primary">Technical:</span>{" "}
                  <span className="text-text-secondary">{skills.technical.join(", ")}</span>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <span className="font-semibold text-text-primary">Soft Skills:</span>{" "}
                  <span className="text-text-secondary">{skills.soft.join(", ")}</span>
                </div>
              )}
            </div>
          </Section>
        );

      case "projects":
        return projects.length > 0 && (
          <Section key={id} title="Projects">
            <div className="space-y-4">
              {projects.map((project, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-text-primary text-body">
                        {project.name}
                      </p>
                      {project.technologies && (
                        <p className="text-text-secondary text-body">
                          {project.technologies}
                        </p>
                      )}
                      {project.description && (
                        <div className="text-text-primary text-body mt-1">
                          {/* Handle description as separate bullets if newline chars exist */}
                          {project.description.includes('\n') ? (
                            <ul className="list-disc ml-5 space-y-1">
                              {project.description.split('\n').filter(line => line.trim()).map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                            </ul>
                          ) : (
                            // Single line description
                            <p>{project.description}</p>
                          )}
                        </div>
                      )}
                    </div>
  
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-mint text-body hover:underline"
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );

      default:
        // Check for Custom Section
        if (id.startsWith('custom-')) {
          const section = resumeData.customSections?.[id];
          if (section && section.items?.length > 0) {
            return (
              <Section key={id} title={section.title}>
                <ul className="list-disc ml-5 text-body space-y-1 text-text-primary">
                  {section.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </Section>
            );
          }
        }
        return null;
    }
  };

  // Ensure we use the prop passed from App.jsx, or fallback
  const finalSectionOrder = props.sectionOrder || ["experience", "education", "skills", "projects"];

  return (
    <PreviewWrapper>
      <div
        id="resume-preview"
        className="text-gray-900 leading-relaxed bg-white h-full"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            {personal.fullName}
          </h1>
  
          <div className="flex flex-wrap justify-center gap-4 text-sm text-text-secondary mt-3">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {personal.location && <span>{personal.location}</span>}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                className="text-accent-mint hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            )}
            {personal.portfolio && (
              <a
                href={personal.portfolio}
                className="text-accent-mint hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>
  
        {/* SUMMARY (Fixed position typical for resumes) */}
        {personal.summary && (
          <Section title="Professional Summary">
            <p className="text-text-primary text-body">{personal.summary}</p>
          </Section>
        )}

        {/* DYNAMIC SECTIONS */}
        {/* DYNAMIC SECTIONS */}
        {finalSectionOrder.map(id => renderSection(id))}

        {/* CERTIFICATIONS (Legacy/Extra) */}
        {certifications.length > 0 && (
          <Section title="Certifications">
            <ul className="list-disc ml-5 text-body space-y-1">
              {certifications.map((cert, idx) => (
                <li key={idx}>
                  <span className="font-semibold text-text-primary">{cert.name}</span>
                  {cert.issuer && <span className="text-text-secondary"> — {cert.issuer}</span>}
                  {cert.date && <span className="text-text-secondary"> ({cert.date})</span>}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </PreviewWrapper>
  );
}
