# Resume Generator

**Live Demo:** [https://abhij1306.github.io/resume-generator/](https://abhij1306.github.io/resume-generator/)

A privacy-focused, ATS-optimized resume builder that lets you craft professional resumes with real-time preview. Built with React and Tailwind CSS, it supports flexible JSON imports and strictly client-side PDF generation—your data never leaves your device.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Key Features

*   **Real-Time Preview:** See your resume update instantly as you type.
*   **ATS-Friendly PDF:** Generates clean, parsed-optimized PDFs compatible with Applicant Tracking Systems.
*   **Privacy First:** All processing happens in your browser. No data is stored on any server.
*   **Flexible Import:** Import existing resume data from JSON (supports multiple formats).
*   **Smart Parsing:** Paste your details or upload a JSON file to populate fields automatically.
*   **Custom Sections:** Add comprehensive details for Experience, Education, Skills, and Projects.

## 🛠️ Tech Stack

*   **Frontend:** React 18, Vite
*   **Styling:** Tailwind CSS v4, Lucide React (Icons)
*   **PDF Generation:** jsPDF
*   **File Handling:** Mammoth.js (for future docx support), Native JSON parsing

## 📦 Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abhij1306/resume-generator.git
    cd resume-generator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Build for production:**
    ```bash
    npm run build
    ```

## 📝 Usage

1.  **Fill Details:** Navigate through the sections (Personal, Experience, etc.) and fill in your information.
2.  **Import Data:** Click "Import Data" to paste JSON or upload a `resume.json` file.
3.  **Preview:** Check the live preview on the right side.
4.  **Download:** Click "Download PDF" to save your ATS-friendly resume.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
