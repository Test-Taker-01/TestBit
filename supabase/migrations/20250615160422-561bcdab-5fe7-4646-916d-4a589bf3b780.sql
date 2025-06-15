
-- Check current RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Also check if there are actually student profiles in the database
SELECT user_type, COUNT(*) 
FROM public.profiles 
GROUP BY user_type;

-- Let's also see all profiles to understand what's there
SELECT id, user_id, name, email, user_type, student_id, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
