
-- First, disable RLS temporarily to clean up
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.profiles;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-conflicting policies
CREATE POLICY "Enable read access for users to their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users on their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);
