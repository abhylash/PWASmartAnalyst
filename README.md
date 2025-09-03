# Smart CSV Analyst - Professional MNC-Level Data Analysis Platform

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm package manager
- OpenRouter API Key
- Google Gemini API Key

### 1. Clone & Install

```bash
# Navigate to project directory
cd smart-csv-analyst

# Install dependencies
npm install
```

### 2. Configure API Keys

Create a `.env` file in the root directory:

```env
# OpenRouter API Configuration
VITE_OPENROUTER_API_KEY=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

# Google Gemini API Configuration  
VITE_GEMINI_API_KEY=AIzaSyA3CYHHz5uX60gYW2es1oOcT-dbhD-V_II

# Application Configuration
VITE_APP_NAME=Smart CSV Analyst
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

## 📁 Professional Project Architecture

```
smart-csv-analyst/
├── src/
│   ├── components/          # React UI Components
│   │   ├── FileUpload.jsx          # CSV/Excel file upload with drag & drop
│   │   ├── CSVPreview.jsx          # Data preview table (first 10 rows)
│   │   ├── FileSummary.jsx         # AI-powered file analysis & insights
│   │   ├── InsightsViewer.jsx      # Multi-language AI insights display
│   │   ├── InteractiveDashboard.jsx # Real-time data visualization dashboard
│   │   ├── CustomChartBuilder.jsx  # User-controlled chart creation tool
│   │   ├── ChatInterface.jsx       # AI-powered data Q&A interface
│   │   ├── PDFExport.jsx          # Professional MNC-style PDF reports
│   │   └── LanguageSelector.jsx    # 4-language support selector
│   ├── pages/
│   │   └── Home.jsx               # Main application page
│   ├── services/
│   │   ├── aiService.js           # OpenRouter & Gemini AI integration
│   │   └── api.js                 # API service layer
│   ├── App.jsx                    # Root application component
│   ├── main.jsx                   # Application entry point
│   └── index.css                  # Global Tailwind CSS styles
├── public/                        # Static assets
├── .env                          # Environment variables (API keys)
├── .env.example                  # Environment template
├── package.json                  # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This documentation
```

## 🎯 Core Features

### 📊 **File Processing**
- ✅ **CSV Support**: Native CSV file parsing and analysis
- ✅ **Excel Support**: Full .xlsx and .xls file compatibility
- ✅ **Drag & Drop**: Intuitive file upload interface
- ✅ **File Validation**: Automatic file type detection and validation
- ✅ **Large File Handling**: Optimized for files up to 50MB

### 🧠 **AI-Powered Analysis**
- ✅ **Real AI Integration**: OpenRouter + Google Gemini APIs
- ✅ **Intelligent Insights**: Comprehensive data analysis and pattern recognition
- ✅ **Multi-language Support**: English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), Marathi (मराठी)
- ✅ **Contextual Chat**: Interactive Q&A about your specific dataset
- ✅ **Professional Summaries**: Executive-level insights and recommendations

### 📈 **Visualization & Reporting**
- ✅ **Interactive Dashboard**: Real-time charts and metrics
- ✅ **Custom Chart Builder**: User-controlled visualization creation
  - Bar Charts for categorical comparisons
  - Line Charts for trend analysis
  - Pie/Donut Charts for distribution analysis
- ✅ **Professional PDF Export**: MNC-level formatted reports
- ✅ **Executive Summaries**: Concise business-ready documents

### 🎨 **Professional Design**
- ✅ **Corporate Styling**: Clean black-and-white professional design
- ✅ **Responsive Layout**: Perfect on desktop, tablet, and mobile
- ✅ **Loading States**: Smooth animations and progress indicators
- ✅ **Error Handling**: Graceful error management and user feedback

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint code quality checks

# Deployment
npm run deploy       # Deploy to production (configure as needed)
```

## 🌐 API Integration

### OpenRouter Configuration
```javascript
// Configured in src/services/aiService.js
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
```

### Google Gemini Configuration
```javascript
// Configured in src/services/aiService.js
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
```

## 📋 Professional Workflow

### 1. **Data Upload & Processing**
```
User uploads CSV/Excel → File validation → Data parsing → Structure analysis
```

### 2. **AI Analysis Pipeline**
```
Raw data → Gemini AI analysis → Multi-language translation → Insight generation
```

### 3. **Interactive Exploration**
```
Dashboard visualization → Custom chart creation → AI-powered chat → PDF export
```

### 4. **Report Generation**
```
AI insights → Professional formatting → MNC-style PDF → Executive summary
```

## 🎯 Usage Instructions

### Step 1: Upload Your Data
- Drag & drop or click to upload CSV/Excel files
- Automatic file type detection and validation
- Preview first 10 rows of your data

### Step 2: Analyze with AI
- Click "Analyze Data" to trigger AI analysis
- Get comprehensive insights in your preferred language
- View data quality metrics and recommendations

### Step 3: Explore Interactively
- **Summary Tab**: Bullet-point analysis and data structure
- **Dashboard Tab**: Interactive charts and real-time metrics
- **Custom Charts Tab**: Build your own visualizations
- **Chat Tab**: Ask specific questions about your data

### Step 4: Export Professional Reports
- Generate MNC-level PDF reports
- Create executive summaries
- Print-ready formatted documents

## 🔒 Security & Configuration

### Environment Variables
- All API keys stored securely in `.env` file
- No hardcoded credentials in source code
- Production-ready configuration management

### API Rate Limiting
- Intelligent request batching
- Error handling and retry logic
- Graceful degradation for API failures

## 🚀 Deployment Options

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy static files to your preferred platform
# Ensure environment variables are configured in deployment settings
```

### Environment Variables for Production
```env
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_APP_NAME=Smart CSV Analyst
VITE_APP_VERSION=1.0.0
```

## 🎨 Design Philosophy

### Professional MNC Standards
- **Clean Corporate Design**: Black and white color scheme
- **Perfect Alignment**: Consistent spacing and typography
- **Professional Borders**: Clean lines and structured layouts
- **Executive-Ready**: Business-appropriate formatting and language

### User Experience
- **Intuitive Navigation**: Clear tab structure and workflow
- **Responsive Design**: Optimized for all devices
- **Loading States**: Professional progress indicators
- **Error Handling**: User-friendly error messages

## 🔍 Troubleshooting

### Common Issues

1. **API Key Errors**
```bash
# Verify .env file exists and contains correct keys
cat .env

# Restart development server after adding keys
npm run dev
```

2. **File Upload Issues**
```bash
# Check file format (CSV, XLSX, XLS only)
# Verify file size (< 50MB recommended)
# Ensure proper file encoding (UTF-8)
```

3. **Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   File Upload   │───▶│   Data Parser    │───▶│  AI Analysis    │
│  (CSV/Excel)    │    │ (XLSX Library)   │    │ (Gemini API)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  File Preview   │    │ Structure Analysis│    │ Multi-language  │
│ (First 10 rows) │    │ (Column Types)    │    │  Translation    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Interactive     │    │ Custom Chart     │    │   AI Chat       │
│   Dashboard     │    │    Builder       │    │  Interface      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │  PDF Export     │
                    │ (Professional   │
                    │  MNC Format)    │
                    └─────────────────┘
```

## 🎉 Ready for Production

This Smart CSV Analyst is now a **professional-grade, MNC-ready data analysis platform** with:

- **Real AI Integration** using your OpenRouter and Gemini API keys
- **Professional PDF Reports** with corporate formatting
- **Interactive Dashboards** with real-time data visualization
- **Multi-language Support** for global business use
- **Custom Chart Creation** with user-controlled column selection
- **Executive-Ready Output** suitable for business presentations

The platform processes real data, generates authentic AI insights, and produces professional reports ready for corporate environments! 🚀

## 📞 Support

For technical support or feature requests:
1. Check the browser console for detailed error messages
2. Verify API key configuration in `.env` file
3. Ensure all dependencies are properly installed
4. Test with sample CSV/Excel files first

**Happy Analyzing!** 📊✨# PWASmartAnalyst
