import React, { useRef, useState } from 'react';
import { Upload, FileText, X, FileSpreadsheet } from 'lucide-react';

function FileUpload({ onFileUpload }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file) => {
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || 
                   file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                   file.type === 'application/vnd.ms-excel';
    
    if (!isCSV && !isExcel) {
      alert('Please select a CSV or Excel file');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    if (isCSV) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result;
          const lines = csv.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
          const rows = lines.slice(1).map(line => 
            line.split(',').map(cell => cell.trim().replace(/"/g, ''))
          );
          
          onFileUpload({ headers, rows, fileName: file.name, fileType: 'csv' });
        } catch (error) {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsText(file);
    } else if (isExcel) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const XLSX = await import('xlsx');
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const headers = jsonData[0] || [];
          const rows = jsonData.slice(1).filter(row => row.some(cell => cell !== undefined && cell !== ''));
          
          onFileUpload({ headers, rows, fileName: file.name, fileType: 'excel' });
        } catch (error) {
          console.error('Error parsing Excel:', error);
          alert('Error parsing Excel file');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {isDragOver ? 'Drop your file here' : 'Upload CSV or Excel File'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {uploadedFile.name.endsWith('.csv') ? (
                <FileText className="w-8 h-8 text-green-600" />
              ) : (
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
              )}
              <div>
                <p className="font-medium text-green-800">{uploadedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • {uploadedFile.name.endsWith('.csv') ? 'CSV' : 'Excel'} File
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {isProcessing && (
            <div className="mt-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-green-700">Processing file...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;