
-- Drop existing trigger and function if they exist to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.generate_student_id();

-- Recreate the function to generate student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  existing_count INTEGER;
BEGIN
  LOOP
    -- Generate a student ID in format STU + 6 digits
    new_id := 'STU' || LPAD(FLOOR(RANDOM() * 999999 + 1)::TEXT, 6, '0');
    
    -- Check if this ID already exists
    SELECT COUNT(*) INTO existing_count 
    FROM public.profiles 
    WHERE student_id = new_id;
    
    -- If unique, exit loop
    IF existing_count = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Recreate the function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    name, 
    email, 
    user_type,
    student_id
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'student'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'user_type', 'student') = 'student' 
      THEN public.generate_student_id()
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
