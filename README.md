# Resume Generator

ATS-friendly resume generator built with React, Vite, and Tailwind CSS. Create professional resumes with live preview and export to PDF.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## Features

- **Step-by-step form** with 5 sections: Personal Info, Experience, Education, Skills, Projects
- **Live preview** that updates in real-time
- **PDF export** with ATS-friendly formatting
- **JSON import/export** for data portability
- **Resume file upload** (DOCX, TXT support)
- **Progress tracking** with completion indicators

## Quick Start

```bash
# Clone repository
git clone https://github.com/abhij1306/resume-generator.git
cd resume-generator

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173/resume-generator/` in your browser.

## Usage

1. Fill in your information across 5 steps
2. Preview updates automatically on the right panel
3. Click "Download PDF" to export your resume
4. Use "Export JSON" to save your data for later

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **jsPDF** - PDF generation
- **Mammoth.js** - DOCX parsing
- **Lucide React** - Icons

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## License

MIT License - see [LICENSE](LICENSE) file for details.
