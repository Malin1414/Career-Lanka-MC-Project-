-- Database Setup SQL Script for Career Compass Lanka
-- Run this in your Supabase SQL Editor

-- Enable UUID generation extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

----------------------------------------------------
-- 1. STUDENT PROFILES TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    university TEXT NOT NULL,
    faculty TEXT NOT NULL,
    degree_program TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    district TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    career_goal TEXT,
    profile_photo TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

-- Create Policies for student_profiles
CREATE POLICY "Allow users to view their own profile" 
    ON public.student_profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile" 
    ON public.student_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" 
    ON public.student_profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Allow users to delete their own profile" 
    ON public.student_profiles FOR DELETE 
    USING (auth.uid() = id);

----------------------------------------------------
-- 2. CAREER ASSESSMENTS TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    interests TEXT NOT NULL,
    programming_skills TEXT NOT NULL,
    soft_skills TEXT NOT NULL,
    favourite_subjects TEXT NOT NULL,
    preferred_working_style TEXT NOT NULL,
    career_interests TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.career_assessments ENABLE ROW LEVEL SECURITY;

-- Create Policies for career_assessments
CREATE POLICY "Allow users to view their own assessments" 
    ON public.career_assessments FOR SELECT 
    USING (auth.uid() = student_id);

CREATE POLICY "Allow users to insert their own assessments" 
    ON public.career_assessments FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Allow users to update their own assessments" 
    ON public.career_assessments FOR UPDATE 
    USING (auth.uid() = student_id);

CREATE POLICY "Allow users to delete their own assessments" 
    ON public.career_assessments FOR DELETE 
    USING (auth.uid() = student_id);

----------------------------------------------------
-- 3. CAREER RECOMMENDATIONS TABLE (AI Responses Cache)
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.career_assessments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recommended_careers JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;

-- Create Policies for career_recommendations
CREATE POLICY "Allow users to view their own recommendations" 
    ON public.career_recommendations FOR SELECT 
    USING (auth.uid() = student_id);

CREATE POLICY "Allow users to insert their own recommendations" 
    ON public.career_recommendations FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Allow users to delete their own recommendations" 
    ON public.career_recommendations FOR DELETE 
    USING (auth.uid() = student_id);

----------------------------------------------------
-- 4. SAVED CAREERS TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    career_name TEXT NOT NULL,
    match_score INTEGER NOT NULL,
    reason TEXT NOT NULL,
    required_skills TEXT[] NOT NULL,
    future_demand TEXT NOT NULL,
    salary_range TEXT NOT NULL,
    description TEXT NOT NULL,
    required_degree TEXT NOT NULL,
    recommended_certifications TEXT[] NOT NULL,
    career_roadmap TEXT[] NOT NULL,
    job_demand TEXT NOT NULL,
    companies_hiring TEXT[] NOT NULL,
    learning_resources JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_careers ENABLE ROW LEVEL SECURITY;

-- Create Policies for saved_careers
CREATE POLICY "Allow users to view their own saved careers" 
    ON public.saved_careers FOR SELECT 
    USING (auth.uid() = student_id);

CREATE POLICY "Allow users to insert their own saved careers" 
    ON public.saved_careers FOR INSERT 
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Allow users to delete their own saved careers" 
    ON public.saved_careers FOR DELETE 
    USING (auth.uid() = student_id);

----------------------------------------------------
-- 5. LEARNING RESOURCES TABLE
----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    provider TEXT NOT NULL,
    link TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- Create Policies for learning_resources (Read-only for all authenticated users)
CREATE POLICY "Allow authenticated users to view learning resources" 
    ON public.learning_resources FOR SELECT 
    TO authenticated
    USING (true);

----------------------------------------------------
-- SEED DATA FOR LEARNING RESOURCES
----------------------------------------------------
INSERT INTO public.learning_resources (title, description, provider, link, category, tags) VALUES
('Coursera - Google Data Analytics Professional Certificate', 'Gain in-demand skills that can lead to an entry-level job in data analytics. Learn data cleaning, analysis, visualization, and R programming.', 'Coursera', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Data Science', '{"data analytics", "python", "sql", "r"}'),
('Coursera - Meta Front-End Developer Professional Certificate', 'Prepare for a career as a front-end developer. Learn HTML, CSS, JavaScript, React, and UX design principles.', 'Coursera', 'https://www.coursera.org/professional-certificates/meta-front-end-developer', 'Software Engineering', '{"frontend", "react", "javascript", "css"}'),
('freeCodeCamp - Responsive Web Design Certification', 'Learn the basics of web design, including HTML, CSS, visual design, and accessibility by building projects.', 'freeCodeCamp', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', 'Web Development', '{"html", "css", "web design"}'),
('freeCodeCamp - Scientific Computing with Python', 'Learn Python from basics to data structures, algorithms, and logic by building several console apps.', 'freeCodeCamp', 'https://www.freecodecamp.org/learn/scientific-computing-with-python/', 'Python Programming', '{"python", "programming", "algorithms"}'),
('Cisco Networking Academy - Introduction to Cybersecurity', 'Explore the field of cybersecurity, including the threats, vulnerabilities, and how organizations protect themselves.', 'Cisco Networking Academy', 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity', 'Cybersecurity', '{"security", "networking", "cybersecurity"}'),
('Google Career Certificates - Project Management', 'Learn the foundations of traditional and agile project management, project planning, and documentation.', 'Google', 'https://grow.google/certificates/project-management/', 'Project Management', '{"agile", "scrum", "project management"}'),
('Microsoft Learn - Azure Fundamentals (AZ-900)', 'Understand foundational cloud concepts, Azure services, security, privacy, compliance, and trust.', 'Microsoft Learn', 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/', 'Cloud Computing', '{"azure", "cloud", "fundamentals"}'),
('YouTube - Harvard CS50: Introduction to Computer Science', 'The legendary introductory course on computer science covering C, Python, SQL, JavaScript, CSS, and HTML.', 'YouTube Resources', 'https://www.youtube.com/watch?v=8mAITcNt70k', 'Computer Science', '{"cs50", "algorithms", "programming"}'),
('YouTube - Traversy Media: React JS Crash Course', 'Learn the basics of React, including components, props, state, hooks, and routing in this hands-on tutorial.', 'YouTube Resources', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 'Web Development', '{"react", "javascript", "frontend"}')
ON CONFLICT DO NOTHING;
