import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import CSVPreview from '../components/CSVPreview';
import FileSummary from '../components/FileSummary';
import InsightsViewer from '../components/InsightsViewer';
import InteractiveDashboard from '../components/InteractiveDashboard';
import CustomChartBuilder from '../components/CustomChartBuilder';
import ChatInterface from '../components/ChatInterface';
import PDFExport from '../components/PDFExport';
import LanguageSelector from '../components/LanguageSelector';
import aiService from '../services/aiService';
import { Brain, FileText, BarChart3, MessageCircle, Activity, FileSpreadsheet } from 'lucide-react';

function Home() {
  const [csvData, setCsvData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  const handleFileUpload = (data) => {
    setCsvData(data);
    setAnalysisResults(null);
  };

  const handleAnalyze = async () => {
    if (!csvData) return;
    
    setIsAnalyzing(true);
    try {
      // Real AI analysis using OpenRouter and Gemini APIs
      const results = await aiService.analyzeData(csvData);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please check your API configuration and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Smart CSV Analyst
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Data Analysis & Interactive Dashboard</p>
              </div>
            </div>
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* File Upload Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Upload CSV or Excel File</h2>
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* CSV Preview */}
          {csvData && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-semibold text-gray-900">Data Preview</h2>
                  {analysisResults && (
                    <PDFExport 
                      insights={analysisResults.insights}
                      selectedLanguage={selectedLanguage}
                      csvData={csvData}
                      analysisResults={analysisResults}
                    />
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Data'}</span>
                </button>
              </div>
              <CSVPreview data={csvData} />
            </div>
          )}

          {/* Results Section */}
          {(analysisResults || isAnalyzing) && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap ${
                    activeTab === 'summary'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Summary</span>
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === 'insights'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  <span>AI Insights</span>
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === 'charts'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Custom Charts</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    activeTab === 'chat'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'summary' && (
                <FileSummary 
                  data={csvData}
                  isLoading={isAnalyzing}
                  aiInsights={analysisResults?.insights?.[selectedLanguage]}
                />
              )}
              
              {activeTab === 'dashboard' && (
                <InteractiveDashboard 
                  data={csvData}
                  isLoading={isAnalyzing}
                />
              )}
              
              {activeTab === 'insights' && (
                <InsightsViewer 
                  insights={analysisResults?.insights} 
                  selectedLanguage={selectedLanguage}
                  isLoading={isAnalyzing}
                />
              )}
              
              {activeTab === 'charts' && (
                <CustomChartBuilder 
                  data={csvData}
                />
              )}
              
              {activeTab === 'chat' && (
                <ChatInterface 
                  csvData={csvData}
                  selectedLanguage={selectedLanguage}
                  isDataAnalyzed={!!analysisResults}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;