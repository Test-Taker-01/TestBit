
-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  course TEXT,
  type TEXT NOT NULL DEFAULT 'document',
  drive_link TEXT,
  content TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policies for resources
CREATE POLICY "Anyone can view resources" 
  ON public.resources 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create resources" 
  ON public.resources 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own resources" 
  ON public.resources 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own resources" 
  ON public.resources 
  FOR DELETE 
  USING (auth.uid() = created_by);
