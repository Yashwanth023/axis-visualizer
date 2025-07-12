
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { DataTable } from '@/components/data/DataTable';
import { ThreeDChart } from '@/components/charts/ThreeDChart';
import { Plus, BarChart3, LineChart, PieChart, Box, Database, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const Index = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [dataLabel, setDataLabel] = useState('');
  const [chartType, setChartType] = useState<Dataset['chartType']>('line');
  const [datasetName, setDatasetName] = useState('');
  const { toast } = useToast();

  // Sample datasets
  useEffect(() => {
    const sampleDatasets: Dataset[] = [
      {
        id: '1',
        name: 'Sales Performance',
        chartType: 'line',
        createdAt: new Date().toISOString(),
        data: [
          { id: '1', x: 1, y: 20, label: 'Jan', color: '#8B5CF6' },
          { id: '2', x: 2, y: 35, label: 'Feb', color: '#8B5CF6' },
          { id: '3', x: 3, y: 28, label: 'Mar', color: '#8B5CF6' },
          { id: '4', x: 4, y: 45, label: 'Apr', color: '#8B5CF6' },
          { id: '5', x: 5, y: 52, label: 'May', color: '#8B5CF6' },
          { id: '6', x: 6, y: 48, label: 'Jun', color: '#8B5CF6' },
        ]
      },
      {
        id: '2',
        name: 'User Growth',
        chartType: 'bar',
        createdAt: new Date().toISOString(),
        data: [
          { id: '1', x: 2020, y: 100, label: '2020', color: '#06D6A0' },
          { id: '2', x: 2021, y: 250, label: '2021', color: '#06D6A0' },
          { id: '3', x: 2022, y: 400, label: '2022', color: '#06D6A0' },
          { id: '4', x: 2023, y: 650, label: '2023', color: '#06D6A0' },
          { id: '5', x: 2024, y: 900, label: '2024', color: '#06D6A0' },
        ]
      },
      {
        id: '3',
        name: 'Revenue Analysis',
        chartType: '3d',
        createdAt: new Date().toISOString(),
        data: [
          { id: '1', x: 10, y: 15, label: 'Q1', color: '#FF6B6B' },
          { id: '2', x: 20, y: 25, label: 'Q2', color: '#4ECDC4' },
          { id: '3', x: 30, y: 35, label: 'Q3', color: '#45B7D1' },
          { id: '4', x: 40, y: 45, label: 'Q4', color: '#96CEB4' },
        ]
      }
    ];
    setDatasets(sampleDatasets);
    setCurrentDataset(sampleDatasets[0]);
  }, []);

  const addDataPoint = () => {
    if (!currentDataset || !xValue || !yValue) {
      toast({
        title: "Invalid Input",
        description: "Please fill in both X and Y values",
        variant: "destructive"
      });
      return;
    }

    const newPoint: DataPoint = {
      id: Date.now().toString(),
      x: parseFloat(xValue),
      y: parseFloat(yValue),
      label: dataLabel || `Point ${currentDataset.data.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };

    const updatedDataset = {
      ...currentDataset,
      data: [...currentDataset.data, newPoint]
    };

    setCurrentDataset(updatedDataset);
    setDatasets(prev => prev.map(ds => ds.id === currentDataset.id ? updatedDataset : ds));
    
    setXValue('');
    setYValue('');
    setDataLabel('');
    
    toast({
      title: "Data Point Added",
      description: `Added point (${newPoint.x}, ${newPoint.y}) to ${currentDataset.name}`,
    });
  };

  const createNewDataset = () => {
    if (!datasetName) {
      toast({
        title: "Dataset Name Required",
        description: "Please enter a name for the new dataset",
        variant: "destructive"
      });
      return;
    }

    const newDataset: Dataset = {
      id: Date.now().toString(),
      name: datasetName,
      data: [],
      chartType,
      createdAt: new Date().toISOString()
    };

    setDatasets(prev => [...prev, newDataset]);
    setCurrentDataset(newDataset);
    setDatasetName('');
    
    toast({
      title: "Dataset Created",
      description: `Created new dataset: ${newDataset.name}`,
    });
  };

  const deleteDataset = (datasetId: string) => {
    setDatasets(prev => prev.filter(ds => ds.id !== datasetId));
    if (currentDataset?.id === datasetId) {
      const remaining = datasets.filter(ds => ds.id !== datasetId);
      setCurrentDataset(remaining.length > 0 ? remaining[0] : null);
    }
    
    toast({
      title: "Dataset Deleted",
      description: "Dataset has been successfully deleted",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Advanced Data Visualization Studio
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in">
            Create stunning interactive charts with real-time data plotting and 3D visualizations
          </p>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Dataset Management */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Database className="h-5 w-5" />
                  Datasets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Create New Dataset */}
                <div className="space-y-2">
                  <Label className="text-slate-200">New Dataset</Label>
                  <Input
                    placeholder="Dataset name"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  />
                  <Select value={chartType} onValueChange={(value: Dataset['chartType']) => setChartType(value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                      <SelectItem value="scatter">Scatter Plot</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="3d">3D Chart</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={createNewDataset} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Dataset
                  </Button>
                </div>

                {/* Dataset List */}
                <div className="space-y-2">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        currentDataset?.id === dataset.id
                          ? 'bg-purple-500/30 border border-purple-400/50'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                      onClick={() => setCurrentDataset(dataset)}
                    >
                      <div>
                        <p className="text-white font-medium">{dataset.name}</p>
                        <p className="text-slate-400 text-sm">{dataset.data.length} points</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDataset(dataset.id);
                        }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Data Input */}
            {currentDataset && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Plus className="h-5 w-5" />
                    Add Data Point
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200">X Value</Label>
                    <Input
                      type="number"
                      placeholder="Enter X value"
                      value={xValue}
                      onChange={(e) => setXValue(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Y Value</Label>
                    <Input
                      type="number"
                      placeholder="Enter Y value"
                      value={yValue}
                      onChange={(e) => setYValue(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Label (Optional)</Label>
                    <Input
                      placeholder="Point label"
                      value={dataLabel}
                      onChange={(e) => setDataLabel(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button onClick={addDataPoint} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Add Point
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {currentDataset ? (
              <Tabs defaultValue="chart" className="space-y-4">
                <TabsList className="bg-white/10 backdrop-blur-lg border-white/20">
                  <TabsTrigger value="chart" className="data-[state=active]:bg-purple-500/30">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Chart View
                  </TabsTrigger>
                  <TabsTrigger value="3d" className="data-[state=active]:bg-purple-500/30">
                    <Box className="h-4 w-4 mr-2" />
                    3D View
                  </TabsTrigger>
                  <TabsTrigger value="data" className="data-[state=active]:bg-purple-500/30">
                    <Database className="h-4 w-4 mr-2" />
                    Data Table
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chart" className="space-y-0">
                  <ChartContainer dataset={currentDataset} />
                </TabsContent>

                <TabsContent value="3d" className="space-y-0">
                  <ThreeDChart dataset={currentDataset} />
                </TabsContent>

                <TabsContent value="data" className="space-y-0">
                  <DataTable dataset={currentDataset} onUpdateDataset={setCurrentDataset} />
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <PieChart className="h-16 w-16 text-slate-400 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">No Dataset Selected</h3>
                    <p className="text-slate-400">Create or select a dataset to begin visualizing data</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
