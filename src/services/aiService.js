import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// OpenRouter configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

class AIService {
  // Analyze CSV data and generate comprehensive insights
  async analyzeData(csvData) {
    try {
      const dataContext = this.prepareDataContext(csvData);
      
      // Use Gemini for primary analysis
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        As a senior data analyst, provide a comprehensive analysis of this dataset:
        
        Dataset Overview:
        - File: ${csvData.fileName}
        - Rows: ${csvData.rows.length}
        - Columns: ${csvData.headers.length}
        - Headers: ${csvData.headers.join(', ')}
        
        Sample Data (first 5 rows):
        ${JSON.stringify(csvData.rows.slice(0, 5), null, 2)}
        
        Column Statistics:
        ${dataContext.columnStats}
        
        Please provide:
        1. Executive Summary (2-3 sentences)
        2. Key Findings (5-7 bullet points)
        3. Data Quality Assessment
        4. Recommended Actions
        5. Notable Patterns or Trends
        
        Format as professional business report suitable for executives.
      `;

      const result = await model.generateContent(prompt);
      const insights = result.response.text();

      return {
        insights: {
          english: insights,
          hindi: await this.translateText(insights, 'hindi'),
          kannada: await this.translateText(insights, 'kannada'),
          marathi: await this.translateText(insights, 'marathi')
        },
        dataContext
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw new Error('Failed to analyze data. Please check your API configuration.');
    }
  }

  // Translate text using OpenRouter
  async translateText(text, targetLanguage) {
    try {
      const languageMap = {
        hindi: 'Hindi (हिंदी)',
        kannada: 'Kannada (ಕನ್ನಡ)',
        marathi: 'Marathi (मराठी)'
      };

      const response = await axios.post(OPENROUTER_BASE_URL, {
        model: 'google/gemini-pro',
        messages: [{
          role: 'user',
          content: `Translate the following data analysis report to ${languageMap[targetLanguage]}. Maintain professional tone and technical accuracy:

${text}`
        }],
        max_tokens: 1500
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Translation Error:', error);
      return text; // Fallback to original text
    }
  }

  // Generate contextual chat response
  async generateChatResponse(question, csvData, language = 'english') {
    try {
      const dataContext = this.prepareDataContext(csvData);
      
      const languageMap = {
        english: 'English',
        hindi: 'Hindi (हिंदी)',
        kannada: 'Kannada (ಕನ್ನಡ)',
        marathi: 'Marathi (मराठी)'
      };

      const response = await axios.post(OPENROUTER_BASE_URL, {
        model: 'google/gemini-pro',
        messages: [{
          role: 'user',
          content: `You are a senior data analyst. Answer this question about the uploaded dataset in ${languageMap[language]}:

Dataset Context:
- File: ${csvData.fileName}
- Rows: ${csvData.rows.length}
- Columns: ${csvData.headers.join(', ')}
- Sample Data: ${JSON.stringify(csvData.rows.slice(0, 3), null, 2)}
- Column Statistics: ${dataContext.columnStats}

User Question: ${question}

Provide a detailed, data-specific answer in ${languageMap[language]}. Reference actual data patterns and values when possible.`
        }],
        max_tokens: 800
      }, {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Chat Response Error:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  // Prepare data context for AI analysis
  prepareDataContext(csvData) {
    const headers = csvData.headers;
    const rows = csvData.rows;

    // Analyze each column
    const columnAnalysis = headers.map((header, index) => {
      const values = rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
      const uniqueValues = [...new Set(values)];
      
      // Detect column type
      const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
      const isNumeric = numericValues.length > values.length * 0.7;
      
      const dateValues = values.filter(val => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && val.toString().match(/\d{4}|\d{2}\/\d{2}|\d{2}-\d{2}/);
      });
      const isDate = dateValues.length > values.length * 0.5;

      return {
        name: header,
        type: isDate ? 'date' : (isNumeric ? 'numeric' : 'categorical'),
        totalValues: values.length,
        uniqueValues: uniqueValues.length,
        nullCount: rows.length - values.length,
        sampleValues: uniqueValues.slice(0, 3),
        completeness: ((values.length / rows.length) * 100).toFixed(1)
      };
    });

    const columnStats = columnAnalysis.map(col => 
      `${col.name}: ${col.type} (${col.completeness}% complete, ${col.uniqueValues} unique values)`
    ).join('\n');

    return {
      columnAnalysis,
      columnStats,
      numericColumns: columnAnalysis.filter(col => col.type === 'numeric').map(col => col.name),
      categoricalColumns: columnAnalysis.filter(col => col.type === 'categorical').map(col => col.name),
      dateColumns: columnAnalysis.filter(col => col.type === 'date').map(col => col.name)
    };
  }
}

export default new AIService();