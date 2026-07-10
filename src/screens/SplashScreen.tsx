import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SplashScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface Props {
  navigation: SplashScreenNavigationProp;
}

export default function SplashScreen({ navigation }: Props) {
  const { user, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Loop pulse animation after entry
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [fadeAnim, scaleAnim, pulseAnim]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      }, 2000); // 2 seconds splash display

      return () => clearTimeout(timer);
    }
  }, [user, loading, navigation]);

  return (
    <View style={styles.container}>
      {/* Decorative Background Elements */}
      <View style={styles.bubbleTop} />
      <View style={styles.bubbleBottom} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Animated.View style={[styles.logoImageContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
        </Animated.View>
        
        <Text style={styles.appName}>Career Lanka</Text>
        <Text style={styles.tagline}>AI Career Guidance for Sri Lankan Undergraduates</Text>
      </Animated.View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={Theme.colors.primary} />
        <Text style={styles.loadingText}>Guiding your future path...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  bubbleTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(5, 196, 143, 0.06)',
  },
  bubbleBottom: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(5, 196, 143, 0.04)',
  },
  content: {
    alignItems: 'center',
    marginBottom: 80,
    zIndex: 1,
  },
  logoImageContainer: {
    width: 180,
    height: 180,
    borderRadius: 36,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.large,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.white,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.md,
    lineHeight: 22,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Theme.spacing.sm,
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '500',
  },
});
