import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { generateCareerRecommendations } from '../services/gemini';

export default function AIProcessingScreen({ route, navigation }: any) {
  const { assessmentAnswers } = route.params;
  const { profile } = useAuth();
  const [statusText, setStatusText] = useState('Aggregating profile details...');
  const spinValue = useRef(new Animated.Value(0)).current;

  // Rotation animation setup
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const processRecommendations = async () => {
      try {
        // Status 1: Compiling
        setStatusText('Structuring assessment indicators...');
        await new Promise((res) => setTimeout(res, 800));

        // Status 2: Processing
        setStatusText('Mapping academic curriculum to Sri Lankan tech industry...');
        await new Promise((res) => setTimeout(res, 800));

        // Call our local mock generator
        setStatusText('Consulting AI Career Engine...');
        const recommendations = await generateCareerRecommendations(profile || ({} as any), assessmentAnswers);

        // Status 3: Saving
        setStatusText('Synthesizing career roadmap...');
        await new Promise((res) => setTimeout(res, 800));

        // Complete! Navigation
        navigation.replace('AIRecommendation', { recommendations });
      } catch (err: any) {
        console.error('AI processing error:', err);
        Alert.alert(
          'Processing Error',
          err.message || 'An error occurred during evaluation.',
          [
            {
              text: 'Go Back',
              onPress: () => navigation.replace('MainTabs'),
            },
          ]
        );
      }
    };

    processRecommendations();
  }, [profile, assessmentAnswers, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
      
      <View style={styles.content}>
        {/* Animated outer ring */}
        <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]}>
          <Ionicons name="sparkles" size={40} color={Theme.colors.white} style={styles.starIcon} />
        </Animated.View>
        
        {/* Center icon */}
        <View style={styles.logoCenter}>
          <Ionicons name="compass" size={60} color={Theme.colors.primary} />
        </View>

        <Text style={styles.title}>Analyzing your profile...</Text>
        <Text style={styles.subtitle}>{statusText}</Text>
        
        <ActivityIndicator size="small" color={Theme.colors.white} style={styles.spinner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  ring: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  starIcon: {
    marginTop: -20,
  },
  logoCenter: {
    position: 'absolute',
    top: 45,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.white,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
    lineHeight: 20,
  },
  spinner: {
    marginTop: Theme.spacing.md,
  },
});
