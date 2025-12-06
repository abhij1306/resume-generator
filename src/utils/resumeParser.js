import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import { parseResumeWithAI } from './aiResumeParser'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const strings = textContent.items.map(item => item.str)
        fullText += strings.join(' ') + '\n'
    }
    return fullText
}

export async function extractTextFromDOCX(file) {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
}

// Extract text from TXT
export async function extractTextFromTXT(file) {
    return await file.text()
}

// Parse resume text and extract structured data
export function parseResumeText(text) {
    const resumeData = {
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
    }

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/)
    if (emailMatch) {
        resumeData.personal.email = emailMatch[0]
    }

    // Extract phone number (various formats)
    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    if (phoneMatch) {
        resumeData.personal.phone = phoneMatch[0]
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/)
    if (linkedinMatch) {
        resumeData.personal.linkedin = linkedinMatch[0]
    }

    // Extract name (first line that's not email/phone, usually capitalized)
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
    for (const line of lines.slice(0, 5)) {
        if (!line.includes('@') && !line.match(/\d{3}/) && line.length > 3 && line.length < 50) {
            // Check if it looks like a name (mostly letters and spaces)
            if (/^[A-Z][a-zA-Z\s.'-]+$/.test(line)) {
                resumeData.personal.fullName = line
                break
            }
        }
    }

    // Extract skills - look for common skill section headers
    const skillsSection = extractSection(text, ['skills', 'technical skills', 'core competencies', 'expertise'])
    if (skillsSection) {
        const skills = skillsSection
            .split(/[,;|\n]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 50)
        resumeData.skills.technical = skills.slice(0, 15) // Limit to 15 skills
    }

    // Extract experience
    const experienceSection = extractSection(text, ['experience', 'work experience', 'employment', 'professional experience'])
    if (experienceSection) {
        const experiences = parseExperience(experienceSection)
        resumeData.experience = experiences
    }

    // Extract education
    const educationSection = extractSection(text, ['education', 'academic background', 'qualifications'])
    if (educationSection) {
        const educations = parseEducation(educationSection)
        resumeData.education = educations
    }

    // Extract summary/objective
    const summarySection = extractSection(text, ['summary', 'professional summary', 'objective', 'profile', 'about'])
    if (summarySection) {
        resumeData.personal.summary = summarySection.split('\n')[0].substring(0, 500)
    }

    return resumeData
}

// Helper function to extract a section from text
function extractSection(text, headers) {
    const lowerText = text.toLowerCase()

    for (const header of headers) {
        const regex = new RegExp(`\\b${header}\\b[:\\s]*([\\s\\S]*?)(?=\\n\\s*\\n[A-Z]|$)`, 'i')
        const match = lowerText.match(regex)

        if (match) {
            const startIndex = match.index
            const endIndex = startIndex + match[0].length
            return text.substring(startIndex, endIndex).replace(new RegExp(`^${header}[:\\s]*`, 'i'), '').trim()
        }
    }

    return null
}

// Parse experience section
function parseExperience(text) {
    const experiences = []
    const lines = text.split('\n').filter(l => l.trim())

    let currentExp = null

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Look for date patterns (e.g., "2020 - 2023", "Jan 2020 - Present")
        const dateMatch = line.match(/(\d{4}|[A-Z][a-z]{2}\s+\d{4})\s*[-–—]\s*(\d{4}|[A-Z][a-z]{2}\s+\d{4}|Present|Current)/i)

        if (dateMatch && i > 0) {
            // Previous line might be the job title
            const prevLine = lines[i - 1].trim()

            if (currentExp) {
                experiences.push(currentExp)
            }

            currentExp = {
                title: prevLine.length < 100 ? prevLine : '',
                company: '',
                location: '',
                startDate: dateMatch[1],
                endDate: dateMatch[2],
                responsibilities: []
            }
        } else if (currentExp && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
            // This is a responsibility bullet point
            currentExp.responsibilities.push(line.replace(/^[•\-*]\s*/, ''))
        }
    }

    if (currentExp) {
        experiences.push(currentExp)
    }

    return experiences.slice(0, 5) // Limit to 5 experiences
}

// Parse education section
function parseEducation(text) {
    const educations = []
    const lines = text.split('\n').filter(l => l.trim())

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Look for degree patterns
        if (/(bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|associate)/i.test(line)) {
            const dateMatch = text.match(/(\d{4})\s*[-–—]\s*(\d{4}|Present)/i)

            educations.push({
                degree: line.substring(0, 100),
                institution: i + 1 < lines.length ? lines[i + 1].substring(0, 100) : '',
                location: '',
                startDate: dateMatch ? dateMatch[1] : '',
                endDate: dateMatch ? dateMatch[2] : '',
                gpa: ''
            })
        }
    }

    return educations.slice(0, 3) // Limit to 3 education entries
}

// Main function to extract resume data from file
export async function extractResumeFromFile(file) {
    let text = ''

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    try {
        console.log('Extracting resume from file:', fileName, fileType)

        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            console.log('Processing PDF file...')
            text = await extractTextFromPDF(file)
            console.log('PDF text extracted, length:', text.length)
        } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
            console.log('Processing DOCX file...')
            text = await extractTextFromDOCX(file)
        } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
            console.log('Processing TXT file...')
            text = await extractTextFromTXT(file)
        } else {
            throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.')
        }

        console.log('Raw text preview:', text.substring(0, 200))

        // Try AI parsing first
        const aiResult = await parseResumeWithAI(text)
        if (aiResult) {
            console.log('✅ Using AI-parsed resume data')
            return aiResult
        }

        // Fallback to regex parsing
        console.log('ℹ️ Falling back to regex parsing')
        return parseResumeText(text)
    } catch (error) {
        console.error('Error extracting resume:', error)
        throw error
    }
}
