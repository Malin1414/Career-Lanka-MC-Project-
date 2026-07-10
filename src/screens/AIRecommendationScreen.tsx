import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { RecommendedCareer } from '../types';

const { width } = Dimensions.get('window');

export default function AIRecommendationScreen({ route, navigation }: any) {
  const { recommendations } = route.params;
  const { saveCareer, deleteSavedCareer, savedCareers } = useAuth();
  
  // Track savings locally to show loading indicators
  const [savingIndices, setSavingIndices] = useState<number[]>([]);

  // Helper to check if a recommendation is already saved
  const getSavedId = (careerName: string) => {
    const found = savedCareers.find((c) => c.career_name.toLowerCase() === careerName.toLowerCase());
    return found ? found.id : null;
  };

  const handleSaveToggle = async (career: RecommendedCareer, index: number) => {
    const savedId = getSavedId(career.career_name);
    
    setSavingIndices((prev) => [...prev, index]);
    await new Promise((res) => setTimeout(res, 800)); // Simulated processing delay

    if (savedId) {
      // Unsave
      const { success } = await deleteSavedCareer(savedId);
      if (success) {
        Alert.alert('Removed', `"${career.career_name}" removed from saved careers.`);
      } else {
        Alert.alert('Error', 'Failed to remove career.');
      }
    } else {
      // Save
      const { success } = await saveCareer(career);
      if (success) {
        Alert.alert('Saved', `"${career.career_name}" saved to your dashboard portfolio.`);
      } else {
        Alert.alert('Error', 'Failed to save career.');
      }
    }
    
    setSavingIndices((prev) => prev.filter((i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Top Matches</Text>
        <Text style={styles.headerSubtitle}>
          Based on your recent skill assessment and university mapping, we've identified the careers where you'll thrive most.
        </Text>
        <TouchableOpacity 
          style={styles.recalibrateBtn}
          onPress={() => navigation.replace('CareerAssessment')}
        >
          <Ionicons name="refresh-outline" size={14} color={Theme.colors.text} style={{ marginRight: 6 }} />
          <Text style={styles.recalibrateBtnText}>Recalibrate Skills</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Recommendation Cards */}
        {recommendations.map((career: RecommendedCareer, index: number) => {
          const savedId = getSavedId(career.career_name);
          const isSaving = savingIndices.includes(index);
          const isPrimaryFit = index === 0;

          return (
            <View key={index} style={[styles.careerCard, isPrimaryFit && styles.primaryCareerCard]}>
              
              {/* Card Header: Score, Name & Bookmark */}
              <View style={styles.cardHeader}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.careerTitle}>{career.career_name}</Text>
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{career.match_score}% Match</Text>
                    </View>
                    {isPrimaryFit && (
                      <View style={styles.primaryFitBadge}>
                        <Text style={styles.primaryFitText}>Primary Fit</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => handleSaveToggle(career, index)}
                  disabled={isSaving}
                  style={styles.bookmarkBtn}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={Theme.colors.primary} />
                  ) : (
                    <Ionicons 
                      name={savedId ? 'bookmark' : 'bookmark-outline'} 
                      size={22} 
                      color={savedId ? Theme.colors.primary : Theme.colors.textSecondary} 
                    />
                  )}
                </TouchableOpacity>
              </View>

              {/* Reasoning Description */}
              <Text style={styles.reasonText}>{career.reason}</Text>

              {/* Skills Tags */}
              <View style={styles.skillsContainer}>
                {career.required_skills.slice(0, 3).map((skill, sIdx) => (
                  <View key={sIdx} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                ))}
                {career.required_skills.length > 3 && (
                  <View style={styles.skillChipMore}>
                    <Text style={styles.skillChipMoreText}>+{career.required_skills.length - 3} more</Text>
                  </View>
                )}
              </View>

              {/* Primary Fit Visual Setup or View Details Button */}
              {isPrimaryFit ? (
                <View style={styles.visualContainer}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=400&auto=format&fit=crop' }} 
                    style={styles.visualImage} 
                  />
                  <TouchableOpacity
                    style={styles.exploreCtaBtn}
                    onPress={() => navigation.navigate('CareerDetails', { career, isSaved: !!savedId, savedId: savedId || undefined })}
                  >
                    <Text style={styles.exploreCtaBtnText}>Explore Career Path</Text>
                    <Ionicons name="arrow-forward" size={16} color="#0A0B0D" style={{ marginLeft: 6 }} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('CareerDetails', { career, isSaved: !!savedId, savedId: savedId || undefined })}
                >
                  <Text style={styles.detailsBtnText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color={Theme.colors.text} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* Section: Market Trends (+24% YoY) */}
        <View style={styles.sectionHeader}>
          <Ionicons name="trending-up-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Market Trends</Text>
        </View>
        
        <View style={styles.trendsCard}>
          <Text style={styles.trendsCardLabel}>MARKET TRENDS</Text>
          <Text style={styles.trendsTitle}>Tech Sector Growth</Text>
          <Text style={styles.trendsDesc}>
            The job market for your matched careers has seen an explosive increase in Sri Lanka and Southeast Asia over the last 12 months.
          </Text>
          
          <View style={styles.trendsMetricsBox}>
            <Text style={styles.trendsPercent}>+24%</Text>
            <Text style={styles.trendsMetricLabel}>Job Openings Growth (YoY)</Text>
            <View style={styles.greenUnderline} />
          </View>
        </View>

        {/* Section: Regional Outlook (4-grid statistics) */}
        <View style={styles.sectionHeader}>
          <Ionicons name="globe-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sectionTitle}>Regional Outlook</Text>
        </View>
        <Text style={styles.sectionDesc}>
          Our AI aggregates data from top job portals and university placement records across South Asia to provide accurate market predictions.
        </Text>

        <View style={styles.outlookGrid}>
          {/* Box 1 */}
          <View style={styles.outlookBox}>
            <Text style={styles.outlookLabel}>Average Entry Salary</Text>
            <Text style={styles.outlookValGreen}>LKR 120k+</Text>
          </View>

          {/* Box 2 */}
          <View style={styles.outlookBox}>
            <Text style={styles.outlookLabel}>Remote Roles</Text>
            <Text style={styles.outlookValGreen}>62% Available</Text>
          </View>

          {/* Box 3 */}
          <View style={styles.outlookBox}>
            <Text style={styles.outlookLabel}>Skill Gap</Text>
            <Text style={styles.outlookValOrange}>12% Critical</Text>
          </View>

          {/* Box 4 */}
          <View style={styles.outlookBox}>
            <Text style={styles.outlookLabel}>Hiring Demand</Text>
            <Text style={styles.outlookValGreen}>High</Text>
          </View>
        </View>

        {/* Action Button: Return to Dashboard */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.replace('MainTabs')}
        >
          <Text style={styles.doneBtnText}>Done & Back to Dashboard</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  recalibrateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Theme.roundness.small,
    marginTop: Theme.spacing.md,
  },
  recalibrateBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
    gap: 16,
  },
  careerCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  primaryCareerCard: {
    borderColor: Theme.colors.primary,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  titleWrapper: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  careerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scoreBadge: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  primaryFitBadge: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  primaryFitText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  bookmarkBtn: {
    padding: 4,
  },
  reasonText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: Theme.spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Theme.spacing.md,
  },
  skillChip: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  skillChipText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  skillChipMore: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
  },
  skillChipMoreText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  visualContainer: {
    marginTop: Theme.spacing.xs,
    borderRadius: Theme.roundness.medium,
    overflow: 'hidden',
    height: 140,
    position: 'relative',
  },
  visualImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  exploreCtaBtn: {
    position: 'absolute',
    bottom: Theme.spacing.md,
    left: Theme.spacing.md,
    right: Theme.spacing.md,
    height: 38,
    backgroundColor: Theme.colors.primary, // Green active CTA
    borderRadius: Theme.roundness.small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  exploreCtaBtnText: {
    color: '#0A0B0D', // Dark text on green background
    fontWeight: 'bold',
    fontSize: 13,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: Theme.spacing.md,
    backgroundColor: 'transparent',
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  sectionDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginTop: -8,
  },
  trendsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  trendsCardLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    letterSpacing: 1,
    marginBottom: Theme.spacing.sm,
  },
  trendsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  trendsDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: Theme.spacing.md,
  },
  trendsMetricsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.roundness.medium,
    paddingVertical: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  trendsPercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Theme.colors.primary, // Bright Green
  },
  trendsMetricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text,
    marginTop: 4,
  },
  greenUnderline: {
    width: 60,
    height: 4,
    backgroundColor: Theme.colors.primary,
    borderRadius: 2,
    marginTop: Theme.spacing.sm,
  },
  outlookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  outlookBox: {
    width: (width - 36 - 12) / 2, // 2 column layout
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  outlookLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  outlookValGreen: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  outlookValOrange: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.warning,
  },
  doneBtn: {
    backgroundColor: Theme.colors.primary,
    height: 48,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    ...Theme.shadows.medium,
  },
  doneBtnText: {
    color: '#0A0B0D', // Dark text on green background
    fontSize: 15,
    fontWeight: 'bold',
  },
});
