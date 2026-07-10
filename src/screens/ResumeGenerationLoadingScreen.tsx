import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function ResumeGenerationLoadingScreen({ navigation }: any) {
  const { cvData } = useAuth();
  const [statusText, setStatusText] = useState('Extracting form inputs...');

  useEffect(() => {
    const simulateGeneration = async () => {
      // Step 1
      await new Promise((res) => setTimeout(res, 800));
      setStatusText('Synthesizing skills and experience matrices...');
      
      // Step 2
      await new Promise((res) => setTimeout(res, 800));
      setStatusText('Applying professional ATS layout guidelines...');
      
      // Step 3
      await new Promise((res) => setTimeout(res, 800));
      setStatusText('Generating printable PDF rendering cache...');
      
      // Complete!
      await new Promise((res) => setTimeout(res, 600));

      // Save CV details to history list in AsyncStorage
      if (cvData) {
        try {
          const stored = await AsyncStorage.getItem('@careerlanka_my_cvs');
          const history = stored ? JSON.parse(stored) : [];
          
          const newEntry = {
            id: String(Date.now()),
            fullName: cvData.fullName,
            title: cvData.title,
            dateString: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            cvData: cvData
          };

          history.unshift(newEntry);
          await AsyncStorage.setItem('@careerlanka_my_cvs', JSON.stringify(history));
        } catch (error) {
          console.error('Failed to save CV to history:', error);
        }
      }

      navigation.replace('ResumePreview');
    };

    simulateGeneration();
  }, [navigation, cvData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary} />
      
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={54} color={Theme.colors.white} />
        </View>
        
        <Text style={styles.title}>Generating your professional CV...</Text>
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
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.white,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.md,
    lineHeight: 18,
    height: 36, // Reserve space to prevent layout shifting
  },
  spinner: {
    marginTop: Theme.spacing.md,
  },
});
