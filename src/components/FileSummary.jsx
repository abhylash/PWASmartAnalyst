import React from 'react';
import { FileText, Database, Hash, Type, Calendar, CheckCircle, TrendingUp, Users, Target, AlertTriangle } from 'lucide-react';

function FileSummary({ data, isLoading, aiInsights }) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Analyzing File Structure...</h3>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Upload a CSV or Excel file to view detailed summary</p>
      </div>
    );
  }

  // Analyze data structure
  const headers = data.headers;
  const rows = data.rows;
  
  // Detect column types and analyze data quality
  const columnAnalysis = headers.map((header, index) => {
    const values = rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
    const uniqueValues = [...new Set(values)];
    
    let type = 'text';
    let icon = Type;
    let color = 'gray';
    
    // Check if numeric
    const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
    if (numericValues.length > values.length * 0.7) {
      type = 'numeric';
      icon = Hash;
      color = 'blue';
    }
    
    // Check if date
    const dateValues = values.filter(val => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && val.toString().match(/\d{4}|\d{2}\/\d{2}|\d{2}-\d{2}/);
    });
    if (dateValues.length > values.length * 0.5) {
      type = 'date';
      icon = Calendar;
      color = 'green';
    }
    
    // Check if boolean
    const booleanValues = values.filter(val => 
      ['true', 'false', 'yes', 'no', '1', '0'].includes(val.toString().toLowerCase())
    );
    if (booleanValues.length > values.length * 0.7) {
      type = 'boolean';
      icon = CheckCircle;
      color = 'purple';
    }
    
    return {
      name: header,
      type,
      icon,
      color,
      totalValues: values.length,
      uniqueValues: uniqueValues.length,
      nullCount: rows.length - values.length,
      completeness: ((values.length / rows.length) * 100).toFixed(1),
      sampleValues: uniqueValues.slice(0, 3)
    };
  });

  const numericColumns = columnAnalysis.filter(col => col.type === 'numeric');
  const categoricalColumns = columnAnalysis.filter(col => col.type === 'text');
  const dateColumns = columnAnalysis.filter(col => col.type === 'date');
  
  // Calculate data quality metrics
  const dataQuality = {
    completeness: ((rows.filter(row => row.some(cell => cell && cell.toString().trim())).length / rows.length) * 100).toFixed(1),
    consistency: ((columnAnalysis.reduce((sum, col) => sum + parseFloat(col.completeness), 0) / columnAnalysis.length)).toFixed(1),
    uniqueness: Math.round((columnAnalysis.reduce((sum, col) => sum + (col.uniqueValues / col.totalValues), 0) / columnAnalysis.length) * 100)
  };

  // File size calculation
  const estimatedSize = (JSON.stringify(data).length / 1024).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">File Summary & Analysis</h3>
      </div>

      {/* File Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>File Overview</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">File Name</p>
            <p className="font-semibold text-gray-900 text-sm">{data.fileName}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">File Type</p>
            <p className="font-semibold text-gray-900 text-sm">{data.fileType?.toUpperCase()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Rows</p>
            <p className="font-semibold text-gray-900 text-sm">{rows.length.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Total Columns</p>
            <p className="font-semibold text-gray-900 text-sm">{headers.length}</p>
          </div>
        </div>
      </div>

      {/* AI-Generated Key Insights */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>AI-Generated Key Insights</span>
        </h4>
        
        {aiInsights ? (
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                <strong>Data Structure:</strong> Contains {rows.length.toLocaleString()} records across {headers.length} columns with {dataQuality.completeness}% data completeness
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                <strong>Column Distribution:</strong> {numericColumns.length} numeric fields, {categoricalColumns.length} categorical fields
                {dateColumns.length > 0 && `, ${dateColumns.length} date fields`}
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                <strong>Data Quality:</strong> {dataQuality.consistency}% average completeness with {dataQuality.uniqueness}% data uniqueness ratio
              </p>
            </div>
            
            {numericColumns.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Quantitative Analysis:</strong> Primary numeric columns are {numericColumns.slice(0, 3).map(col => col.name).join(', ')}
                </p>
              </div>
            )}
            
            {categoricalColumns.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">
                  <strong>Categorical Fields:</strong> Key categorical dimensions include {categoricalColumns.slice(0, 3).map(col => col.name).join(', ')}
                </p>
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-700">
                <strong>Data Integrity:</strong> Most complete columns are {columnAnalysis.sort((a, b) => parseFloat(b.completeness) - parseFloat(a.completeness)).slice(0, 3).map(col => col.name).join(', ')}
              </p>
            </div>

            {/* Additional AI insights if available */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 leading-relaxed">
                {aiInsights.split('\n').slice(0, 3).join(' ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Data Structure:</strong> Contains {rows.length.toLocaleString()} records across {headers.length} columns
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Column Types:</strong> {numericColumns.length} numeric fields, {categoricalColumns.length} text fields
                {dateColumns.length > 0 && `, ${dateColumns.length} date fields`}
              </p>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Data Quality:</strong> {dataQuality.completeness}% of rows contain data with {dataQuality.consistency}% average completeness
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Data Quality Metrics */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-purple-600" />
          <span>Data Quality Assessment</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-700 mb-1">{dataQuality.completeness}%</div>
            <div className="text-sm text-green-600">Data Completeness</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-700 mb-1">{dataQuality.consistency}%</div>
            <div className="text-sm text-blue-600">Column Consistency</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-700 mb-1">{dataQuality.uniqueness}%</div>
            <div className="text-sm text-purple-600">Data Uniqueness</div>
          </div>
        </div>
      </div>

      {/* Column Structure */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <span>Column Structure</span>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {columnAnalysis.map((column, index) => {
            const IconComponent = column.icon;
            const colorClasses = {
              blue: 'bg-blue-50 border-blue-200 text-blue-700',
              green: 'bg-green-50 border-green-200 text-green-700',
              purple: 'bg-purple-50 border-purple-200 text-purple-700',
              gray: 'bg-gray-50 border-gray-200 text-gray-700'
            };
            
            return (
              <div key={index} className={`rounded-lg p-4 border ${colorClasses[column.color]}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-medium text-sm">{column.name}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p><strong>Type:</strong> {column.type}</p>
                  <p><strong>Completeness:</strong> {column.completeness}%</p>
                  <p><strong>Unique Values:</strong> {column.uniqueValues.toLocaleString()}</p>
                  {column.nullCount > 0 && <p><strong>Missing:</strong> {column.nullCount}</p>}
                  {column.sampleValues.length > 0 && (
                    <p><strong>Sample:</strong> {column.sampleValues.join(', ')}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <span>Analysis Recommendations</span>
        </h4>
        
        <div className="space-y-3">
          {numericColumns.length > 1 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Correlation Analysis:</strong> Explore relationships between {numericColumns.slice(0, 2).map(col => col.name).join(' and ')} using scatter plots
              </p>
            </div>
          )}
          
          {categoricalColumns.length > 0 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Distribution Analysis:</strong> Use pie charts to analyze {categoricalColumns[0]?.name} distribution patterns
              </p>
            </div>
          )}
          
          {dateColumns.length > 0 && numericColumns.length > 0 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-gray-700">
                <strong>Trend Analysis:</strong> Create line charts using {dateColumns[0]?.name} to track {numericColumns[0]?.name} over time
              </p>
            </div>
          )}
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-gray-700">
              <strong>Interactive Exploration:</strong> Use the chat interface to ask specific questions about patterns and outliers
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          📊 This comprehensive summary analyzes your data structure, quality, and provides actionable recommendations. 
          Use the Custom Charts tab to create visualizations based on these insights.
        </p>
      </div>
    </div>
  );
}

export default FileSummary;