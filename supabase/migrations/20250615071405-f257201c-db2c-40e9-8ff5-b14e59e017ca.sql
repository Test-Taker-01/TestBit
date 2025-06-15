
-- Drop the existing restrictive policy for viewing profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policies that allow both users to view their own profiles and admins to view all profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND user_type = 'admin'
    )
  );
