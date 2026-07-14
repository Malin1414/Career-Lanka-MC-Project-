import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AssessmentAnswers, SavedCareer, CVData } from '../types';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: { id: string; email: string; role: 'student' | 'recruiter' } | null;
  profile: UserProfile | null;
  savedCareers: SavedCareer[];
  assessmentAnswers: AssessmentAnswers | null;
  cvData: CVData | null;
  loading: boolean;
  profileLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  signUp: (
    email: string,
    password: string,
    profileData: Omit<UserProfile, 'id' | 'updated_at'>,
    role: 'student' | 'recruiter'
  ) => Promise<{ success: boolean; error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; error: string | null }>;
  saveCareer: (career: Omit<SavedCareer, 'id' | 'student_id' | 'created_at'>) => Promise<{ success: boolean; id?: string }>;
  deleteSavedCareer: (careerId: string) => Promise<{ success: boolean }>;
  saveCV: (cv: CVData) => Promise<{ success: boolean }>;
  saveAssessment: (answers: AssessmentAnswers) => Promise<{ success: boolean }>;
  clearAllData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Legacy/Fallback Default Profile Mock Data (for demo-student)
const DEFAULT_PROFILE: UserProfile = {
  id: 'demo-student',
  full_name: 'Saman Perera',
  university: 'University of Colombo',
  faculty: 'School of Computing',
  degree_program: 'BSc Hons in Computer Science',
  academic_year: 'Undergraduate Finalist',
  district: 'Colombo, Sri Lanka',
  skills: ['Python', 'React / Next.js', 'AWS Cloud', 'TypeScript', 'PostgreSQL', 'Docker', 'GraphQL'],
  interests: ['Software Development', 'Artificial Intelligence', 'Cloud Computing', 'UI/UX Design'],
  career_goal: 'Full Stack Software Engineer or AI Solutions Architect',
  profile_photo: '',
  updated_at: new Date().toISOString(),
};

// Legacy/Fallback Default CV Mock Data (for demo-student)
const DEFAULT_CV: CVData = {
  fullName: 'Saman Perera',
  title: 'Full Stack Developer',
  email: 'demo@student.lk',
  phone: '+94 77 123 4567',
  github: 'github.com/samanp',
  linkedin: 'linkedin.com/in/samanperera',
  address: 'Colombo, Sri Lanka',
  summary: 'High-achieving Computer Science undergraduate finalist with hands-on experience building scalable web solutions and deploying custom AI models. Passionate about software engineering, cloud computing, and DevOps.',
  education: [
    {
      id: 'edu-1',
      institution: 'University of Colombo School of Computing',
      degree: 'BSc Hons in Computer Science',
      period: '2022 - Present',
      gpa: '3.85 / 4.00',
      achievements: "Dean's List (2022, 2023, 2024), 1st Place in Inter-University Hackathon 2025.",
    }
  ],
  skills: ['Python', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Next.js', 'AWS Cloud', 'Docker', 'Node.js', 'PostgreSQL', 'Git & GitHub'],
  languages: ['English (Professional Working)', 'Sinhala (Native)'],
  experience: [
    {
      id: 'exp-1',
      company: 'Self-Employed (Remote)',
      role: 'Freelance Developer',
      period: 'Nov 2024 - Present',
      description: 'Architected and deployed scalable SaaS solutions for local retail businesses. Built custom AI integrations utilizing OpenAI and local datasets.',
    },
    {
      id: 'exp-2',
      company: 'Global Tech Solutions (Colombo)',
      role: 'Software Engineering Intern',
      period: 'Mar 2024 - Oct 2024',
      description: 'Contributed to the core internal dashboard using React and Redux. Reduced API response latency by 15% through data fetching and state caching optimization.',
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'AI-Driven Job Matcher',
      role: 'Lead Developer',
      description: 'A predictive analytics tool that maps student skills to real-time market demand using local industry datasets. Designed and implemented the recommendation engine.',
      techStack: 'Python, FastAPI, React Native, OpenAI API, PostgreSQL',
      link: 'github.com/samanp/job-matcher',
    }
  ],
  certifications: [
    'AWS Certified Developer - Associate (2024)',
    'Scrum Alliance Certified ScrumMaster (2024)'
  ],
  achievements: [
    'Winner of HackX Inter-University Hackathon 2025',
    'Open Source Contributor to React Native core components'
  ],
  references: 'Dr. K. Wickramasinghe, Senior Lecturer, UCSC (k.wick@ucsc.cmb.ac.lk, +94 11 258 1245)'
};

// Storage Keys Helper
const getProfileKey = (uid: string) => `@profile_${uid}`;
const getCVKey = (uid: string) => `@cv_data_${uid}`;
const getSavedCareersKey = (uid: string) => `@saved_careers_${uid}`;
const getAssessmentAnswersKey = (uid: string) => `@assessment_answers_${uid}`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; role: 'student' | 'recruiter' } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedCareers, setSavedCareers] = useState<SavedCareer[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswers | null>(null);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Load active user session on app launch
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user_session');

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Retrieve user-specific data from storage
          const uid = parsedUser.id;
          const userProfileKey = getProfileKey(uid);
          const userCVKey = getCVKey(uid);
          const userCareersKey = getSavedCareersKey(uid);
          const userAssessKey = getAssessmentAnswersKey(uid);

          const storedProfile = await AsyncStorage.getItem(userProfileKey);
          const storedCV = await AsyncStorage.getItem(userCVKey);
          const storedSavedCareers = await AsyncStorage.getItem(userCareersKey);
          const storedAssessment = await AsyncStorage.getItem(userAssessKey);

          // Dynamic migration logic from legacy keys to user-specific keys (for demo-student)
          if (uid === 'demo-student') {
            if (storedProfile) {
              setProfile(JSON.parse(storedProfile));
            } else {
              const legacyProfile = await AsyncStorage.getItem('@user_profile');
              if (legacyProfile) {
                await AsyncStorage.setItem(userProfileKey, legacyProfile);
                setProfile(JSON.parse(legacyProfile));
              } else {
                await AsyncStorage.setItem(userProfileKey, JSON.stringify(DEFAULT_PROFILE));
                setProfile(DEFAULT_PROFILE);
              }
            }

            if (storedCV) {
              setCvData(JSON.parse(storedCV));
            } else {
              const legacyCV = await AsyncStorage.getItem('@cv_data');
              if (legacyCV) {
                await AsyncStorage.setItem(userCVKey, legacyCV);
                setCvData(JSON.parse(legacyCV));
              } else {
                await AsyncStorage.setItem(userCVKey, JSON.stringify(DEFAULT_CV));
                setCvData(DEFAULT_CV);
              }
            }

            if (storedSavedCareers) {
              setSavedCareers(JSON.parse(storedSavedCareers));
            } else {
              const legacyCareers = await AsyncStorage.getItem('@saved_careers');
              if (legacyCareers) {
                await AsyncStorage.setItem(userCareersKey, legacyCareers);
                setSavedCareers(JSON.parse(legacyCareers));
              }
            }

            if (storedAssessment) {
              setAssessmentAnswers(JSON.parse(storedAssessment));
            } else {
              const legacyAssess = await AsyncStorage.getItem('@assessment_answers');
              if (legacyAssess) {
                await AsyncStorage.setItem(userAssessKey, legacyAssess);
                setAssessmentAnswers(JSON.parse(legacyAssess));
              }
            }
          } else {
            // Loading data for a registered user
            if (storedProfile) setProfile(JSON.parse(storedProfile));
            if (storedCV) setCvData(JSON.parse(storedCV));
            if (storedSavedCareers) setSavedCareers(JSON.parse(storedSavedCareers));
            if (storedAssessment) setAssessmentAnswers(JSON.parse(storedAssessment));

            // Sync from Supabase tables asynchronously to ensure freshest remote state
            try {
              const { data: dbProfile } = await supabase
                .from('student_profiles')
                .select('*')
                .eq('id', uid)
                .single();
              if (dbProfile) {
                setProfile(dbProfile);
                await AsyncStorage.setItem(userProfileKey, JSON.stringify(dbProfile));
              }

              const { data: dbCareers } = await supabase
                .from('saved_careers')
                .select('*')
                .eq('student_id', uid);
              if (dbCareers && dbCareers.length > 0) {
                setSavedCareers(dbCareers);
                await AsyncStorage.setItem(userCareersKey, JSON.stringify(dbCareers));
              }

              const { data: dbAssess } = await supabase
                .from('career_assessments')
                .select('*')
                .eq('student_id', uid)
                .order('created_at', { ascending: false })
                .limit(1);
              if (dbAssess && dbAssess.length > 0) {
                setAssessmentAnswers(dbAssess[0]);
                await AsyncStorage.setItem(userAssessKey, JSON.stringify(dbAssess[0]));
              }
            } catch (syncErr) {
              console.warn('Supabase sync warning (using local cached state):', syncErr);
            }
          }
        }
      } catch (e) {
        console.error('Failed to load local storage state:', e);
      } finally {
        setLoading(false);
      }
    };

    loadSavedState();
  }, []);

  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check against default local demo account
    if (cleanEmail === 'demo@student.lk') {
      if (password === '123456') {
        const mockSession = { id: 'demo-student', email: 'demo@student.lk', role: 'student' as const };
        try {
          await AsyncStorage.setItem('@user_session', JSON.stringify(mockSession));
          
          const userProfileKey = getProfileKey('demo-student');
          const storedProfile = await AsyncStorage.getItem(userProfileKey);
          let localProfile = DEFAULT_PROFILE;
          if (storedProfile) {
            localProfile = JSON.parse(storedProfile);
          } else {
            await AsyncStorage.setItem(userProfileKey, JSON.stringify(localProfile));
          }

          const userCVKey = getCVKey('demo-student');
          const storedCV = await AsyncStorage.getItem(userCVKey);
          let localCV = DEFAULT_CV;
          if (storedCV) {
            localCV = JSON.parse(storedCV);
          } else {
            await AsyncStorage.setItem(userCVKey, JSON.stringify(localCV));
          }

          const userCareersKey = getSavedCareersKey('demo-student');
          const storedSavedCareers = await AsyncStorage.getItem(userCareersKey);
          if (storedSavedCareers) {
            setSavedCareers(JSON.parse(storedSavedCareers));
          } else {
            setSavedCareers([]);
          }

          const userAssessKey = getAssessmentAnswersKey('demo-student');
          const storedAssessment = await AsyncStorage.getItem(userAssessKey);
          if (storedAssessment) {
            setAssessmentAnswers(JSON.parse(storedAssessment));
          } else {
            setAssessmentAnswers(null);
          }

          setUser(mockSession);
          setProfile(localProfile);
          setCvData(localCV);
          
          return { success: true, error: null };
        } catch (e: any) {
          return { success: false, error: e.message || 'Storage error' };
        }
      } else {
        return { success: false, error: 'Wrong password' };
      }
    }

    // Attempt remote Supabase authentication
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        // Fallback: Check against local AsyncStorage registered users
        const storedUsers = await AsyncStorage.getItem('@registered_users');
        const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
        const matchedLocalUser = registeredUsers.find(
          (u: any) => u.email.toLowerCase() === cleanEmail
        );

        if (matchedLocalUser && matchedLocalUser.password === password) {
          const userSession = {
            id: matchedLocalUser.id,
            email: matchedLocalUser.email,
            role: (matchedLocalUser.role || 'student') as 'student' | 'recruiter'
          };
          await AsyncStorage.setItem('@user_session', JSON.stringify(userSession));

          const localProfileKey = getProfileKey(matchedLocalUser.id);
          const localCVKey = getCVKey(matchedLocalUser.id);
          const localCareersKey = getSavedCareersKey(matchedLocalUser.id);
          const localAssessKey = getAssessmentAnswersKey(matchedLocalUser.id);

          const storedProfile = await AsyncStorage.getItem(localProfileKey);
          const storedCV = await AsyncStorage.getItem(localCVKey);
          const storedCareers = await AsyncStorage.getItem(localCareersKey);
          const storedAssess = await AsyncStorage.getItem(localAssessKey);

          setUser(userSession);
          setProfile(storedProfile ? JSON.parse(storedProfile) : null);
          setCvData(storedCV ? JSON.parse(storedCV) : null);
          setSavedCareers(storedCareers ? JSON.parse(storedCareers) : []);
          setAssessmentAnswers(storedAssess ? JSON.parse(storedAssess) : null);

          return { success: true, error: null };
        }

        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Authentication failed. Please verify credentials.' };
      }

      // Supabase Authenticated - Load Profile and credentials
      const uid = authData.user.id;

      // Determine role from metadata or profile table (assuming metadata for now or default student)
      const role = (authData.user.user_metadata?.role || 'student') as 'student' | 'recruiter';
      const userSession = { id: uid, email: cleanEmail, role };
      await AsyncStorage.setItem('@user_session', JSON.stringify(userSession));

      const userProfileKey = getProfileKey(uid);
      const userCVKey = getCVKey(uid);
      const userCareersKey = getSavedCareersKey(uid);
      const userAssessKey = getAssessmentAnswersKey(uid);

      // Fetch Profile from Supabase student_profiles
      let activeProfile: UserProfile | null = null;
      try {
        const { data: dbProfile } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('id', uid)
          .single();
        if (dbProfile) {
          activeProfile = dbProfile;
          await AsyncStorage.setItem(userProfileKey, JSON.stringify(dbProfile));
        }
      } catch (e) {
        console.warn('Failed to retrieve remote student profile:', e);
      }

      // If remote profile lookup fails, load local copy
      if (!activeProfile) {
        const storedProfile = await AsyncStorage.getItem(userProfileKey);
        if (storedProfile) activeProfile = JSON.parse(storedProfile);
      }

      // Fetch assessments from remote
      let activeAssessment: AssessmentAnswers | null = null;
      try {
        const { data: dbAssess } = await supabase
          .from('career_assessments')
          .select('*')
          .eq('student_id', uid)
          .order('created_at', { ascending: false })
          .limit(1);
        if (dbAssess && dbAssess.length > 0) {
          activeAssessment = dbAssess[0];
          await AsyncStorage.setItem(userAssessKey, JSON.stringify(activeAssessment));
        }
      } catch (e) {
        console.warn('Failed to retrieve remote career assessments:', e);
      }

      if (!activeAssessment) {
        const storedAssess = await AsyncStorage.getItem(userAssessKey);
        if (storedAssess) activeAssessment = JSON.parse(storedAssess);
      }

      // Fetch saved careers from remote
      let activeCareers: SavedCareer[] = [];
      try {
        const { data: dbCareers } = await supabase
          .from('saved_careers')
          .select('*')
          .eq('student_id', uid);
        if (dbCareers) {
          activeCareers = dbCareers;
          await AsyncStorage.setItem(userCareersKey, JSON.stringify(activeCareers));
        }
      } catch (e) {
        console.warn('Failed to retrieve remote saved careers:', e);
      }

      if (activeCareers.length === 0) {
        const storedCareers = await AsyncStorage.getItem(userCareersKey);
        if (storedCareers) activeCareers = JSON.parse(storedCareers);
      }

      const storedCV = await AsyncStorage.getItem(userCVKey);

      setUser(userSession);
      setProfile(activeProfile);
      setSavedCareers(activeCareers);
      setAssessmentAnswers(activeAssessment);
      setCvData(storedCV ? JSON.parse(storedCV) : null);

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message || 'Verification error' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<UserProfile, 'id' | 'updated_at'>,
    role: 'student' | 'recruiter' = 'student'
  ) => {
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'demo@student.lk') {
      return { success: false, error: 'Cannot register using the demo account.' };
    }

    try {
      // 1. SignUp via Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { role }
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      const newUserId = authData.user?.id || 'student-' + Math.random().toString(36).substring(7);

      // 2. Create profile payload
      const newProfile: UserProfile = {
        id: newUserId,
        ...profileData,
        profile_photo: profileData.profile_photo || '',
        updated_at: new Date().toISOString(),
      };

      // 3. Write profile to Supabase student_profiles
      try {
        await supabase.from('student_profiles').insert({
          id: newUserId,
          full_name: newProfile.full_name,
          university: newProfile.university,
          faculty: newProfile.faculty || '',
          degree_program: newProfile.degree_program,
          academic_year: newProfile.academic_year,
          district: newProfile.district || '',
          skills: newProfile.skills || [],
          interests: newProfile.interests || [],
          career_goal: newProfile.career_goal || '',
          profile_photo: newProfile.profile_photo,
        });
      } catch (insertErr) {
        console.warn('Failed to insert remote student profile:', insertErr);
      }

      // Save profile to user-specific local storage
      await AsyncStorage.setItem(getProfileKey(newUserId), JSON.stringify(newProfile));

      // 4. Pre-seed standard template CV
      const customCV: CVData = {
        fullName: profileData.full_name,
        title: 'Undergraduate Student',
        email: cleanEmail,
        phone: '',
        github: '',
        linkedin: '',
        address: profileData.district || 'Sri Lanka',
        summary: `Undergraduate student in ${profileData.degree_program} at ${profileData.university}. Seeking guidance and opportunities.`,
        education: [
          {
            id: 'edu-new',
            institution: profileData.university,
            degree: profileData.degree_program,
            period: 'Present',
          }
        ],
        skills: profileData.skills || [],
        languages: ['English', 'Sinhala'],
        experience: [],
        projects: [],
        certifications: [],
        achievements: [],
        references: ''
      };
      await AsyncStorage.setItem(getCVKey(newUserId), JSON.stringify(customCV));

      // 5. Append locally for offline support
      const storedUsers = await AsyncStorage.getItem('@registered_users');
      const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
      const newUserRecord = {
        id: newUserId,
        email: cleanEmail,
        password: password,
        role: role,
      };
      await AsyncStorage.setItem(
        '@registered_users',
        JSON.stringify([...registeredUsers, newUserRecord])
      );

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to register account' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Attempt remote sign out but ignore failures so local state is always cleared
      await supabase.auth.signOut().catch((err) => {
        console.warn('Supabase remote sign out failed, clearing local state anyway:', err);
      });
    } catch (e) {
      console.warn('Sign out error:', e);
    } finally {
      try {
        await AsyncStorage.removeItem('@user_session');
      } catch (err) {
        console.error('AsyncStorage clear user session error:', err);
      }
      setUser(null);
      setProfile(null);
      setCvData(null);
      setSavedCareers([]);
      setAssessmentAnswers(null);
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No active session' };

    setProfileLoading(true);
    try {
      if (!profile) throw new Error('No profile exists to update');
      const updatedProfile = {
        ...profile,
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      // 1. Save local copy
      await AsyncStorage.setItem(getProfileKey(user.id), JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      // 2. Sync to Supabase student_profiles
      if (user.id !== 'demo-student') {
        try {
          await supabase
            .from('student_profiles')
            .update({
              full_name: updatedProfile.full_name,
              university: updatedProfile.university,
              faculty: updatedProfile.faculty || '',
              degree_program: updatedProfile.degree_program,
              academic_year: updatedProfile.academic_year,
              district: updatedProfile.district || '',
              skills: updatedProfile.skills || [],
              interests: updatedProfile.interests || [],
              career_goal: updatedProfile.career_goal || '',
              profile_photo: updatedProfile.profile_photo || '',
              updated_at: updatedProfile.updated_at,
            })
            .eq('id', user.id);
        } catch (dbErr) {
          console.warn('Failed to sync updated profile to database:', dbErr);
        }
      }

      // Keep CV full name and address synced
      if (cvData) {
        const updatedCV = {
          ...cvData,
          fullName: updatedProfile.full_name,
          address: updatedProfile.district || cvData.address,
        };
        await AsyncStorage.setItem(getCVKey(user.id), JSON.stringify(updatedCV));
        setCvData(updatedCV);
      }

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to update profile' };
    } finally {
      setProfileLoading(false);
    }
  };

  const saveCareer = async (career: Omit<SavedCareer, 'id' | 'student_id' | 'created_at'>) => {
    if (!user) return { success: false };

    try {
      const newId = 'saved-' + Math.random().toString(36).substring(7);
      const newSavedItem: SavedCareer = {
        ...career,
        id: newId,
        student_id: user.id,
        created_at: new Date().toISOString(),
      };

      // Local save
      const updated = [newSavedItem, ...savedCareers];
      await AsyncStorage.setItem(getSavedCareersKey(user.id), JSON.stringify(updated));
      setSavedCareers(updated);

      // Sync to Supabase table
      if (user.id !== 'demo-student') {
        try {
          await supabase.from('saved_careers').insert({
            student_id: user.id,
            career_name: career.career_name,
            match_score: career.match_score,
            reason: career.reason,
            required_skills: career.required_skills,
            future_demand: career.future_demand,
            salary_range: career.salary_range,
            description: career.description,
            required_degree: career.required_degree,
            recommended_certifications: career.recommended_certifications,
            career_roadmap: career.career_roadmap,
            job_demand: career.job_demand,
            companies_hiring: career.companies_hiring,
            learning_resources: career.learning_resources,
          });
        } catch (syncErr) {
          console.warn('Saved career sync error:', syncErr);
        }
      }

      return { success: true, id: newId };
    } catch (e) {
      return { success: false };
    }
  };

  const deleteSavedCareer = async (careerId: string) => {
    if (!user) return { success: false };

    try {
      const itemToDelete = savedCareers.find((item) => item.id === careerId);
      const updated = savedCareers.filter((item) => item.id !== careerId);
      await AsyncStorage.setItem(getSavedCareersKey(user.id), JSON.stringify(updated));
      setSavedCareers(updated);

      // Sync delete with Supabase
      if (user.id !== 'demo-student' && itemToDelete) {
        try {
          await supabase
            .from('saved_careers')
            .delete()
            .eq('student_id', user.id)
            .eq('career_name', itemToDelete.career_name);
        } catch (syncErr) {
          console.warn('Saved career delete sync error:', syncErr);
        }
      }

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };

  const saveCV = async (updatedCv: CVData) => {
    if (!user) return { success: false };

    try {
      await AsyncStorage.setItem(getCVKey(user.id), JSON.stringify(updatedCv));
      setCvData(updatedCv);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };

  const saveAssessment = async (answers: AssessmentAnswers) => {
    if (!user) return { success: false };

    try {
      const mockAnswers = {
        ...answers,
        id: 'assess-' + Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
      };
      await AsyncStorage.setItem(getAssessmentAnswersKey(user.id), JSON.stringify(mockAnswers));
      setAssessmentAnswers(mockAnswers);

      // Sync assessment details with Supabase
      if (user.id !== 'demo-student') {
        try {
          await supabase.from('career_assessments').insert({
            student_id: user.id,
            interests: answers.interests,
            programming_skills: answers.programming_skills,
            soft_skills: answers.soft_skills,
            favourite_subjects: answers.favourite_subjects,
            preferred_working_style: answers.preferred_working_style,
            career_interests: answers.career_interests,
          });
        } catch (syncErr) {
          console.warn('Career assessment sync error:', syncErr);
        }
      }

      return { success: true };
    } catch (e) {
      return { success: false };
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
      setProfile(null);
      setSavedCareers([]);
      setAssessmentAnswers(null);
      setCvData(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        savedCareers,
        assessmentAnswers,
        cvData,
        loading,
        profileLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        saveCareer,
        deleteSavedCareer,
        saveCV,
        saveAssessment,
        clearAllData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
