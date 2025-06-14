
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'student')),
  student_id TEXT UNIQUE, -- Only for students, auto-generated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT,
  duration INTEGER NOT NULL, -- in minutes
  questions JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_published BOOLEAN DEFAULT true
);

-- Create test results table
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, test_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for tests
CREATE POLICY "Everyone can view published tests" ON public.tests
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can insert tests" ON public.tests
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'
  ));

CREATE POLICY "Admins can update their own tests" ON public.tests
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for test results
CREATE POLICY "Students can view their own results" ON public.test_results
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own results" ON public.test_results
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins can view all results" ON public.test_results
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND user_type = 'admin'
  ));

-- Function to generate student ID
CREATE OR REPLACE FUNCTION generate_student_id()
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

-- Function to handle new user signup
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
      THEN generate_student_id()
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
