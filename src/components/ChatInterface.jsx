import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import aiService from '../services/aiService';

function ChatInterface({ csvData, selectedLanguage, isDataAnalyzed }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (csvData && messages.length === 0) {
      const welcomeMessage = {
        id: '1',
        type: 'bot',
        content: getWelcomeMessage(),
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [csvData, selectedLanguage]);

  const getWelcomeMessage = () => {
    const messages = {
      english: `Hello! I'm your CSV data analyst. I can help you explore and understand your data in detail. You can ask me questions like:
      
• "What are the top 5 performing regions?"
• "Show me trends over time"
• "Which products have the highest sales?"
• "Are there any outliers in the data?"
• "What correlations do you see?"

What would you like to know about your data?`,
      hindi: `नमस्ते! मैं आपका CSV डेटा विश्लेषक हूं। मैं आपको आपके डेटा को विस्तार से समझने में मदद कर सकता हूं। आप मुझसे इस तरह के प्रश्न पूछ सकते हैं:

• "शीर्ष 5 प्रदर्शन करने वाले क्षेत्र कौन से हैं?"
• "समय के साथ रुझान दिखाएं"
• "किन उत्पादों की सबसे अधिक बिक्री है?"
• "डेटा में कोई असामान्यताएं हैं?"
• "आप कौन से संबंध देखते हैं?"

आप अपने डेटा के बारे में क्या जानना चाहते हैं?`,
      kannada: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ CSV ಡೇಟಾ ವಿಶ್ಲೇಷಕ. ನಿಮ್ಮ ಡೇಟಾವನ್ನು ವಿವರವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ನೀವು ನನ್ನನ್ನು ಈ ರೀತಿಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು:

• "ಟಾಪ್ 5 ಪ್ರದರ್ಶನ ನೀಡುವ ಪ್ರದೇಶಗಳು ಯಾವುವು?"
• "ಕಾಲಾನಂತರದಲ್ಲಿ ಪ್ರವೃತ್ತಿಗಳನ್ನು ತೋರಿಸಿ"
• "ಯಾವ ಉತ್ಪಾದನೆಗಳು ಅತ್ಯಧಿಕ ಮಾರಾಟವನ್ನು ಹೊಂದಿವೆ?"
• "ಡೇಟಾದಲ್ಲಿ ಯಾವುದೇ ಅಸಾಮಾನ್ಯತೆಗಳಿವೆಯೇ?"

ನಿಮ್ಮ ಡೇಟಾದ ಬಗ್ಗೆ ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?`,
      marathi: `नमस्कार! मी तुमचा CSV डेटा विश्लेषक आहे। मी तुम्हाला तुमचा डेटा तपशीलवार समजून घेण्यास मदत करू शकतो. तुम्ही मला अशा प्रकारचे प्रश्न विचारू शकता:

• "टॉप 5 कामगिरी करणारे प्रदेश कोणते आहेत?"
• "कालांतराने ट्रेंड दाखवा"
• "कोणत्या उत्पादनांची सर्वाधिक विक्री आहे?"
• "डेटामध्ये काही विसंगती आहेत का?"
• "तुम्हाला कोणते संबंध दिसतात?"

तुम्हाला तुमच्या डेटाबद्दल काय जाणून घ्यायचे आहे?`
    };
    return messages[selectedLanguage];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !csvData) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Real AI response using OpenRouter API
      const botResponse = await aiService.generateChatResponse(inputMessage, csvData, selectedLanguage);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        language: selectedLanguage
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error while processing your request. Please check your API configuration and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (question, language) => {
    const responses = {
      english: {
        default: "Based on your CSV data analysis, I can see several interesting patterns. The data shows strong performance indicators across multiple dimensions. Would you like me to dive deeper into any specific aspect?",
        trends: "Looking at the temporal trends in your data, I notice a clear seasonal pattern with peaks in Q4 and gradual increases throughout the year. The growth rate averages 15% quarter-over-quarter.",
        top: "The top performing segments in your data are: 1) Electronics (45% market share), 2) Clothing (28%), 3) Home & Garden (18%). These three categories drive 91% of total performance.",
        correlation: "I've identified strong positive correlations between marketing spend and sales (r=0.78), and between customer satisfaction and retention rates (r=0.82). These insights suggest focused investment opportunities."
      },
      hindi: {
        default: "आपके CSV डेटा विश्लेषण के आधार पर, मैं कई दिलचस्प पैटर्न देख सकता हूं। डेटा कई आयामों में मजबूत प्रदर्शन संकेतक दिखाता है। क्या आप चाहते हैं कि मैं किसी विशिष्ट पहलू में गहराई से जाऊं?",
        trends: "आपके डेटा में अस्थायी रुझानों को देखते हुए, मुझे Q4 में चरम और साल भर में क्रमिक वृद्धि के साथ एक स्पष्ट मौसमी पैटर्न दिखाई देता है।",
        top: "आपके डेटा में शीर्ष प्रदर्शन करने वाले खंड हैं: 1) इलेक्ट्रॉनिक्स (45% बाजार हिस्सेदारी), 2) कपड़े (28%), 3) घर और बगीचा (18%)।",
        correlation: "मैंने मार्केटिंग खर्च और बिक्री के बीच मजबूत सकारात्मक संबंध (r=0.78) की पहचान की है।"
      },
      kannada: {
        default: "ನಿಮ್ಮ CSV ಡೇಟಾ ವಿಶ್ಲೇಷಣೆಯ ಆಧಾರದ ಮೇಲೆ, ನಾನು ಹಲವಾರು ಆಸಕ್ತಿದಾಯಕ ಮಾದರಿಗಳನ್ನು ನೋಡಬಹುದು। ಡೇಟಾ ಬಹು ಆಯಾಮಗಳಲ್ಲಿ ಬಲವಾದ ಕಾರ್ಯಕ್ಷಮತೆ ಸೂಚಕಗಳನ್ನು ತೋರಿಸುತ್ತದೆ।",
        trends: "ನಿಮ್ಮ ಡೇಟಾದಲ್ಲಿನ ತಾತ್ಕಾಲಿಕ ಪ್ರವೃತ್ತಿಗಳನ್ನು ನೋಡುತ್ತಾ, Q4 ನಲ್ಲಿ ಶಿಖರಗಳು ಮತ್ತು ವರ್ಷದುದ್ದಕ್ಕೂ ಕ್ರಮೇಣ ಹೆಚ್ಚಳದೊಂದಿಗೆ ಸ್ಪಷ್ಟ ಋತುಮಾನದ ಮಾದರಿಯನ್ನು ನಾನು ಗಮನಿಸುತ್ತೇನೆ।",
        top: "ನಿಮ್ಮ ಡೇಟಾದಲ್ಲಿ ಉನ್ನತ ಕಾರ್ಯಕ್ಷಮತೆಯ ವಿಭಾಗಗಳು: 1) ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ (45% ಮಾರುಕಟ್ಟೆ ಪಾಲು), 2) ಬಟ್ಟೆ (28%), 3) ಮನೆ ಮತ್ತು ತೋಟ (18%)।",
        correlation: "ಮಾರ್ಕೆಟಿಂಗ್ ಖರ್ಚು ಮತ್ತು ಮಾರಾಟದ ನಡುವೆ ಬಲವಾದ ಧನಾತ್ಮಕ ಸಂಬಂಧಗಳನ್ನು (r=0.78) ನಾನು ಗುರುತಿಸಿದ್ದೇನೆ।"
      },
      marathi: {
        default: "तुमच्या CSV डेटा विश्लेषणाच्या आधारे, मी अनेक मनोरंजक पॅटर्न पाहू शकतो. डेटा अनेक आयामांमध्ये मजबूत कामगिरी निर्देशक दर्शवितो.",
        trends: "तुमच्या डेटामधील तात्पुरत्या ट्रेंडकडे पाहताना, मला Q4 मध्ये शिखरे आणि वर्षभर हळूहळू वाढ असलेला स्पष्ट हंगामी पॅटर्न दिसतो.",
        top: "तुमच्या डेटामधील टॉप परफॉर्मिंग सेगमेंट्स आहेत: 1) इलेक्ट्रॉनिक्स (45% मार्केट शेअर), 2) कपडे (28%), 3) घर आणि बाग (18%)।",
        correlation: "मी मार्केटिंग खर्च आणि विक्री यांच्यातील मजबूत सकारात्मक संबंध (r=0.78) ओळखले आहेत."
      }
    };

    const langResponses = responses[language] || responses.english;
    
    if (question.toLowerCase().includes('trend') || question.toLowerCase().includes('time')) {
      return langResponses.trends;
    } else if (question.toLowerCase().includes('top') || question.toLowerCase().includes('best') || question.toLowerCase().includes('highest')) {
      return langResponses.top;
    } else if (question.toLowerCase().includes('correlation') || question.toLowerCase().includes('relationship')) {
      return langResponses.correlation;
    } else {
      return langResponses.default;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are the key trends in this data?",
    "Show me the top performing categories",
    "Are there any correlations I should know about?",
    "What insights can you provide about seasonality?"
  ];

  if (!csvData) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Upload a CSV file to start chatting about your data</p>
      </div>
    );
  }

  if (!isDataAnalyzed) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Please analyze your data first</p>
        <p className="text-sm text-gray-500">Click "Analyze Data" to enable the chat feature</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-96">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-t-xl">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.type === 'bot' && (
                  <Bot className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />
                )}
                {message.type === 'user' && (
                  <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm">Analyzing your question...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 bg-white border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask me anything about your data... (in ${selectedLanguage})`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;