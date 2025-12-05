# 🚀 Resume Generator App

A modern, beautiful, and user-friendly resume generator built with React and Vite. Create professional resumes in minutes with a sleek interface inspired by top resume builders.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Resume Generator Preview](https://img.shields.io/badge/Demo-Live%20Preview-blue?style=for-the-badge)

## ✨ Features

### 🎨 **Modern Design**
- **ResumeNow-style layout** with professional two-panel design
- **Sticky header** with progress tracking
- **Responsive design** that works on all devices
- **Beautiful animations** and smooth transitions

### 📝 **Complete Resume Builder**
- **5 Essential Sections**: Personal Info, Experience, Education, Skills, Projects
- **Step-by-step navigation** with visual progress indicators
- **Real-time preview** that updates as you type
- **Character counters** for professional summaries

### 📤 **Multiple Import Options**
- **LinkedIn Profile Import** (ready for API integration)
- **Resume File Upload** (DOCX, TXT support)
- **JSON Import/Export** for data portability
- **Copy & Paste JSON** for direct input

### 📄 **Export Options**
- **PDF Generation** with professional formatting
- **JSON Export** for data backup and sharing
- **ATS-friendly** resume format

### 🎯 **User Experience**
- **Progress tracking** (1/5, 2/5, etc.)
- **Completion indicators** with checkmarks
- **Validation warnings** for required fields
- **Success messages** after PDF generation

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhij1306/resume-generator.git
   cd resume-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Usage

### Building Your Resume

1. **Personal Information** (Step 1/5)
   - Fill in your full name, email, and phone number (required)
   - Add location, LinkedIn, portfolio/website
   - Write a professional summary (with character counter)

2. **Work Experience** (Step 2/5)
   - Add multiple job experiences
   - Include job title, company, location, dates
   - Add detailed responsibilities with bullet points

3. **Education** (Step 3/5)
   - Add degrees, institutions, and locations
   - Include start/end dates and GPA (optional)

4. **Skills** (Step 4/5)
   - Add technical skills (programming languages, tools)
   - Add soft skills (communication, leadership)
   - Remove skills with one click

5. **Projects** (Step 5/5)
   - Showcase your projects and certifications
   - Include technologies used and descriptions
   - Add project links

### Exporting Your Resume

- **Download PDF**: Click "Download PDF" to generate a professional PDF
- **Export JSON**: Click "Export JSON" to save your data
- **Import Data**: Use "Import Data" to load existing information

## 🏗️ Project Structure

```
resume-generator/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ResumeForm.jsx  # Main form component
│   │   └── ResumePreview.jsx # Live preview component
│   ├── utils/             # Utility functions
│   │   ├── pdfGenerator.js # PDF generation logic
│   │   └── resumeParser.js # Resume parsing utilities
│   ├── App.jsx            # Main App component
│   ├── App.css            # App-specific styles
│   └── main.jsx           # Entry point
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## 🎨 Screenshots

### Modern Interface
![Interface Preview](https://via.placeholder.com/800x450?text=Modern+Interface+Preview)

### Live Preview
![Live Preview](https://via.placeholder.com/400x450?text=Live+Preview)

### Progress Tracking
![Progress](https://via.placeholder.com/400x450?text=Progress+Tracking)

## 📦 Technologies Used

### Frontend Stack
- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons

### PDF Generation
- **jsPDF** - PDF document generation
- **jsPDF AutoTable** - Table generation in PDFs
- **html2canvas** - HTML to canvas conversion

### Document Processing
- **Mammoth.js** - DOCX to HTML conversion
- **PDF.js** - PDF parsing capabilities

## 🚀 Deployment

### GitHub Pages
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run preview
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: dist
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Adding New Features

1. Create a new component in `src/components/`
2. Add it to the main App.jsx
3. Update the steps array if needed
4. Run `npm run dev` to test

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Commit** your changes (`git commit -m 'Add amazing feature'`)
5. **Push** to the branch (`git push origin feature/amazing-feature`)
6. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - For the amazing UI library
- [Vite](https://vite.dev/) - For the blazing-fast build tool
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [jsPDF](https://parall.ax/products/jspdf) - For PDF generation
- [Lucide](https://lucide.dev/) - For beautiful icons

## 📞 Support

If you have any questions or suggestions, please:
- [Open an issue](https://github.com/abhij1306/resume-generator/issues)
- [Start a discussion](https://github.com/abhij1306/resume-generator/discussions)

---

**Made with ❤️ by [abhij1306](https://github.com/abhij1306)**

⭐ **If you like this project, please give it a star!**
