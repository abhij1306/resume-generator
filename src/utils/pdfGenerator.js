import jsPDF from 'jspdf'

export function generateLatexStylePDF(resumeData) {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 19 // ~0.75 inch (matches preview)
    const contentWidth = pageWidth - (2 * margin)
    let yPos = margin

    // Define colors
    const titleColor = [34, 40, 49] // #222831
    const textColor = [34, 40, 49] // #222831
    const subTextColor = [107, 114, 128] // #6B7280

    // Helper: Add text with auto-wrapping
    const addText = (text, x, y, maxWidth, fontSize = 9, fontStyle = 'normal', color = textColor, align = 'left') => {
        pdf.setFontSize(fontSize)
        pdf.setFont('helvetica', fontStyle)
        pdf.setTextColor(color[0], color[1], color[2])

        if (align === 'center') {
            pdf.text(text, pageWidth / 2, y, { align: 'center' })
            return y + (fontSize * 0.35) + 2
        }

        const lines = pdf.splitTextToSize(text, maxWidth)
        pdf.text(lines, x, y)
        return y + (lines.length * fontSize * 0.35) + 2
    }

    // Helper: Add Section Header
    // --- EDUCATION ---
    if (resumeData.education.length > 0) {
        yPos = addSectionHeader('Education', yPos)

        resumeData.education.forEach(edu => {
            if (yPos > pageHeight - 30) { pdf.addPage(); yPos = margin }

            // Degree & Date
            pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(titleColor[0], titleColor[1], titleColor[2])
            pdf.text(edu.degree, margin, yPos)

            if (edu.startDate) {
                const dateText = `${edu.startDate} – ${edu.endDate || 'Present'}`
                pdf.setFont('helvetica', 'normal'); pdf.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2])
                pdf.text(dateText, pageWidth - margin - pdf.getTextWidth(dateText), yPos)
            }
            yPos += 5

            // Institution
            pdf.setFontSize(11); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(textColor[0], textColor[1], textColor[2])
            let instText = edu.institution
            if (edu.location) instText += `, ${edu.location}`
            pdf.text(instText, margin, yPos)
            yPos += 5

            if (edu.gpa) {
                pdf.setFontSize(10); pdf.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2])
                pdf.text(`GPA: ${edu.gpa}`, margin, yPos)
                yPos += 5
            }
            yPos += 2
        })
    }

    // --- SKILLS ---
    if (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) {
        yPos = addSectionHeader('Skills', yPos)

        if (resumeData.skills.technical.length > 0) {
            if (yPos > pageHeight - 20) { pdf.addPage(); yPos = margin }

            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold'); pdf.setTextColor(titleColor[0], titleColor[1], titleColor[2])
            pdf.text("Technical:", margin, yPos)

            pdf.setFont('helvetica', 'normal'); pdf.setTextColor(textColor[0], textColor[1], textColor[2])
            const techText = resumeData.skills.technical.join(', ')
            const lines = pdf.splitTextToSize(techText, contentWidth - 25)
            pdf.text(lines, margin + 22, yPos)
            yPos += (lines.length * 5) + 2
        }

        if (resumeData.skills.soft.length > 0) {
            if (yPos > pageHeight - 20) { pdf.addPage(); yPos = margin }

            pdf.setFont('helvetica', 'bold'); pdf.setTextColor(titleColor[0], titleColor[1], titleColor[2])
            pdf.text("Soft Skills:", margin, yPos)

            pdf.setFont('helvetica', 'normal'); pdf.setTextColor(textColor[0], textColor[1], textColor[2])
            const softText = resumeData.skills.soft.join(', ')
            const lines = pdf.splitTextToSize(softText, contentWidth - 25)
            pdf.text(lines, margin + 22, yPos)
            yPos += (lines.length * 5) + 2
        }
    }

    // --- PROJECTS ---
    if (resumeData.projects.length > 0) {
        yPos = addSectionHeader('Projects', yPos)

        resumeData.projects.forEach(proj => {
            if (yPos > pageHeight - 30) { pdf.addPage(); yPos = margin }

            // Name & Link
            pdf.setFontSize(11); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(titleColor[0], titleColor[1], titleColor[2])
            pdf.text(proj.name, margin, yPos)
            yPos += 5

            if (proj.technologies) {
                pdf.setFontSize(10); pdf.setFont('helvetica', 'italic'); pdf.setTextColor(subTextColor[0], subTextColor[1], subTextColor[2])
                pdf.text(proj.technologies, margin, yPos)
                yPos += 5
            }

            if (proj.description) {
                pdf.setFontSize(11); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(textColor[0], textColor[1], textColor[2])

                if (proj.description.includes('\n')) {
                    proj.description.split('\n').filter(l => l.trim()).forEach(line => {
                        if (yPos > pageHeight - 15) { pdf.addPage(); yPos = margin }
                        pdf.text('•', margin + 2, yPos)
                        const lines = pdf.splitTextToSize(line, contentWidth - 8)
                        pdf.text(lines, margin + 6, yPos)
                        yPos += lines.length * 4.5
                    })
                } else {
                    const lines = pdf.splitTextToSize(proj.description, contentWidth)
                    pdf.text(lines, margin, yPos)
                    yPos += lines.length * 4.5
                }
                yPos += 3
            }
            yPos += 3
        })
    }

    // --- CERTIFICATIONS ---
    if (resumeData.certifications.length > 0) {
        yPos = addSectionHeader('Certifications', yPos)
        resumeData.certifications.forEach(cert => {
            if (yPos > pageHeight - 15) { pdf.addPage(); yPos = margin }

            pdf.setFontSize(11); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(textColor[0], textColor[1], textColor[2])

            let text = `•  ${cert.name}`
            if (cert.issuer) text += ` — ${cert.issuer}`
            if (cert.date) text += ` (${cert.date})`

            const lines = pdf.splitTextToSize(text, contentWidth)
            pdf.text(lines, margin, yPos)
            yPos += lines.length * 5
        })
    }

    return pdf
}
