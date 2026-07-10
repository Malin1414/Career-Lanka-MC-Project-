// TypeScript types for Career Lanka

export interface UserProfile {
  id: string;
  full_name: string;
  university: string;
  faculty: string;
  degree_program: string;
  academic_year: string;
  district?: string;
  skills: string[];
  interests: string[];
  career_goal?: string;
  profile_photo?: string;
  updated_at?: string;
}

export interface AssessmentAnswers {
  id?: string;
  student_id?: string;
  interests: string;
  programming_skills: string;
  soft_skills: string;
  favourite_subjects: string;
  preferred_working_style: string;
  career_interests: string;
  created_at?: string;
}

export interface RecommendedCareer {
  career_name: string;
  match_score: number; // 0 to 100
  reason: string;
  required_skills: string[];
  future_demand: string;
  salary_range: string; // e.g. "LKR 120,000 - 250,000"
  description: string;
  required_degree: string;
  recommended_certifications: string[];
  career_roadmap: string[];
  job_demand: string; // "High", "Medium", "Low"
  companies_hiring: string[];
  learning_resources: {
    title: string;
    provider: string;
    link: string;
  }[];
}

export interface SavedCareer extends RecommendedCareer {
  id: string;
  student_id: string;
  created_at?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  description: string;
  provider: string;
  link: string;
  category: string;
  tags: string[];
  created_at?: string;
}

// CV Builder Types
export interface CVEducation {
  id: string;
  institution: string;
  degree: string;
  period: string;
  gpa?: string;
  achievements?: string;
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface CVProject {
  id: string;
  name: string;
  role: string;
  description: string;
  techStack: string;
  link?: string;
}

export interface CVData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  address: string;
  summary: string;
  education: CVEducation[];
  skills: string[];
  languages: string[];
  experience: CVExperience[];
  projects: CVProject[];
  certifications: string[];
  achievements: string[];
  references: string;
}
