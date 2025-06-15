
-- Create a table to store the teacher special code
CREATE TABLE public.teacher_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  special_code TEXT NOT NULL DEFAULT 'Gaurang@14',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the default special code
INSERT INTO public.teacher_settings (special_code) VALUES ('Gaurang@14');

-- Add Row Level Security
ALTER TABLE public.teacher_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows admins to view and update the special code
CREATE POLICY "Admins can view teacher settings" 
  ON public.teacher_settings 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update teacher settings" 
  ON public.teacher_settings 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create a function to get the current special code (accessible to all authenticated users for validation)
CREATE OR REPLACE FUNCTION public.get_teacher_special_code()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT special_code FROM public.teacher_settings ORDER BY updated_at DESC LIMIT 1;
$$;
