
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Dataset = Database['public']['Tables']['datasets']['Row'] & {
  data_points: Database['public']['Tables']['data_points']['Row'][];
};

export const useSupabaseData = (user: any) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDatasets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: datasetsData, error: datasetsError } = await supabase
        .from('datasets')
        .select(`
          *,
          data_points (*)
        `)
        .order('created_at', { ascending: false });

      if (datasetsError) throw datasetsError;

      setDatasets(datasetsData || []);
    } catch (error: any) {
      console.error('Error fetching datasets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch datasets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createDataset = async (name: string, chartType: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('datasets')
        .insert({
          name,
          chart_type: chartType,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newDataset = { ...data, data_points: [] };
      setDatasets(prev => [newDataset, ...prev]);
      
      toast({
        title: 'Success',
        description: `Dataset "${name}" created successfully`
      });

      return newDataset;
    } catch (error: any) {
      console.error('Error creating dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to create dataset',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteDataset = async (datasetId: string) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', datasetId);

      if (error) throw error;

      setDatasets(prev => prev.filter(ds => ds.id !== datasetId));
      
      toast({
        title: 'Success',
        description: 'Dataset deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete dataset',
        variant: 'destructive'
      });
    }
  };

  const addDataPoint = async (datasetId: string, x: number, y: number, label?: string) => {
    try {
      const { data, error } = await supabase
        .from('data_points')
        .insert({
          dataset_id: datasetId,
          x_value: x,
          y_value: y,
          label,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        })
        .select()
        .single();

      if (error) throw error;

      setDatasets(prev => prev.map(ds => 
        ds.id === datasetId 
          ? { ...ds, data_points: [...ds.data_points, data] }
          : ds
      ));

      toast({
        title: 'Success',
        description: `Data point (${x}, ${y}) added successfully`
      });

      return data;
    } catch (error: any) {
      console.error('Error adding data point:', error);
      toast({
        title: 'Error',
        description: 'Failed to add data point',
        variant: 'destructive'
      });
      return null;
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, [user]);

  return {
    datasets,
    loading,
    createDataset,
    deleteDataset,
    addDataPoint,
    refetch: fetchDatasets
  };
};
