import jsPDF from 'jspdf'

export function generateLatexStylePDF(resumeData) {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15 // 0.6 inch = ~15mm
    const contentWidth = pageWidth - (2 * margin)
    let yPos = margin

    // Define colors
    const titleBlue = [0, 51, 102] // RGB(0,51,102)

    // Helper function to add text with word wrap
    const addText = (text, x, y, maxWidth, fontSize = 11, isBold = false, color = [0, 0, 0]) => {
        pdf.setFontSize(fontSize)
        pdf.setFont('times', isBold ? 'bold' : 'normal')
        pdf.setTextColor(color[0], color[1], color[2])
        const lines = pdf.splitTextToSize(text, maxWidth)
        pdf.text(lines, x, y)
        return y + (lines.length * fontSize * 0.35) // Return new Y position
    }

    // Helper function to add section header
    const addSectionHeader = (title, y) => {
        pdf.setFontSize(12)
        pdf.setFont('times', 'bold')
        pdf.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2])
        pdf.text(title.toUpperCase(), margin, y)

        // Add horizontal line
        pdf.setDrawColor(titleBlue[0], titleBlue[1], titleBlue[2])
        pdf.setLineWidth(0.5)
        pdf.line(margin, y + 1, pageWidth - margin, y + 1)

        return y + 6 // Return position after header
    }

    // Header - Name
    if (resumeData.personal.fullName) {
        pdf.setFontSize(18)
        pdf.setFont('times', 'bold')
        pdf.setTextColor(titleBlue[0], titleBlue[1], titleBlue[2])
        const nameWidth = pdf.getTextWidth(resumeData.personal.fullName)
        pdf.text(resumeData.personal.fullName, (pageWidth - nameWidth) / 2, yPos)
        yPos += 8

        // Contact Information
        pdf.setFontSize(9)
        pdf.setFont('times', 'normal')
        pdf.setTextColor(0, 0, 0)

        const contactParts = []
        if (resumeData.personal.location) contactParts.push(resumeData.personal.location)
        if (resumeData.personal.email) contactParts.push(resumeData.personal.email)
        if (resumeData.personal.phone) contactParts.push(resumeData.personal.phone)
        if (resumeData.personal.linkedin) contactParts.push(resumeData.personal.linkedin)

        const contactText = contactParts.join(' | ')
        const contactWidth = pdf.getTextWidth(contactText)
        pdf.text(contactText, (pageWidth - contactWidth) / 2, yPos)
        yPos += 8
    }

    // Professional Summary
    if (resumeData.personal.summary) {
        yPos = addSectionHeader('Professional Summary', yPos)
        yPos = addText(resumeData.personal.summary, margin, yPos, contentWidth, 11) + 4
    }

    // Core Competencies / Skills
    if (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) {
        yPos = addSectionHeader('Core Competencies', yPos)

        if (resumeData.skills.technical.length > 0) {
            const techSkills = 'Technical Skills: ' + resumeData.skills.technical.join(', ')
            yPos = addText(techSkills, margin, yPos, contentWidth, 11) + 2
        }

        if (resumeData.skills.soft.length > 0) {
            const softSkills = 'Soft Skills: ' + resumeData.skills.soft.join(', ')
            yPos = addText(softSkills, margin, yPos, contentWidth, 11) + 2
        }
        yPos += 2
    }

    // Professional Experience
    if (resumeData.experience.length > 0) {
        yPos = addSectionHeader('Professional Experience', yPos)

        resumeData.experience.forEach((exp, index) => {
            // Check if we need a new page
            if (yPos > pageHeight - 40) {
                pdf.addPage()
                yPos = margin
            }

            // Company name and location
            pdf.setFontSize(11)
            pdf.setFont('times', 'bold')
            pdf.setTextColor(0, 0, 0)
            let companyText = exp.company
            if (exp.location) companyText += ' — ' + exp.location
            pdf.text(companyText, margin, yPos)
            yPos += 5

            // Title and dates
            pdf.setFont('times', 'italic')
            pdf.text(exp.title, margin, yPos)

            const dateText = `${exp.startDate} – ${exp.endDate || 'Present'}`
            const dateWidth = pdf.getTextWidth(dateText)
            pdf.text(dateText, pageWidth - margin - dateWidth, yPos)
            yPos += 5

            // Responsibilities
            if (exp.responsibilities && exp.responsibilities.length > 0) {
                pdf.setFont('times', 'normal')
                exp.responsibilities.filter(r => r.trim()).forEach(resp => {
                    if (yPos > pageHeight - 20) {
                        pdf.addPage()
                        yPos = margin
                    }

                    // Add bullet point
                    pdf.text('•', margin + 2, yPos)

                    // Add responsibility text with word wrap
                    const lines = pdf.splitTextToSize(resp, contentWidth - 8)
                    pdf.text(lines, margin + 6, yPos)
                    yPos += lines.length * 4
                })
            }
            yPos += 3
        })
    }

    // Education
    if (resumeData.education.length > 0) {
        if (yPos > pageHeight - 40) {
            pdf.addPage()
            yPos = margin
        }

        yPos = addSectionHeader('Education', yPos)

        resumeData.education.forEach(edu => {
            if (yPos > pageHeight - 30) {
                pdf.addPage()
                yPos = margin
            }

            // Institution
            pdf.setFontSize(11)
            pdf.setFont('times', 'bold')
            pdf.setTextColor(0, 0, 0)
            pdf.text(edu.institution, margin, yPos)
            yPos += 5

            // Degree and dates
            pdf.setFont('times', 'normal')
            pdf.text(edu.degree, margin, yPos)

            if (edu.startDate && edu.endDate) {
                const dateText = `${edu.startDate} – ${edu.endDate}`
                const dateWidth = pdf.getTextWidth(dateText)
                pdf.text(dateText, pageWidth - margin - dateWidth, yPos)
            }
            yPos += 5

            if (edu.location) {
                pdf.setFontSize(9)
                pdf.text(edu.location, margin, yPos)
                yPos += 4
            }

            if (edu.gpa) {
                pdf.setFontSize(9)
                pdf.text(`GPA: ${edu.gpa}`, margin, yPos)
                yPos += 4
            }
            yPos += 2
        })
    }

    // Projects
    if (resumeData.projects.length > 0) {
        if (yPos > pageHeight - 40) {
            pdf.addPage()
            yPos = margin
        }

        yPos = addSectionHeader('Projects', yPos)

        resumeData.projects.forEach(project => {
            if (yPos > pageHeight - 30) {
                pdf.addPage()
                yPos = margin
            }

            // Project name
            pdf.setFontSize(11)
            pdf.setFont('times', 'bold')
            pdf.setTextColor(0, 0, 0)
            pdf.text(project.name, margin, yPos)
            yPos += 5

            // Technologies
            if (project.technologies) {
                pdf.setFont('times', 'normal')
                const techText = 'Technologies: ' + project.technologies
                yPos = addText(techText, margin, yPos, contentWidth, 11) + 2
            }

            // Description
            if (project.description) {
                // If contains newlines, treat as bullet points
                if (project.description.includes('\n')) {
                    pdf.setFont('times', 'normal')
                    project.description.split('\n').filter(line => line.trim()).forEach(line => {
                        if (yPos > pageHeight - 20) {
                            pdf.addPage()
                            yPos = margin
                        }
                        pdf.text('•', margin + 2, yPos)
                        const lines = pdf.splitTextToSize(line, contentWidth - 8)
                        pdf.text(lines, margin + 6, yPos)
                        yPos += lines.length * 4
                    })
                    yPos += 2 // Extra spacing after list
                } else {
                    // Fallback for old single-line descriptions
                    pdf.setFont('times', 'normal')
                    yPos = addText(project.description, margin, yPos, contentWidth, 11) + 3
                }
            }
        })
    }

    // Certifications
    if (resumeData.certifications.length > 0) {
        if (yPos > pageHeight - 40) {
            pdf.addPage()
            yPos = margin
        }

        yPos = addSectionHeader('Certifications', yPos)

        resumeData.certifications.forEach(cert => {
            if (yPos > pageHeight - 15) {
                pdf.addPage()
                yPos = margin
            }

            pdf.setFontSize(11)
            pdf.setFont('times', 'normal')
            pdf.setTextColor(0, 0, 0)

            // Add bullet point
            pdf.text('•', margin + 2, yPos)

            // Certification text
            let certText = cert.name
            if (cert.issuer) certText += ' — ' + cert.issuer
            if (cert.date) certText += ' (' + cert.date + ')'

            const lines = pdf.splitTextToSize(certText, contentWidth - 8)
            pdf.text(lines, margin + 6, yPos)
            yPos += lines.length * 5
        })
    }

    return pdf
}
