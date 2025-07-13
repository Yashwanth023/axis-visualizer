
-- Create a table for datasets
CREATE TABLE public.datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  chart_type TEXT NOT NULL CHECK (chart_type IN ('line', 'bar', 'scatter', 'area', '3d')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for data points
CREATE TABLE public.data_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dataset_id UUID REFERENCES public.datasets ON DELETE CASCADE NOT NULL,
  x_value FLOAT NOT NULL,
  y_value FLOAT NOT NULL,
  label TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_points ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for datasets
CREATE POLICY "Users can view their own datasets" 
  ON public.datasets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own datasets" 
  ON public.datasets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own datasets" 
  ON public.datasets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own datasets" 
  ON public.datasets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for data points
CREATE POLICY "Users can view data points of their datasets" 
  ON public.data_points 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.datasets 
      WHERE datasets.id = data_points.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create data points for their datasets" 
  ON public.data_points 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.datasets 
      WHERE datasets.id = data_points.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update data points of their datasets" 
  ON public.data_points 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.datasets 
      WHERE datasets.id = data_points.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete data points of their datasets" 
  ON public.data_points 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.datasets 
      WHERE datasets.id = data_points.dataset_id 
      AND datasets.user_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_datasets_updated_at 
  BEFORE UPDATE ON public.datasets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
