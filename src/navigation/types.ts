import { RecommendedCareer } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  MainTabs: undefined;
  CareerAssessment: undefined;
  AIProcessing: { assessmentAnswers: any };
  AIRecommendation: { recommendations: RecommendedCareer[] };
  CareerDetails: { career: RecommendedCareer; isSaved?: boolean; savedId?: string };
  LearningResources: undefined;
  Settings: undefined;
  Notifications: undefined;
  JobOpportunities: undefined;
  MySkills: undefined;
  // CV Builder screens
  AICVBuilderHome: undefined;
  CVInformationForm: undefined;
  ResumeGenerationLoading: undefined;
  ResumePreview: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Assessment: undefined;
  Saved: undefined;
  Profile: undefined;
};
