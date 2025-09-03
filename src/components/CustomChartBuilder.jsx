import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Plus, X, Download, Settings } from 'lucide-react';

function CustomChartBuilder({ data }) {
  const [charts, setCharts] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [newChart, setNewChart] = useState({
    type: 'bar',
    title: '',
    xColumn: '',
    yColumn: '',
    groupBy: ''
  });

  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-2">Upload a CSV or Excel file to create custom charts</p>
        <p className="text-sm text-gray-400">Build bar charts, line charts, and pie/donut charts with your data</p>
      </div>
    );
  }

  const headers = data.headers;
  const rows = data.rows;

  // Detect column types for better chart recommendations
  const columnAnalysis = headers.map((header, index) => {
    const values = rows.map(row => row[index]).filter(val => val !== null && val !== undefined && val !== '');
    const numericValues = values.filter(val => !isNaN(parseFloat(val)) && isFinite(val));
    const isNumeric = numericValues.length > values.length * 0.7;
    
    return {
      name: header,
      type: isNumeric ? 'numeric' : 'categorical',
      sampleValues: values.slice(0, 3)
    };
  });

  const numericColumns = columnAnalysis.filter(col => col.type === 'numeric').map(col => col.name);
  const categoricalColumns = columnAnalysis.filter(col => col.type === 'categorical').map(col => col.name);

  // Prepare chart data based on selected columns
  const prepareChartData = (chart) => {
    if (chart.type === 'pie') {
      // For pie charts, group by category and count or sum
      const groupData = {};
      rows.forEach(row => {
        const category = row[headers.indexOf(chart.xColumn)] || 'Unknown';
        if (chart.yColumn && numericColumns.includes(chart.yColumn)) {
          const value = parseFloat(row[headers.indexOf(chart.yColumn)]) || 0;
          groupData[category] = (groupData[category] || 0) + value;
        } else {
          groupData[category] = (groupData[category] || 0) + 1;
        }
      });
      
      return Object.entries(groupData)
        .slice(0, 8)
        .map(([name, value]) => ({ name, value }));
    } else {
      // For bar and line charts
      return rows.slice(0, 20).map((row, index) => {
        const item = { id: index };
        if (chart.xColumn) {
          item[chart.xColumn] = row[headers.indexOf(chart.xColumn)] || `Row ${index + 1}`;
        }
        if (chart.yColumn && numericColumns.includes(chart.yColumn)) {
          item[chart.yColumn] = parseFloat(row[headers.indexOf(chart.yColumn)]) || 0;
        }
        return item;
      });
    }
  };

  const createChart = () => {
    if (!newChart.title || !newChart.xColumn) {
      alert('Please provide a chart title and select the X-axis column');
      return;
    }

    if (newChart.type !== 'pie' && !newChart.yColumn) {
      alert('Please select a Y-axis column for bar and line charts');
      return;
    }

    const chartData = prepareChartData(newChart);
    const chart = {
      id: Date.now().toString(),
      ...newChart,
      data: chartData
    };

    setCharts([...charts, chart]);
    setNewChart({
      type: 'bar',
      title: '',
      xColumn: '',
      yColumn: '',
      groupBy: ''
    });
    setShowBuilder(false);
  };

  const removeChart = (chartId) => {
    setCharts(charts.filter(chart => chart.id !== chartId));
  };

  const downloadChart = (chartId) => {
    // This would trigger chart download functionality
    const chart = charts.find(c => c.id === chartId);
    alert(`Downloading "${chart.title}" chart as PNG...`);
  };

  const renderChart = (chart) => {
    const COLORS = ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6'];

    switch (chart.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={chart.xColumn} 
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar dataKey={chart.yColumn} fill="#1F2937" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chart.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey={chart.xColumn}
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#374151' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={chart.yColumn} 
                stroke="#1F2937" 
                strokeWidth={3}
                dot={{ fill: '#1F2937', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <div className="text-center py-12 text-gray-500">Unsupported chart type</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-6 h-6 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Custom Chart Builder</h3>
        </div>
        <button
          onClick={() => setShowBuilder(!showBuilder)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 border border-gray-300"
        >
          <Plus className="w-4 h-4" />
          <span>Create Chart</span>
        </button>
      </div>

      {/* Chart Builder Form */}
      {showBuilder && (
        <div className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Build Your Custom Chart</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <select
                value={newChart.type}
                onChange={(e) => setNewChart({...newChart, type: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              >
                <option value="bar">📊 Bar Chart</option>
                <option value="line">📈 Line Chart</option>
                <option value="pie">🍩 Pie/Donut Chart</option>
              </select>
            </div>

            {/* Chart Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
              <input
                type="text"
                value={newChart.title}
                onChange={(e) => setNewChart({...newChart, title: e.target.value})}
                placeholder="Enter descriptive title"
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              />
            </div>

            {/* X-Axis Column */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {newChart.type === 'pie' ? 'Category Column' : 'X-Axis Column'}
              </label>
              <select
                value={newChart.xColumn}
                onChange={(e) => setNewChart({...newChart, xColumn: e.target.value})}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              >
                <option value="">Select column...</option>
                {headers.map(header => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
            </div>

            {/* Y-Axis Column */}
            {newChart.type !== 'pie' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis Column</label>
                <select
                  value={newChart.yColumn}
                  onChange={(e) => setNewChart({...newChart, yColumn: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                >
                  <option value="">Select numeric column...</option>
                  {numericColumns.map(header => (
                    <option key={header} value={header}>{header} (Numeric)</option>
                  ))}
                </select>
              </div>
            )}

            {/* Value Column for Pie Chart */}
            {newChart.type === 'pie' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value Column (Optional)</label>
                <select
                  value={newChart.yColumn}
                  onChange={(e) => setNewChart({...newChart, yColumn: e.target.value})}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                >
                  <option value="">Count occurrences</option>
                  {numericColumns.map(header => (
                    <option key={header} value={header}>{header} (Sum values)</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowBuilder(false)}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={createChart}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 border border-gray-300"
            >
              Create Chart
            </button>
          </div>
        </div>
      )}

      {/* Column Recommendations */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <h5 className="font-medium text-gray-900 mb-3">📋 Available Columns for Charts:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">📊 Numeric Columns (for Y-axis):</p>
            <div className="flex flex-wrap gap-2">
              {numericColumns.map(col => (
                <span key={col} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs border border-blue-200">
                  {col}
                </span>
              ))}
              {numericColumns.length === 0 && (
                <span className="text-xs text-gray-500">No numeric columns detected</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">🏷️ Categorical Columns (for X-axis):</p>
            <div className="flex flex-wrap gap-2">
              {categoricalColumns.map(col => (
                <span key={col} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs border border-gray-200">
                  {col}
                </span>
              ))}
              {categoricalColumns.length === 0 && (
                <span className="text-xs text-gray-500">No categorical columns detected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Created Charts */}
      {charts.length > 0 && (
        <div className="space-y-6">
          <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Your Custom Charts</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.map((chart) => (
              <div key={chart.id} className="bg-white rounded-xl p-6 border-2 border-gray-300 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    {chart.type === 'bar' && <BarChart3 className="w-5 h-5 text-gray-700" />}
                    {chart.type === 'line' && <TrendingUp className="w-5 h-5 text-gray-700" />}
                    {chart.type === 'pie' && <PieIcon className="w-5 h-5 text-gray-700" />}
                    <span>{chart.title}</span>
                  </h5>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadChart(chart.id)}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 border border-gray-300 rounded"
                      title="Download Chart"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeChart(chart.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200 border border-gray-300 rounded"
                      title="Remove Chart"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {renderChart(chart)}
                </div>
                
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                  <p><strong>X-Axis:</strong> {chart.xColumn}</p>
                  {chart.yColumn && <p><strong>Y-Axis:</strong> {chart.yColumn}</p>}
                  <p><strong>Chart Type:</strong> {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {charts.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No custom charts created yet</p>
          <p className="text-sm text-gray-500">Click "Create Chart" to build your first visualization</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          🎨 <strong>Chart Builder Instructions:</strong> Select your preferred columns and chart type to create custom visualizations. 
          Bar charts work best for comparing categories, line charts for trends over time, and pie charts for showing distributions.
        </p>
      </div>
    </div>
  );
}

export default CustomChartBuilder;