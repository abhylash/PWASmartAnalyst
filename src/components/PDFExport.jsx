import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function PDFExport({ insights, selectedLanguage, csvData, analysisResults }) {
  const generateProfessionalPDF = async () => {
    if (!insights || !csvData) return;

    try {
      // Create a temporary div for PDF content with professional MNC styling
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.color = '#000000';

      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const languageNames = {
        english: 'English',
        hindi: 'Hindi (हिंदी)',
        kannada: 'Kannada (ಕನ್ನಡ)',
        marathi: 'Marathi (मराठी)'
      };

      // Professional MNC-style PDF content
      tempDiv.innerHTML = `
        <div style="border: 3px solid #000000; padding: 30px; margin-bottom: 20px;">
          <div style="text-align: center; border-bottom: 2px solid #000000; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="color: #000000; font-size: 24px; margin: 0; font-weight: bold; letter-spacing: 1px;">
              SMART CSV ANALYST
            </h1>
            <h2 style="color: #000000; font-size: 18px; margin: 10px 0 0 0; font-weight: normal;">
              DATA ANALYSIS REPORT
            </h2>
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #000000;">
              <p style="color: #000000; font-size: 12px; margin: 0;">
                <strong>Generated:</strong> ${currentDate} at ${currentTime} | 
                <strong>Language:</strong> ${languageNames[selectedLanguage]}
              </p>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #000000; font-size: 16px; margin-bottom: 15px; padding: 8px; background: #f5f5f5; border: 1px solid #000000; font-weight: bold;">
              📊 EXECUTIVE SUMMARY
            </h3>
            <div style="border: 1px solid #000000; padding: 15px; background: #ffffff;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="border: 1px solid #000000; padding: 8px; font-weight: bold; background: #f9f9f9; width: 30%;">File Name</td>
                  <td style="border: 1px solid #000000; padding: 8px;">${csvData.fileName || 'Unknown'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000000; padding: 8px; font-weight: bold; background: #f9f9f9;">File Type</td>
                  <td style="border: 1px solid #000000; padding: 8px;">${csvData.fileType?.toUpperCase() || 'CSV'}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000000; padding: 8px; font-weight: bold; background: #f9f9f9;">Total Records</td>
                  <td style="border: 1px solid #000000; padding: 8px;">${csvData.rows.length.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000000; padding: 8px; font-weight: bold; background: #f9f9f9;">Total Fields</td>
                  <td style="border: 1px solid #000000; padding: 8px;">${csvData.headers.length}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #000000; padding: 8px; font-weight: bold; background: #f9f9f9;">Analysis Language</td>
                  <td style="border: 1px solid #000000; padding: 8px;">${languageNames[selectedLanguage]}</td>
                </tr>
              </table>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #000000; font-size: 16px; margin-bottom: 15px; padding: 8px; background: #f5f5f5; border: 1px solid #000000; font-weight: bold;">
              🧠 AI-POWERED INSIGHTS
            </h3>
            <div style="border: 2px solid #000000; padding: 20px; background: #ffffff;">
              <div style="line-height: 1.8; color: #000000; white-space: pre-line; font-size: 14px;">
                ${insights[selectedLanguage]}
              </div>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #000000; font-size: 16px; margin-bottom: 15px; padding: 8px; background: #f5f5f5; border: 1px solid #000000; font-weight: bold;">
              📈 DATA STRUCTURE ANALYSIS
            </h3>
            <div style="border: 1px solid #000000; padding: 15px; background: #ffffff;">
              <h4 style="color: #000000; font-size: 14px; margin-bottom: 10px; font-weight: bold;">Column Headers:</h4>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f9f9f9;">
                    <th style="border: 1px solid #000000; padding: 8px; text-align: left; font-weight: bold;">Column Name</th>
                    <th style="border: 1px solid #000000; padding: 8px; text-align: left; font-weight: bold;">Data Type</th>
                    <th style="border: 1px solid #000000; padding: 8px; text-align: left; font-weight: bold;">Sample Values</th>
                  </tr>
                </thead>
                <tbody>
                  ${csvData.headers.map((header, index) => {
                    const sampleValues = csvData.rows.slice(0, 3).map(row => row[index]).filter(Boolean);
                    const numericValues = sampleValues.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
                    const dataType = numericValues.length > sampleValues.length * 0.7 ? 'Numeric' : 'Categorical';
                    
                    return `<tr>
                      <td style="border: 1px solid #000000; padding: 8px;">${header}</td>
                      <td style="border: 1px solid #000000; padding: 8px;">${dataType}</td>
                      <td style="border: 1px solid #000000; padding: 8px;">${sampleValues.slice(0, 2).join(', ')}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
              
              <h4 style="color: #000000; font-size: 14px; margin-bottom: 10px; font-weight: bold;">Sample Data (First 5 Records):</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background: #f9f9f9;">
                    ${csvData.headers.map(header => 
                      `<th style="border: 1px solid #000000; padding: 6px; text-align: left; font-weight: bold;">${header}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${csvData.rows.slice(0, 5).map(row => 
                    `<tr>${row.map(cell => 
                      `<td style="border: 1px solid #000000; padding: 6px;">${cell || '-'}</td>`
                    ).join('')}</tr>`
                  ).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #000000; font-size: 16px; margin-bottom: 15px; padding: 8px; background: #f5f5f5; border: 1px solid #000000; font-weight: bold;">
              📋 RECOMMENDATIONS
            </h3>
            <div style="border: 1px solid #000000; padding: 15px; background: #ffffff;">
              <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Utilize the Interactive Dashboard for real-time data exploration</li>
                <li style="margin-bottom: 8px;">Create custom visualizations using the Chart Builder tool</li>
                <li style="margin-bottom: 8px;">Leverage the AI Chat interface for specific data inquiries</li>
                <li style="margin-bottom: 8px;">Monitor data quality metrics for ongoing analysis accuracy</li>
                <li>Export reports in multiple languages for stakeholder communication</li>
              </ul>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #000000; text-align: center;">
            <p style="color: #000000; font-size: 10px; margin: 0;">
              <strong>CONFIDENTIAL BUSINESS REPORT</strong><br>
              Smart CSV Analyst - AI-Powered Data Analysis Platform<br>
              This report contains proprietary analysis generated on ${currentDate}
            </p>
          </div>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Generate high-quality PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      document.body.removeChild(tempDiv);

      // Download PDF with professional naming
      const fileName = `Data-Analysis-Report-${csvData.fileName?.replace(/\.[^/.]+$/, '') || 'Dataset'}-${currentDate.replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const generateExecutiveSummary = async () => {
    if (!insights || !csvData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    // Professional header with border
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, 40);
    
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('EXECUTIVE SUMMARY', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Smart CSV Analyst - Data Intelligence Report', pageWidth / 2, 35, { align: 'center' });

    // Date and file info
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()} | File: ${csvData.fileName}`, margin, 60);

    // Key metrics in bordered table
    doc.setLineWidth(1);
    doc.rect(margin, 70, maxWidth, 30);
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('KEY METRICS', margin + 5, 80);
    
    doc.setFont(undefined, 'normal');
    doc.text(`Records: ${csvData.rows.length.toLocaleString()} | Fields: ${csvData.headers.length} | Type: ${csvData.fileType?.toUpperCase()}`, margin + 5, 90);

    // AI Insights section
    doc.rect(margin, 110, maxWidth, 80);
    doc.setFont(undefined, 'bold');
    doc.text('AI INSIGHTS', margin + 5, 120);
    
    doc.setFont(undefined, 'normal');
    const insightText = insights[selectedLanguage];
    const splitText = doc.splitTextToSize(insightText, maxWidth - 10);
    doc.text(splitText, margin + 5, 130);

    const fileName = `Executive-Summary-${csvData.fileName?.replace(/\.[^/.]+$/, '') || 'Report'}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={generateProfessionalPDF}
        disabled={!insights || !csvData}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-gray-300"
      >
        <Download className="w-4 h-4" />
        <span>Export Full Report</span>
      </button>

      <button
        onClick={generateExecutiveSummary}
        disabled={!insights || !csvData}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <FileText className="w-4 h-4" />
        <span>Executive Summary</span>
      </button>

      <button
        onClick={() => window.print()}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
      >
        <Printer className="w-4 h-4" />
        <span>Print Report</span>
      </button>
    </div>
  );
}

export default PDFExport;