import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieIcon, Activity, Users, DollarSign, Target } from 'lucide-react';

function InteractiveDashboard({ data, isLoading }) {
  const dashboardData = useMemo(() => {
    if (!data || !data.rows || data.rows.length === 0) return null;

    const headers = data.headers;
    const rows = data.rows;

    // Find numeric columns
    const numericColumns = headers.filter((header, index) => {
      return rows.some(row => {
        const value = row[index];
        return value && !isNaN(parseFloat(value)) && isFinite(value);
      });
    });

    // Find categorical columns
    const categoricalColumns = headers.filter((header, index) => {
      return !numericColumns.includes(header);
    });

    // Generate sample data for charts
    const chartData = rows.slice(0, 10).map((row, index) => {
      const item = { id: index };
      headers.forEach((header, headerIndex) => {
        const value = row[headerIndex];
        if (numericColumns.includes(header)) {
          item[header] = parseFloat(value) || 0;
        } else {
          item[header] = value || 'N/A';
        }
      });
      return item;
    });

    // Calculate summary statistics
    const stats = {
      totalRows: rows.length,
      totalColumns: headers.length,
      numericColumns: numericColumns.length,
      categoricalColumns: categoricalColumns.length
    };

    // Generate category distribution for pie chart
    const categoryData = categoricalColumns.length > 0 ? 
      Object.entries(
        rows.reduce((acc, row) => {
          const category = row[headers.indexOf(categoricalColumns[0])] || 'Unknown';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {})
      ).slice(0, 6).map(([name, value]) => ({ name, value })) : [];

    return {
      chartData,
      stats,
      categoryData,
      numericColumns,
      categoricalColumns,
      headers
    };
  }, [data]);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Generating Interactive Dashboard...</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Upload a file to view the interactive dashboard</p>
      </div>
    );
  }

  const { chartData, stats, categoryData, numericColumns, categoricalColumns } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Activity className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Interactive Dashboard</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Rows</p>
              <p className="text-2xl font-bold">{stats.totalRows.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Columns</p>
              <p className="text-2xl font-bold">{stats.totalColumns}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Numeric Fields</p>
              <p className="text-2xl font-bold">{stats.numericColumns}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Categories</p>
              <p className="text-2xl font-bold">{stats.categoricalColumns}</p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        {numericColumns.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Data Distribution</span>
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey={numericColumns[0]} fill="#3B82F6" />
                {numericColumns[1] && <Bar dataKey={numericColumns[1]} fill="#8B5CF6" />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Line Chart */}
        {numericColumns.length > 1 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Trend Analysis</span>
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={numericColumns[0]} stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey={numericColumns[1]} stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Pie Chart */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-purple-600" />
              <span>Category Distribution</span>
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Scatter Plot */}
        {numericColumns.length >= 2 && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span>Correlation Analysis</span>
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={numericColumns[0]} />
                <YAxis dataKey={numericColumns[1]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey={numericColumns[1]} fill="#F59E0B" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Data Summary Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sample Values
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.headers.map((header, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {header}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      numericColumns.includes(header) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {numericColumns.includes(header) ? 'Numeric' : 'Text'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {data.rows.slice(0, 3).map(row => row[index]).filter(Boolean).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          📊 This interactive dashboard automatically analyzes your data structure and creates relevant visualizations. 
          Charts are generated based on data types and relationships found in your dataset.
        </p>
      </div>
    </div>
  );
}

export default InteractiveDashboard;