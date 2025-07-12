import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, BarChart3, Box, Activity } from 'lucide-react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  color?: string;
}

interface Dataset {
  id: string;
  name: string;
  data: DataPoint[];
  chartType: 'line' | 'bar' | 'scatter' | 'area' | '3d';
  createdAt: string;
}

interface ChartContainerProps {
  dataset: Dataset;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ dataset }) => {
  const getChartIcon = () => {
    switch (dataset.chartType) {
      case 'line': return <TrendingUp className="h-5 w-5" />;
      case 'bar': return <BarChart3 className="h-5 w-5" />;
      case 'scatter': return <Box className="h-5 w-5" />;
      case 'area': return <Activity className="h-5 w-5" />;
      case '3d': return <Box className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const renderChart = () => {
    const chartData = dataset.data.map(point => ({
      name: point.label || `${point.x}`,
      x: point.x,
      y: point.y,
      fill: point.color || '#8B5CF6'
    }));

    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (dataset.chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="url(#lineGradient)" 
              strokeWidth={3}
              dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
            />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Bar dataKey="y" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis dataKey="y" stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Scatter dataKey="y" fill="url(#scatterGradient)">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Scatter>
            <defs>
              <radialGradient id="scatterGradient">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.6} />
              </radialGradient>
            </defs>
          </ScatterChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.8)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: 'white'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="y" 
              stroke="url(#areaStroke)" 
              fill="url(#areaGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="areaStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#EC4899" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        );

      case '3d':
        return (
          <div className="h-full flex items-center justify-center text-white/80">
            <div className="text-center space-y-4">
              <Box className="h-16 w-16 mx-auto text-purple-400" />
              <div>
                <h3 className="text-lg font-semibold">3D Visualization Available</h3>
                <p className="text-sm text-slate-400">Switch to the 3D View tab to see the interactive 3D chart</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-white">Chart type not supported</div>;
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          {getChartIcon()}
          {dataset.name}
          <span className="ml-auto text-sm text-slate-400">
            {dataset.data.length} data points
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        
        {/* Chart Statistics */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Total Points</p>
            <p className="text-white text-lg font-semibold">{dataset.data.length}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Max Y</p>
            <p className="text-white text-lg font-semibold">
              {dataset.data.length > 0 ? Math.max(...dataset.data.map(p => p.y)) : 0}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Min Y</p>
            <p className="text-white text-lg font-semibold">
              {dataset.data.length > 0 ? Math.min(...dataset.data.map(p => p.y)) : 0}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-slate-400 text-sm">Avg Y</p>
            <p className="text-white text-lg font-semibold">
              {dataset.data.length > 0 ? 
                (dataset.data.reduce((sum, p) => sum + p.y, 0) / dataset.data.length).toFixed(1) : 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
