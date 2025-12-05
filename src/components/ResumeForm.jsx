import { useState } from 'react'
import { Plus, Trash2, Briefcase, GraduationCap, Award, Code, User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

const ResumeForm = ({ resumeData, setResumeData, currentStep, setCurrentStep, steps }) => {
    const [activeSection, setActiveSection] = useState('personal')

    const updatePersonal = (field, value) => {
        setResumeData(prev => ({
            ...prev,
            personal: { ...prev.personal, [field]: value }
        }))
    }

    const addItem = (section) => {
        const newItem = section === 'education'
            ? { degree: '', institution: '', location: '', startDate: '', endDate: '', gpa: '' }
            : section === 'experience'
                ? { title: '', company: '', location: '', startDate: '', endDate: '', responsibilities: [''] }
                : section === 'projects'
                    ? { name: '', technologies: '', description: '', link: '' }
                    : { name: '', issuer: '', date: '' }

        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }))
    }

    const removeItem = (section, index) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }))
    }

    const updateItem = (section, index, field, value) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }))
    }

    const addResponsibility = (expIndex) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === expIndex ? { ...exp, responsibilities: [...exp.responsibilities, ''] } : exp
            )
        }))
    }

    const updateResponsibility = (expIndex, respIndex, value) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === expIndex ? {
                    ...exp,
                    responsibilities: exp.responsibilities.map((resp, j) => j === respIndex ? value : resp)
                } : exp
            )
        }))
    }

    const removeResponsibility = (expIndex, respIndex) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) =>
                i === expIndex ? {
                    ...exp,
                    responsibilities: exp.responsibilities.filter((_, j) => j !== respIndex)
                } : exp
            )
        }))
    }

    const addSkill = (type) => {
        const skill = prompt(`Enter ${type} skill:`)
        if (skill) {
            setResumeData(prev => ({
                ...prev,
                skills: {
                    ...prev.skills,
                    [type]: [...prev.skills[type], skill]
                }
            }))
        }
    }

    const removeSkill = (type, index) => {
        setResumeData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [type]: prev.skills[type].filter((_, i) => i !== index)
            }
        }))
    }

    const sections = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'projects', label: 'Projects', icon: Award },
        { id: 'certifications', label: 'Certifications', icon: Award }
    ]

    return (
        <div className="space-y-4">
            {/* Personal Information Section */}
            {currentStep === 0 && (
                <>
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                            <p className="text-sm text-gray-500">Required fields marked with *</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Step {currentStep + 1} of 5</div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={resumeData.personal.fullName}
                                onChange={(e) => updatePersonal('fullName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={resumeData.personal.email}
                                onChange={(e) => updatePersonal('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={resumeData.personal.phone}
                                onChange={(e) => updatePersonal('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="+1 234 567 8900"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                value={resumeData.personal.location}
                                onChange={(e) => updatePersonal('location', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="City, Country"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                            <input
                                type="url"
                                value={resumeData.personal.linkedin}
                                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="linkedin.com/in/johndoe"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                            <input
                                type="url"
                                value={resumeData.personal.portfolio}
                                onChange={(e) => updatePersonal('portfolio', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="johndoe.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Professional Summary
                        </label>
                        <div className="relative">
                            <textarea
                                value={resumeData.personal.summary}
                                onChange={(e) => updatePersonal('summary', e.target.value)}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                placeholder="Brief professional summary highlighting your key strengths and career objectives..."
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                {resumeData.personal.summary.length}/500
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Experience Section */}
            {currentStep === 1 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                            <p className="text-sm text-gray-500">Add your work experience and achievements</p>
                        </div>
                        <button
                            onClick={() => addItem('experience')}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </button>
                    </div>

                    {resumeData.experience.map((exp, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-800">Experience {index + 1}</h4>
                                <button
                                    onClick={() => removeItem('experience', index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={exp.title}
                                    onChange={(e) => updateItem('experience', index, 'title', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Job Title"
                                />
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => updateItem('experience', index, 'company', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Company Name"
                                />
                                <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => updateItem('experience', index, 'location', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Location"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={exp.startDate}
                                        onChange={(e) => updateItem('experience', index, 'startDate', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Start (MM/YYYY)"
                                    />
                                    <input
                                        type="text"
                                        value={exp.endDate}
                                        onChange={(e) => updateItem('experience', index, 'endDate', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="End (MM/YYYY)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Key Responsibilities</label>
                                    <button
                                        onClick={() => addResponsibility(index)}
                                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Point
                                    </button>
                                </div>
                                {exp.responsibilities.map((resp, respIndex) => (
                                    <div key={respIndex} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={resp}
                                            onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe your achievement or responsibility..."
                                        />
                                        <button
                                            onClick={() => removeResponsibility(index, respIndex)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {resumeData.experience.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No experience added yet. Click "Add Experience" to get started.</p>
                    )}
                </div>
            )}

            {/* Education Section */}
            {currentStep === 2 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                            <p className="text-sm text-gray-500">List your educational background</p>
                        </div>
                        <button
                            onClick={() => addItem('education')}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Education
                        </button>
                    </div>

                    {resumeData.education.map((edu, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-800">Education {index + 1}</h4>
                                <button
                                    onClick={() => removeItem('education', index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    value={edu.degree}
                                    onChange={(e) => updateItem('education', index, 'degree', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Degree (e.g., B.S. Computer Science)"
                                />
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => updateItem('education', index, 'institution', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Institution Name"
                                />
                                <input
                                    type="text"
                                    value={edu.location}
                                    onChange={(e) => updateItem('education', index, 'location', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Location"
                                />
                                <input
                                    type="text"
                                    value={edu.gpa}
                                    onChange={(e) => updateItem('education', index, 'gpa', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="GPA (optional)"
                                />
                                <input
                                    type="text"
                                    value={edu.startDate}
                                    onChange={(e) => updateItem('education', index, 'startDate', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Start (MM/YYYY)"
                                />
                                <input
                                    type="text"
                                    value={edu.endDate}
                                    onChange={(e) => updateItem('education', index, 'endDate', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="End (MM/YYYY)"
                                />
                            </div>
                        </div>
                    ))}

                    {resumeData.education.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No education added yet. Click "Add Education" to get started.</p>
                    )}
                </div>
            )}

            {/* Skills Section */}
            {currentStep === 3 && (
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                        <p className="text-sm text-gray-500">Highlight your technical and soft skills</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800">Technical Skills</h4>
                                <button
                                    onClick={() => addSkill('technical')}
                                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Skill
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.skills.technical.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill('technical', index)}
                                            className="hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {resumeData.skills.technical.length === 0 && (
                                    <p className="text-gray-500 text-sm">No technical skills added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800">Soft Skills</h4>
                                <button
                                    onClick={() => addSkill('soft')}
                                    className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm transition-all"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Skill
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {resumeData.skills.soft.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                    >
                                        {skill}
                                        <button
                                            onClick={() => removeSkill('soft', index)}
                                            className="hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                                {resumeData.skills.soft.length === 0 && (
                                    <p className="text-gray-500 text-sm">No soft skills added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Section */}
            {currentStep === 4 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                            <p className="text-sm text-gray-500">Showcase your projects and certifications</p>
                        </div>
                        <button
                            onClick={() => addItem('projects')}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Add Project
                        </button>
                    </div>

                    {resumeData.projects.map((project, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-3">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-800">Project {index + 1}</h4>
                                <button
                                    onClick={() => removeItem('projects', index)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="grid gap-3">
                                <input
                                    type="text"
                                    value={project.name}
                                    onChange={(e) => updateItem('projects', index, 'name', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Project Name"
                                />
                                <input
                                    type="text"
                                    value={project.technologies}
                                    onChange={(e) => updateItem('projects', index, 'technologies', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                                />
                                <textarea
                                    value={project.description}
                                    onChange={(e) => updateItem('projects', index, 'description', e.target.value)}
                                    rows="3"
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Project description and key achievements..."
                                />
                                <input
                                    type="url"
                                    value={project.link}
                                    onChange={(e) => updateItem('projects', index, 'link', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Project Link (optional)"
                                />
                            </div>
                        </div>
                    ))}

                    {resumeData.projects.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No projects added yet. Click "Add Project" to get started.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default ResumeForm
