
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Save, X, Database, Download, Upload } from 'lucide-react';
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

interface DataTableProps {
  dataset: Dataset;
  onUpdateDataset: (dataset: Dataset) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ dataset, onUpdateDataset }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<DataPoint>>({});
  const { toast } = useToast();

  const startEdit = (point: DataPoint) => {
    setEditingId(point.id);
    setEditValues({
      x: point.x,
      y: point.y,
      label: point.label,
      color: point.color
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const updatedData = dataset.data.map(point => 
      point.id === editingId 
        ? { ...point, ...editValues }
        : point
    );
    
    const updatedDataset = { ...dataset, data: updatedData };
    onUpdateDataset(updatedDataset);
    
    setEditingId(null);
    setEditValues({});
    
    toast({
      title: "Data Updated",
      description: "Data point has been successfully updated",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const deletePoint = (pointId: string) => {
    const updatedData = dataset.data.filter(point => point.id !== pointId);
    const updatedDataset = { ...dataset, data: updatedData };
    onUpdateDataset(updatedDataset);
    
    toast({
      title: "Data Deleted",
      description: "Data point has been successfully deleted",
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(dataset.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${dataset.name.replace(/\s+/g, '_')}_data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: `Exported ${dataset.data.length} data points`,
    });
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          const validatedData = importedData.map((item, index) => ({
            id: `imported_${Date.now()}_${index}`,
            x: Number(item.x) || 0,
            y: Number(item.y) || 0,
            label: item.label || `Point ${index + 1}`,
            color: item.color || `hsl(${Math.random() * 360}, 70%, 60%)`
          }));
          
          const updatedDataset = { 
            ...dataset, 
            data: [...dataset.data, ...validatedData] 
          };
          onUpdateDataset(updatedDataset);
          
          toast({
            title: "Data Imported",
            description: `Imported ${validatedData.length} data points`,
          });
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse the JSON file",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5" />
            Data Table - {dataset.name}
            <Badge variant="secondary" className="ml-2">
              {dataset.data.length} points
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportData}
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <label>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 cursor-pointer"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border border-white/20">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-white/5">
                <TableHead className="text-slate-300">ID</TableHead>
                <TableHead className="text-slate-300">X Value</TableHead>
                <TableHead className="text-slate-300">Y Value</TableHead>
                <TableHead className="text-slate-300">Label</TableHead>
                <TableHead className="text-slate-300">Color</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataset.data.map((point) => (
                <TableRow 
                  key={point.id} 
                  className="border-white/20 hover:bg-white/5 transition-colors"
                >
                  <TableCell className="text-slate-400 font-mono text-sm">
                    {point.id.slice(-8)}
                  </TableCell>
                  <TableCell className="text-white">
                    {editingId === point.id ? (
                      <Input
                        type="number"
                        value={editValues.x || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
                        className="w-20 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      point.x
                    )}
                  </TableCell>
                  <TableCell className="text-white">
                    {editingId === point.id ? (
                      <Input
                        type="number"
                        value={editValues.y || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
                        className="w-20 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      point.y
                    )}
                  </TableCell>
                  <TableCell className="text-white">
                    {editingId === point.id ? (
                      <Input
                        value={editValues.label || ''}
                        onChange={(e) => setEditValues(prev => ({ ...prev, label: e.target.value }))}
                        className="w-32 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      point.label || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30"
                        style={{ backgroundColor: point.color }}
                      />
                      {editingId === point.id ? (
                        <Input
                          type="color"
                          value={editValues.color || point.color}
                          onChange={(e) => setEditValues(prev => ({ ...prev, color: e.target.value }))}
                          className="w-16 h-8 bg-white/10 border-white/20"
                        />
                      ) : (
                        <span className="text-slate-400 text-sm font-mono">
                          {point.color}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {editingId === point.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={saveEdit}
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="text-slate-400 hover:text-slate-300 hover:bg-white/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(point)}
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePoint(point.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {dataset.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    No data points available. Add some data to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Summary Stats */}
        {dataset.data.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Data Range</p>
              <p className="text-white text-sm">
                X: {Math.min(...dataset.data.map(p => p.x))} - {Math.max(...dataset.data.map(p => p.x))}
              </p>
              <p className="text-white text-sm">
                Y: {Math.min(...dataset.data.map(p => p.y))} - {Math.max(...dataset.data.map(p => p.y))}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Average</p>
              <p className="text-white text-sm">
                X: {(dataset.data.reduce((sum, p) => sum + p.x, 0) / dataset.data.length).toFixed(2)}
              </p>
              <p className="text-white text-sm">
                Y: {(dataset.data.reduce((sum, p) => sum + p.y, 0) / dataset.data.length).toFixed(2)}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Data Quality</p>
              <p className="text-white text-sm">
                Labels: {dataset.data.filter(p => p.label).length}/{dataset.data.length}
              </p>
              <p className="text-white text-sm">
                Colors: {dataset.data.filter(p => p.color).length}/{dataset.data.length}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-slate-400 text-sm">Chart Type</p>
              <p className="text-white text-sm capitalize">{dataset.chartType}</p>
              <p className="text-slate-400 text-xs">
                Created: {new Date(dataset.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
