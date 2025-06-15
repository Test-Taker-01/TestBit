
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Everyone can view published tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can insert tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can update their own tests" ON public.tests;
DROP POLICY IF EXISTS "Students can view their own results" ON public.test_results;
DROP POLICY IF EXISTS "Students can insert their own results" ON public.test_results;
DROP POLICY IF EXISTS "Admins can view all results" ON public.test_results;

-- Add additional profile fields for enhanced user profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS department TEXT,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS address TEXT;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for tests
CREATE POLICY "Teachers can view all tests" 
  ON public.tests 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Teachers can create tests" 
  ON public.tests 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
    AND auth.uid() = created_by
  );

CREATE POLICY "Teachers can update their own tests" 
  ON public.tests 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
    AND auth.uid() = created_by
  );

CREATE POLICY "Teachers can delete their own tests" 
  ON public.tests 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
    AND auth.uid() = created_by
  );

-- Students can only view published tests
CREATE POLICY "Students can view published tests" 
  ON public.tests 
  FOR SELECT 
  TO authenticated
  USING (
    is_published = true
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'student'
    )
  );

-- Create policies for test_results
CREATE POLICY "Teachers can view all test results" 
  ON public.test_results 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Students can view their own test results" 
  ON public.test_results 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own test results" 
  ON public.test_results 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Teachers can delete test results for their tests" 
  ON public.test_results 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
    AND EXISTS (
      SELECT 1 FROM public.tests 
      WHERE id = test_id 
      AND created_by = auth.uid()
    )
  );
