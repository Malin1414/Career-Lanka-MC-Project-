import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { generateCareerRecommendations } from '../services/gemini';

export default function AssessmentTabScreen({ navigation }: any) {
  const { user, profile, assessmentAnswers } = useAuth();
  const [lastAssessmentDate, setLastAssessmentDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const checkLastAssessment = useCallback(() => {
    if (!user) return;
    
    // Check if we have local assessment answers saved
    if (assessmentAnswers) {
      // Mock or format a date
      setLastAssessmentDate('Completed Today');
    } else {
      setLastAssessmentDate(null);
    }
    setLoading(false);
  }, [user, assessmentAnswers]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      checkLastAssessment();
    }, [checkLastAssessment])
  );

  const handleViewLatestRecommendations = async () => {
    if (!user || !profile || !assessmentAnswers) {
      Alert.alert('No Recommendations', 'Please complete the assessment to get matched.');
      return;
    }
    
    setLoadingRecommendations(true);
    try {
      // Generate recommendations locally from answers
      const recommendations = await generateCareerRecommendations(profile, assessmentAnswers);
      navigation.navigate('AIRecommendation', { recommendations });
    } catch (err: any) {
      Alert.alert('Error', 'Failed to retrieve recommendations.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.title}>AI Career Assessment</Text>
        <Text style={styles.subtitle}>
          Discover your optimal career trajectories using AI analysis based on your credentials, interests, and working styles.
        </Text>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardHeader}>What is evaluated?</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(91, 61, 245, 0.08)' }]}>
              <Ionicons name="sparkles-outline" size={20} color={Theme.colors.primary} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Interests & Passions</Text>
              <Text style={styles.infoDesc}>What fields align with your innate curiosity and hobbies.</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0, 230, 118, 0.08)' }]}>
              <Ionicons name="code-slash-outline" size={20} color="#00E676" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Technical Proficiencies</Text>
              <Text style={styles.infoDesc}>Your coding skills, database experience, and tools exposure.</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FFFBEB' }]}>
              <Ionicons name="chatbubbles-outline" size={20} color={Theme.colors.warning} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Soft Skills & Communication</Text>
              <Text style={styles.infoDesc}>Leadership, adaptability, teamwork, and project management capabilities.</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FDF2F8' }]}>
              <Ionicons name="briefcase-outline" size={20} color="#DB2777" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Working Preferences</Text>
              <Text style={styles.infoDesc}>Remote, office-based, hybrid, or freelance preferences.</Text>
            </View>
          </View>
        </View>

        {/* History / Status Card */}
        <View style={styles.statusCard}>
          {loading ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : lastAssessmentDate ? (
            <View style={styles.statusContent}>
              <Ionicons name="checkmark-circle" size={24} color="#00E676" style={styles.statusIcon} />
              <View>
                <Text style={styles.statusTitle}>Last Completed</Text>
                <Text style={styles.statusDate}>{lastAssessmentDate}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.statusContent}>
              <Ionicons name="alert-circle-outline" size={24} color={Theme.colors.warning} style={styles.statusIcon} />
              <View>
                <Text style={styles.statusTitle}>No Assessment Completed</Text>
                <Text style={styles.statusDate}>Take your first assessment below.</Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 12 }}>
          {lastAssessmentDate && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.secondaryActionBtn]}
              onPress={handleViewLatestRecommendations}
              disabled={loadingRecommendations}
            >
              {loadingRecommendations ? (
                <ActivityIndicator size="small" color={Theme.colors.primary} />
              ) : (
                <>
                  <Ionicons name="eye-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />
                  <Text style={[styles.actionBtnText, styles.secondaryActionBtnText]}>
                    View Latest Recommendations
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('CareerAssessment')}
          >
            <Text style={styles.actionBtnText}>
              {lastAssessmentDate ? 'Retake Career Assessment' : 'Start Career Assessment'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color={Theme.colors.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  container: {
    padding: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? Theme.spacing.lg + 10 : Theme.spacing.sm,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: Theme.spacing.lg,
  },
  infoCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
    marginBottom: Theme.spacing.lg,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  infoDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
  },
  statusCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: Theme.spacing.xl,
    justifyContent: 'center',
    ...Theme.shadows.small,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: Theme.spacing.md,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  statusDate: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  actionBtn: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    borderRadius: Theme.roundness.medium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  actionBtnText: {
    color: Theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryActionBtn: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    ...Theme.shadows.small,
  },
  secondaryActionBtnText: {
    color: Theme.colors.primary,
  },
});
