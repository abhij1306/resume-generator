// AI-powered resume parser using OpenRouter
export async function parseResumeWithAI(extractedText) {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || ''

    if (!API_KEY) {
        console.warn('⚠️ No OpenRouter API key found, falling back to basic parser')
        return null
    }

    const prompt = `You are a resume parser. Extract structured data from this resume text and return ONLY a valid JSON object with no markdown formatting or code blocks.

Resume Text:
${extractedText}

Return JSON in this exact format:
{
  "personal": {
    "fullName": "extracted name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State or just City",
    "linkedin": "linkedin.com/in/username",
    "portfolio": "",
    "summary": "professional summary text"
  },
  "experience": [
    {
      "id": "unique-id",
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "responsibilities": ["responsibility 1", "responsibility 2"]
    }
  ],
  "education": [
    {
      "id": "unique-id",
      "degree": "Degree Name",
      "institution": "University Name",
      "startDate": "Year",
      "endDate": "Year",
      "gpa": ""
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": []
  },
  "certifications": [
    {
      "id": "unique-id",
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Month Year"
    }
  ],
  "projects": []
}

IMPORTANT: Generate unique IDs using crypto.randomUUID() format. Extract ALL information accurately, especially location, summary, and certifications.`

    try {
        console.log('🤖 Calling OpenRouter AI to parse resume...')

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
            },
            body: JSON.stringify({
                model: 'qwen/qwen-2.5-72b-instruct',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 4000
            })
        })

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`)
        }

        const data = await response.json()
        const aiResponse = data.choices[0].message.content

        // Clean response - remove markdown code blocks if present
        let jsonText = aiResponse.trim()
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '')
        }

        const parsedData = JSON.parse(jsonText)

        // Generate IDs if not present
        if (parsedData.experience) {
            parsedData.experience.forEach(exp => {
                if (!exp.id) exp.id = crypto.randomUUID()
            })
        }
        if (parsedData.education) {
            parsedData.education.forEach(edu => {
                if (!edu.id) edu.id = crypto.randomUUID()
            })
        }
        if (parsedData.certifications) {
            parsedData.certifications.forEach(cert => {
                if (!cert.id) cert.id = crypto.randomUUID()
            })
        }

        console.log('✅ AI parsing successful!')
        console.log('📍 Location:', parsedData.personal?.location)
        console.log('📝 Summary:', parsedData.personal?.summary?.substring(0, 50) + '...')
        console.log('🎖️ Certifications:', parsedData.certifications?.length || 0)

        return parsedData

    } catch (error) {
        console.error('❌ AI parsing failed:', error)
        return null
    }
}
