import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AssessmentAnswers, SavedCareer, CVData } from '../types';

interface AuthContextType {
  user: { id: string; email: string } | null;
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
    profileData: Omit<UserProfile, 'id' | 'updated_at'>
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
  profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
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
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
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
              // Try legacy key
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
              // Try legacy key
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
              // Try legacy key
              const legacyCareers = await AsyncStorage.getItem('@saved_careers');
              if (legacyCareers) {
                await AsyncStorage.setItem(userCareersKey, legacyCareers);
                setSavedCareers(JSON.parse(legacyCareers));
              }
            }

            if (storedAssessment) {
              setAssessmentAnswers(JSON.parse(storedAssessment));
            } else {
              // Try legacy key
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
    // Artificial delay to simulate server communication
    await new Promise((res) => setTimeout(res, 1200));

    const cleanEmail = email.trim().toLowerCase();

    // Check against default demo account
    if (cleanEmail === 'demo@student.lk') {
      if (password === '123456') {
        const mockSession = { id: 'demo-student', email: 'demo@student.lk' };
        
        try {
          await AsyncStorage.setItem('@user_session', JSON.stringify(mockSession));
          
          // Load user-specific profile
          const userProfileKey = getProfileKey('demo-student');
          const storedProfile = await AsyncStorage.getItem(userProfileKey);
          let localProfile = DEFAULT_PROFILE;
          if (storedProfile) {
            localProfile = JSON.parse(storedProfile);
          } else {
            // Try legacy migration
            const legacyProfile = await AsyncStorage.getItem('@user_profile');
            if (legacyProfile) {
              localProfile = JSON.parse(legacyProfile);
            }
            await AsyncStorage.setItem(userProfileKey, JSON.stringify(localProfile));
          }

          // Load user-specific CV
          const userCVKey = getCVKey('demo-student');
          const storedCV = await AsyncStorage.getItem(userCVKey);
          let localCV = DEFAULT_CV;
          if (storedCV) {
            localCV = JSON.parse(storedCV);
          } else {
            // Try legacy migration
            const legacyCV = await AsyncStorage.getItem('@cv_data');
            if (legacyCV) {
              localCV = JSON.parse(legacyCV);
            }
            await AsyncStorage.setItem(userCVKey, JSON.stringify(localCV));
          }

          // Load user-specific saved careers
          const userCareersKey = getSavedCareersKey('demo-student');
          const storedSavedCareers = await AsyncStorage.getItem(userCareersKey);
          if (storedSavedCareers) {
            setSavedCareers(JSON.parse(storedSavedCareers));
          } else {
            // Try legacy migration
            const legacyCareers = await AsyncStorage.getItem('@saved_careers');
            if (legacyCareers) {
              await AsyncStorage.setItem(userCareersKey, legacyCareers);
              setSavedCareers(JSON.parse(legacyCareers));
            } else {
              setSavedCareers([]);
            }
          }

          // Load user-specific assessments
          const userAssessKey = getAssessmentAnswersKey('demo-student');
          const storedAssessment = await AsyncStorage.getItem(userAssessKey);
          if (storedAssessment) {
            setAssessmentAnswers(JSON.parse(storedAssessment));
          } else {
            // Try legacy migration
            const legacyAssess = await AsyncStorage.getItem('@assessment_answers');
            if (legacyAssess) {
              await AsyncStorage.setItem(userAssessKey, legacyAssess);
              setAssessmentAnswers(JSON.parse(legacyAssess));
            } else {
              setAssessmentAnswers(null);
            }
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

    // Check against registered users list
    try {
      const storedUsers = await AsyncStorage.getItem('@registered_users');
      const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      const matchedUser = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === cleanEmail
      );

      if (!matchedUser) {
        return { success: false, error: 'User not found' };
      }

      if (matchedUser.password !== password) {
        return { success: false, error: 'Wrong password' };
      }

      // Valid Credentials - Load User Session
      const userSession = { id: matchedUser.id, email: matchedUser.email };
      await AsyncStorage.setItem('@user_session', JSON.stringify(userSession));

      // Fetch user-specific records
      const userProfileKey = getProfileKey(matchedUser.id);
      const userCVKey = getCVKey(matchedUser.id);
      const userCareersKey = getSavedCareersKey(matchedUser.id);
      const userAssessKey = getAssessmentAnswersKey(matchedUser.id);

      const storedProfile = await AsyncStorage.getItem(userProfileKey);
      const storedCV = await AsyncStorage.getItem(userCVKey);
      const storedSavedCareers = await AsyncStorage.getItem(userCareersKey);
      const storedAssessment = await AsyncStorage.getItem(userAssessKey);

      setUser(userSession);
      setProfile(storedProfile ? JSON.parse(storedProfile) : null);
      setCvData(storedCV ? JSON.parse(storedCV) : null);
      setSavedCareers(storedSavedCareers ? JSON.parse(storedSavedCareers) : []);
      setAssessmentAnswers(storedAssessment ? JSON.parse(storedAssessment) : null);

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message || 'Verification error' };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<UserProfile, 'id' | 'updated_at'>
  ) => {
    // Artificial delay
    await new Promise((res) => setTimeout(res, 1500));

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Fetch current users list
      const storedUsers = await AsyncStorage.getItem('@registered_users');
      const registeredUsers = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if email already registered
      if (cleanEmail === 'demo@student.lk' || registeredUsers.some((u: any) => u.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'Email address already registered.' };
      }

      // 2. Generate unique user ID
      const newUserId = 'student-' + Math.random().toString(36).substring(7);

      // 3. Create profile
      const newProfile: UserProfile = {
        id: newUserId,
        ...profileData,
        profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        updated_at: new Date().toISOString(),
      };
      
      // Save profile to user-specific key
      await AsyncStorage.setItem(getProfileKey(newUserId), JSON.stringify(newProfile));
      
      // 4. Pre-seed a template CV
      const customCV: CVData = {
        fullName: profileData.full_name,
        title: 'Undergraduate Student',
        email: email,
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

      // 5. Append user login details to user store
      const newUserRecord = {
        id: newUserId,
        email: cleanEmail,
        password: password, // Store password as plain text in prototype local storage
      };

      const updatedUsersList = [...registeredUsers, newUserRecord];
      await AsyncStorage.setItem('@registered_users', JSON.stringify(updatedUsersList));

      return { success: true, error: null };
    } catch (e: any) {
      return { success: false, error: e.message || 'Failed to register account locally' };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear only the current active session
      await AsyncStorage.removeItem('@user_session');
      setUser(null);
      setProfile(null);
      setCvData(null);
      setSavedCareers([]);
      setAssessmentAnswers(null);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return { success: false, error: 'No active session' };
    
    setProfileLoading(true);
    await new Promise((res) => setTimeout(res, 800));

    try {
      if (!profile) throw new Error('No profile exists to update');
      const updatedProfile = {
        ...profile,
        ...profileData,
        updated_at: new Date().toISOString(),
      };

      // Save user-specific profile
      await AsyncStorage.setItem(getProfileKey(user.id), JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      // Keep CV full name synced
      if (cvData) {
        const updatedCV = {
          ...cvData,
          fullName: updatedProfile.full_name,
          address: updatedProfile.district || cvData.address
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

      const updated = [newSavedItem, ...savedCareers];
      await AsyncStorage.setItem(getSavedCareersKey(user.id), JSON.stringify(updated));
      setSavedCareers(updated);

      return { success: true, id: newId };
    } catch (e) {
      return { success: false };
    }
  };

  const deleteSavedCareer = async (careerId: string) => {
    if (!user) return { success: false };

    try {
      const updated = savedCareers.filter((item) => item.id !== careerId);
      await AsyncStorage.setItem(getSavedCareersKey(user.id), JSON.stringify(updated));
      setSavedCareers(updated);
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
