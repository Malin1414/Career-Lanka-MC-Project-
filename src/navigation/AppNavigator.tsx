import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import BottomTabNavigator from './BottomTabNavigator';
import CareerAssessmentScreen from '../screens/CareerAssessmentScreen';
import AIProcessingScreen from '../screens/AIProcessingScreen';
import AIRecommendationScreen from '../screens/AIRecommendationScreen';
import CareerDetailsScreen from '../screens/CareerDetailsScreen';
import LearningResourcesScreen from '../screens/LearningResourcesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import JobOpportunitiesScreen from '../screens/JobOpportunitiesScreen';
import MySkillsScreen from '../screens/MySkillsScreen';

// Import CV Builder Screens
import AICVBuilderHomeScreen from '../screens/AICVBuilderHomeScreen';
import CVInformationFormScreen from '../screens/CVInformationFormScreen';
import ResumeGenerationLoadingScreen from '../screens/ResumeGenerationLoadingScreen';
import ResumePreviewScreen from '../screens/ResumePreviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="CareerAssessment" component={CareerAssessmentScreen} />
        <Stack.Screen name="AIProcessing" component={AIProcessingScreen} />
        <Stack.Screen name="AIRecommendation" component={AIRecommendationScreen} />
        <Stack.Screen name="CareerDetails" component={CareerDetailsScreen} />
        <Stack.Screen name="LearningResources" component={LearningResourcesScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="JobOpportunities" component={JobOpportunitiesScreen} />
        <Stack.Screen name="MySkills" component={MySkillsScreen} />
        
        {/* CV Builder Screens */}
        <Stack.Screen name="AICVBuilderHome" component={AICVBuilderHomeScreen} />
        <Stack.Screen name="CVInformationForm" component={CVInformationFormScreen} />
        <Stack.Screen name="ResumeGenerationLoading" component={ResumeGenerationLoadingScreen} />
        <Stack.Screen name="ResumePreview" component={ResumePreviewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
