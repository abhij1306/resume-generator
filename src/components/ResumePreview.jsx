import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

const ResumePreview = ({ resumeData }) => {
    const { personal, education, experience, skills, certifications, projects } = resumeData

    return (
        <div id="resume-preview" className="bg-white p-8 text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
            {/* Header Section */}
            {personal.fullName && (
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 border-b-2 border-gray-300 pb-2">
                        {personal.fullName}
                    </h1>

                    {/* Contact Information */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-700 mt-4">
                        {personal.location && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <MapPin className="w-4 h-4 text-gray-600" />
                                <span>{personal.location}</span>
                            </div>
                        )}
                        {personal.email && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <Mail className="w-4 h-4 text-gray-600" />
                                <span className="truncate max-w-[250px]">{personal.email}</span>
                            </div>
                        )}
                        {personal.phone && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <Phone className="w-4 h-4 text-gray-600" />
                                <span>{personal.phone}</span>
                            </div>
                        )}
                        {personal.linkedin && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <Linkedin className="w-4 h-4 text-gray-600" />
                                <span className="truncate max-w-[250px]">{personal.linkedin}</span>
                            </div>
                        )}
                        {personal.portfolio && (
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                <Globe className="w-4 h-4 text-gray-600" />
                                <span className="truncate max-w-[250px]">{personal.portfolio}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Professional Summary */}
            {personal.summary && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                        Professional Summary
                    </h2>
                    <p className="text-gray-800 leading-relaxed text-sm">{personal.summary}</p>
                </div>
            )}

            {/* Core Competencies / Skills */}
            {(skills.technical.length > 0 || skills.soft.length > 0) && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                        Core Competencies
                    </h2>
                    <div className="space-y-2">
                        {skills.technical.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="font-semibold text-gray-900">Technical Skills:</span>
                                <div className="mt-1 text-gray-700">
                                    {skills.technical.join(' • ')}
                                </div>
                            </div>
                        )}
                        {skills.soft.length > 0 && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <span className="font-semibold text-gray-900">Soft Skills:</span>
                                <div className="mt-1 text-gray-700">
                                    {skills.soft.join(' • ')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                        Professional Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-gray-300 pl-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{exp.title}</h3>
                                        <p className="text-gray-700">{exp.company}</p>
                                        {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                                    </div>
                                    <div className="text-right text-gray-600 text-sm">
                                        {exp.startDate} – {exp.endDate || 'Present'}
                                    </div>
                                </div>
                                {exp.responsibilities && exp.responsibilities.length > 0 && (
                                    <ul className="list-disc list-outside ml-5 mt-2 space-y-1">
                                        {exp.responsibilities.filter(r => r.trim()).map((resp, idx) => (
                                            <li key={idx} className="text-gray-800 text-sm">{resp}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="border-l-2 border-gray-300 pl-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                        <p className="text-gray-700">{edu.institution}</p>
                                        {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                                    </div>
                                    <div className="text-right text-gray-600 text-sm">
                                        {edu.startDate} – {edu.endDate}
                                    </div>
                                </div>
                                {edu.gpa && <div className="text-gray-600 text-sm mt-1">GPA: {edu.gpa}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map((project, index) => (
                            <div key={index} className="border-l-2 border-gray-300 pl-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900">{project.name}</h3>
                                        {project.technologies && (
                                            <p className="text-gray-700 text-sm">Technologies: {project.technologies}</p>
                                        )}
                                        {project.description && (
                                            <p className="text-gray-800 text-sm mt-1">{project.description}</p>
                                        )}
                                    </div>
                                    {project.link && (
                                        <div className="text-right text-gray-600 text-sm">
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                View Project →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide border-l-4 border-blue-600 pl-3">
                        Certifications
                    </h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        {certifications.map((cert, index) => (
                            <li key={index} className="text-gray-800">
                                <span className="font-semibold">{cert.name}</span>
                                {cert.issuer && <span className="text-gray-700"> — {cert.issuer}</span>}
                                {cert.date && <span className="text-gray-600 text-sm"> ({cert.date})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Empty State */}
            {!personal.fullName && (
                <div className="text-center py-16 text-gray-400">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-xl font-semibold mb-2">Resume Preview</p>
                    <p className="text-gray-500">Start filling out the form to see your resume preview</p>
                </div>
            )}
        </div>
    )
}

export default ResumePreview
