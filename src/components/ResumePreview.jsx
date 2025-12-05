import React from "react";

export default function ResumePreview({ resumeData }) {
  const { personal, education, experience, skills, projects, certifications } =
    resumeData;

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 border-b pb-1 mb-3 tracking-wide">
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

  return (
    <div
      id="resume-preview"
      className="bg-white p-8 text-gray-900 leading-relaxed"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* -----------------------------------------------------------
         HEADER
      ------------------------------------------------------------ */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {personal.fullName}
        </h1>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 mt-3">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              className="text-blue-700 hover:underline"
              target="_blank"
            >
              LinkedIn
            </a>
          )}
          {personal.portfolio && (
            <a
              href={personal.portfolio}
              className="text-blue-700 hover:underline"
              target="_blank"
            >
              Portfolio
            </a>
          )}
        </div>
      </div>

      {/* -----------------------------------------------------------
         SUMMARY
      ------------------------------------------------------------ */}
      {personal.summary && (
        <Section title="Professional Summary">
          <p className="text-gray-800 text-sm">{personal.summary}</p>
        </Section>
      )}

      {/* -----------------------------------------------------------
         SKILLS
      ------------------------------------------------------------ */}
      {(skills.technical.length > 0 || skills.soft.length > 0) && (
        <Section title="Core Skills">
          <div className="grid grid-cols-1 gap-2 text-sm">
            {skills.technical.length > 0 && (
              <div>
                <span className="font-semibold">Technical:</span>{" "}
                {skills.technical.join(", ")}
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <span className="font-semibold">Soft Skills:</span>{" "}
                {skills.soft.join(", ")}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* -----------------------------------------------------------
         EXPERIENCE
      ------------------------------------------------------------ */}
      {experience.length > 0 && (
        <Section title="Professional Experience">
          <div className="space-y-5">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {exp.title || "Role"}
                    </p>
                    <p className="text-gray-700 text-sm">
                      {exp.company || ""}
                      {exp.location ? ` • ${exp.location}` : ""}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-nowrap">
                    {exp.startDate} – {exp.endDate || "Present"}
                  </p>
                </div>

                {exp.responsibilities?.length > 0 && (
                  <ul className="list-disc ml-5 mt-2 text-sm text-gray-800 space-y-1">
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
      )}

      {/* -----------------------------------------------------------
         EDUCATION
      ------------------------------------------------------------ */}
      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {edu.degree}
                    </p>
                    <p className="text-gray-700 text-sm">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-gray-600 text-sm">{edu.location}</p>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm whitespace-nowrap">
                    {edu.startDate} – {edu.endDate}
                  </p>
                </div>
                {edu.gpa && (
                  <p className="text-gray-700 text-sm mt-1">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* -----------------------------------------------------------
         PROJECTS
      ------------------------------------------------------------ */}
      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-4">
            {projects.map((project, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {project.name}
                    </p>
                    {project.technologies && (
                      <p className="text-gray-700 text-sm">
                        {project.technologies}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-gray-800 text-sm mt-1">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-700 text-sm hover:underline"
                    >
                      View →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* -----------------------------------------------------------
         CERTIFICATIONS
      ------------------------------------------------------------ */}
      {certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="list-disc ml-5 text-sm space-y-1">
            {certifications.map((cert, idx) => (
              <li key={idx}>
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span> — {cert.issuer}</span>}
                {cert.date && <span> ({cert.date})</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
