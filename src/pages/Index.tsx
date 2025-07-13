import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/charts/ChartContainer';
import { DataTable } from '@/components/data/DataTable';
import { ThreeDChart } from '@/components/charts/ThreeDChart';
import { AuthButton } from '@/components/auth/AuthButton';
import { Plus, BarChart3, LineChart, PieChart, Box, Database, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseData } from '@/hooks/useSupabaseData';

// Transform Supabase data to match existing interface
const transformDataset = (supabaseDataset: any) => ({
  id: supabaseDataset.id,
  name: supabaseDataset.name,
  chartType: supabaseDataset.chart_type,
  createdAt: supabaseDataset.created_at,
  data: supabaseDataset.data_points?.map((point: any) => ({
    id: point.id,
    x: point.x_value,
    y: point.y_value,
    label: point.label || `Point ${point.id}`,
    color: point.color || '#8B5CF6'
  })) || []
});

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { datasets: supabaseDatasets, loading, createDataset, deleteDataset, addDataPoint } = useSupabaseData(user);
  const [currentDataset, setCurrentDataset] = useState<any>(null);
  const [xValue, setXValue] = useState('');
  const [yValue, setYValue] = useState('');
  const [dataLabel, setDataLabel] = useState('');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter' | 'area' | '3d'>('line');
  const [datasetName, setDatasetName] = useState('');
  const { toast } = useToast();

  // Transform datasets for compatibility with existing components
  const datasets = supabaseDatasets.map(transformDataset);

  const handleAuthChange = () => {
    // Auth state change will be handled by useAuth hook
  };

  const addDataPointToDataset = async () => {
    if (!currentDataset || !xValue || !yValue) {
      toast({
        title: "Invalid Input",
        description: "Please fill in both X and Y values",
        variant: "destructive"
      });
      return;
    }

    const result = await addDataPoint(
      currentDataset.id, 
      parseFloat(xValue), 
      parseFloat(yValue), 
      dataLabel || `Point ${currentDataset.data.length + 1}`
    );

    if (result) {
      // Update current dataset with new data point
      const updatedDataset = {
        ...currentDataset,
        data: [...currentDataset.data, {
          id: result.id,
          x: result.x_value,
          y: result.y_value,
          label: result.label || `Point ${result.id}`,
          color: result.color || '#8B5CF6'
        }]
      };
      setCurrentDataset(updatedDataset);
      
      setXValue('');
      setYValue('');
      setDataLabel('');
    }
  };

  const createNewDataset = async () => {
    if (!datasetName) {
      toast({
        title: "Dataset Name Required",
        description: "Please enter a name for the new dataset",
        variant: "destructive"
      });
      return;
    }

    const newDataset = await createDataset(datasetName, chartType);
    if (newDataset) {
      const transformedDataset = transformDataset(newDataset);
      setCurrentDataset(transformedDataset);
      setDatasetName('');
    }
  };

  const handleDeleteDataset = async (datasetId: string) => {
    await deleteDataset(datasetId);
    if (currentDataset?.id === datasetId) {
      const remaining = datasets.filter(ds => ds.id !== datasetId);
      setCurrentDataset(remaining.length > 0 ? remaining[0] : null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center py-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
              Advanced Data Visualization Studio
            </h1>
            <p className="text-xl text-slate-300 animate-fade-in">
              Create stunning interactive charts with real-time data plotting and 3D visualizations
            </p>
          </div>
          <AuthButton user={user} onAuthChange={handleAuthChange} />
        </div>

        {!user ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <PieChart className="h-16 w-16 text-slate-400 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold text-white">Welcome to Data Visualization Studio</h3>
                <p className="text-slate-400">Please sign in to start creating and managing your datasets</p>
              </div>
            </div>
          </Card>
        ) : (
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
                    <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
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
                    <Button 
                      onClick={createNewDataset} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? 'Creating...' : 'Create Dataset'}
                    </Button>
                  </div>

                  {/* Dataset List */}
                  <div className="space-y-2">
                    {loading ? (
                      <div className="text-slate-400 text-center py-4">Loading datasets...</div>
                    ) : datasets.length === 0 ? (
                      <div className="text-slate-400 text-center py-4">No datasets yet</div>
                    ) : (
                      datasets.map((dataset) => (
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
                              handleDeleteDataset(dataset.id);
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
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
                    <Button 
                      onClick={addDataPointToDataset} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      {loading ? 'Adding...' : 'Add Point'}
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
        )}
      </div>
    </div>
  );
};

export default Index;
