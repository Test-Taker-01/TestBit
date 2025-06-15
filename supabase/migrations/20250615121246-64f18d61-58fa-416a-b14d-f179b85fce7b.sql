
-- Fix RLS policies for test deletion

-- First, let's ensure teachers can delete test results for tests they created
DROP POLICY IF EXISTS "Teachers can delete test results for their tests" ON public.test_results;

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

-- Ensure teachers can delete their own tests
DROP POLICY IF EXISTS "Teachers can delete their own tests" ON public.tests;

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

-- Add a policy to allow admins to view all profiles (needed for the deletion process)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p2
      WHERE p2.user_id = auth.uid() 
      AND p2.user_type = 'admin'
    )
  );
