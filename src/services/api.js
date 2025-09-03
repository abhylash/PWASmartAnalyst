// Real API service with OpenRouter and Gemini integration
import aiService from './aiService';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.herokuapp.com' 
  : 'http://localhost:5000';

export const analyzeCSV = async (data) => {
  // Use real AI service for analysis
  return await aiService.analyzeData(data);
};

export const chatWithData = async (question, csvData, language = 'english') => {
  // Use real AI service for chat responses
  const response = await aiService.generateChatResponse(question, csvData, language);
  return { response };
};

export const generateChart = async (chartConfig) => {
  // Mock implementation
  // const response = await fetch(`${API_BASE_URL}/api/chart`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(chartConfig),
  // });
  // const data = await response.json();
  // return data.imageUrl;

  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg';
};

/*
FLASK BACKEND STRUCTURE (Python):

1. Install dependencies:
pip install flask pandas matplotlib seaborn openai requests python-dotenv flask-cors google-generativeai

2. Backend structure:
/backend
  ├── app.py                 # Main Flask application
  ├── requirements.txt       # Python dependencies
  ├── .env                   # Environment variables
  ├── /genai
  │   ├── insights.py        # OpenRouter API integration
  │   ├── translator.py      # Translation service
  │   └── charts.py          # Chart generation
  └── /static/charts/        # Generated chart images

3. app.py example:
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import io
import base64
from genai.insights import generate_insights, generate_chat_response
from genai.translator import translate_text
from genai.charts import generate_charts
import os

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze_csv():
    try:
        data = request.json
        csv_data = data['csvData']
        
        # Convert to DataFrame
        df = pd.DataFrame(csv_data['rows'], columns=csv_data['headers'])
        
        # Generate insights
        insights = generate_insights(df)
        
        # Translate insights
        hindi_insights = translate_text(insights, 'hindi')
        kannada_insights = translate_text(insights, 'kannada')
        marathi_insights = translate_text(insights, 'marathi')
        
        # Generate charts
        charts = generate_charts(df)
        
        return jsonify({
            'insights': {
                'english': insights,
                'hindi': hindi_insights,
                'kannada': kannada_insights,
                'marathi': marathi_insights
            },
            'charts': charts
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat_with_data():
    try:
        data = request.json
        question = data['question']
        csv_data = data['csvData']
        language = data.get('language', 'english')
        
        # Convert to DataFrame
        df = pd.DataFrame(csv_data['rows'], columns=csv_data['headers'])
        
        # Generate contextual response
        response = generate_chat_response(df, question, language)
        
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

4. genai/insights.py example:
import requests
import os
from dotenv import load_dotenv

load_dotenv()

# Your API Keys
OPENROUTER_API_KEY = "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"
GEMINI_API_KEY = "AIzaSyA3CYHHz5uX60gYW2es1oOcT-dbhD-V_II"

def generate_chat_response(df, question, language='english'):
    # Prepare data context
    context = {
        'rows': len(df),
        'columns': list(df.columns),
        'sample_data': df.head(3).to_dict('records'),
        'summary_stats': df.describe().to_dict() if len(df.select_dtypes(include=['number']).columns) > 0 else {},
        'question': question,
        'language': language
    }
    
    prompt = f"""
    You are a data analyst assistant. Answer the user's question about their CSV data in {language}.
    
    Data Context:
    - Rows: {context['rows']}
    - Columns: {context['columns']}
    - Sample data: {context['sample_data']}
    - Summary statistics: {context['summary_stats']}
    
    User Question: {question}
    
    Provide a detailed, helpful response in {language}. Be specific and reference actual data patterns when possible.
    """
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "google/gemini-pro",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500
        }
    )
    
    return response.json()['choices'][0]['message']['content']

def generate_insights(df):
    # Prepare data summary
    summary = {
        'rows': len(df),
        'columns': list(df.columns),
        'dtypes': df.dtypes.to_dict(),
        'sample': df.head(5).to_dict('records'),
        'stats': df.describe().to_dict()
    }
    
    prompt = f"Analyze this CSV data and provide key insights: {summary}"
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "google/gemini-pro",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000
        }
    )
    
    return response.json()['choices'][0]['message']['content']

5. genai/translator.py example:
import requests
import os

def translate_text(text, target_language):
    language_map = {
        'hindi': 'Hindi (हिंदी)',
        'kannada': 'Kannada (ಕನ್ನಡ)',
        'marathi': 'Marathi (मराठी)'
        'marathi': 'Marathi (मराठी)'
    }
    
    target_lang = language_map.get(target_language, target_language)
    prompt = f"Translate the following data analysis text to {target_lang}. Maintain technical accuracy and context: {text}"
    
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "google/gemini-pro",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 800
        }
    )
    
    return response.json()['choices'][0]['message']['content']

6. genai/charts.py example:
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import uuid
import os

def generate_charts(df):
    charts = []
    
    # Suggest charts based on data types
    numeric_cols = df.select_dtypes(include=['number']).columns
    categorical_cols = df.select_dtypes(include=['object']).columns
    
    if len(numeric_cols) >= 2:
        # Generate scatter plot
        chart_id = str(uuid.uuid4())
        plt.figure(figsize=(10, 6))
        plt.scatter(df[numeric_cols[0]], df[numeric_cols[1]])
        plt.xlabel(numeric_cols[0])
        plt.ylabel(numeric_cols[1])
        plt.title(f'{numeric_cols[0]} vs {numeric_cols[1]}')
        
        chart_path = f'static/charts/{chart_id}.png'
        plt.savefig(chart_path)
        plt.close()
        
        charts.append({
            'id': chart_id,
            'title': f'{numeric_cols[0]} vs {numeric_cols[1]}',
            'type': 'scatter',
            'image': f'/static/charts/{chart_id}.png',
            'description': f'Scatter plot showing relationship between {numeric_cols[0]} and {numeric_cols[1]}'
        })
    
    return charts

# Alternative using Gemini API directly:
def generate_insights_gemini(df):
    import google.generativeai as genai
    
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    
    summary = {
        'rows': len(df),
        'columns': list(df.columns),
        'sample': df.head(5).to_dict('records'),
        'stats': df.describe().to_dict()
    }
    
    prompt = f"Analyze this CSV data and provide comprehensive insights: {summary}"
    response = model.generate_content(prompt)
    
    return response.text

# Environment Variables (.env file):
OPENROUTER_API_KEY=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
GEMINI_API_KEY=AIzaSyA3CYHHz5uX60gYW2es1oOcT-dbhD-V_II
FLASK_ENV=development
FLASK_DEBUG=True
*/