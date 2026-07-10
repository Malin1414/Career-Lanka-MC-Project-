import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getSkillsFromAssessment } from '../utils/skillsHelper';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const { profile, savedCareers, assessmentAnswers } = useAuth();
  const { unreadCount } = useNotifications();
  const [savedCount, setSavedCount] = useState(0);

  const skillsData = getSkillsFromAssessment(assessmentAnswers);
  const totalSkillsCount = skillsData.technical.length + skillsData.soft.length;
  const topSkills = [...skillsData.technical, ...skillsData.soft].slice(0, 4);
  const hasAssessment = !!assessmentAnswers;

  useFocusEffect(
    useCallback(() => {
      setSavedCount(savedCareers.length);
    }, [savedCareers])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Top Navigation / Brand Bar */}
      <View style={styles.topBrandBar}>
        <View style={styles.brandContainer}>
          <Ionicons name="git-network" size={24} color={Theme.colors.primary} />
          <Text style={styles.brandText}>CareerLanka AI</Text>
        </View>
        <View style={styles.brandIcons}>
          <TouchableOpacity 
            style={styles.brandIconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color={Theme.colors.text} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.brandIconButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {profile?.profile_photo && !profile.profile_photo.includes('unsplash.com') ? (
              <Image 
                source={{ uri: profile.profile_photo }} 
                style={styles.headerAvatar} 
              />
            ) : (
              <View style={styles.headerAvatarPlaceholder}>
                <Ionicons name="person-outline" size={14} color={Theme.colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Greeting */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greeting}>Ayubowan, {profile?.full_name?.split(' ')[0] || 'Saman'}</Text>
          <Text style={styles.subGreeting}>
            Your career journey is evolving. Based on your profile, we've identified 12 new high-match opportunities in Colombo.
          </Text>
        </View>

        {/* AI CV Builder Shortcut Banner */}
        <TouchableOpacity 
          style={styles.cvBanner}
          onPress={() => navigation.navigate('AICVBuilderHome')}
        >
          <View style={styles.cvBannerContent}>
            <Ionicons name="sparkles" size={18} color="#0A0B0D" style={{ marginRight: 8 }} />
            <Text style={styles.cvBannerText}>AI CV Builder</Text>
          </View>
        </TouchableOpacity>

        {/* Readiness Score Ring Block */}
        <View style={styles.readinessCard}>
          <Text style={styles.cardHeader}>READINESS SCORE</Text>
          
          <View style={styles.progressRingWrapper}>
            {/* Styled progress wheel */}
            <View style={styles.outerProgressCircle}>
              <View style={styles.innerProgressCircle}>
                <Text style={styles.readinessPercent}>75%</Text>
                <Text style={styles.readinessLabel}>Ready for Market</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.trendIndicator}>
            <Ionicons name="trending-up" size={16} color={Theme.colors.success} style={{ marginRight: 4 }} />
            <Text style={styles.trendText}>+5% from last month</Text>
          </View>
        </View>

        {/* Stats Grid - Vertical scroll lists / cards */}
        <View style={styles.statsContainer}>
          {/* Card 1: New Jobs */}
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => navigation.navigate('JobOpportunities')}
          >
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(5, 196, 143, 0.12)' }]}>
              <Ionicons name="briefcase" size={22} color={Theme.colors.primary} />
            </View>
            <View style={styles.statDetails}>
              <Text style={styles.statNumber}>124</Text>
              <Text style={styles.statTitle}>New Jobs</Text>
              <View style={styles.statSubContainer}>
                <Ionicons name="checkmark-circle" size={12} color={Theme.colors.success} style={{ marginRight: 4 }} />
                <Text style={styles.statSubtext}>Matches Found</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Card 2: Dynamic Skills Card */}
          <View style={styles.skillsCard}>
            <View style={styles.skillsCardHeader}>
              <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(5, 196, 143, 0.12)' }]}>
                <Ionicons name="school" size={22} color={Theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statNumber}>
                  {hasAssessment ? String(totalSkillsCount).padStart(2, '0') : '--'}
                </Text>
                <Text style={styles.statTitle}>Identified Skills</Text>
              </View>
              {hasAssessment && (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('MySkills')}
                  style={styles.viewAllSkillsBtn}
                >
                  <Text style={styles.viewAllSkillsText}>View All</Text>
                  <Ionicons name="chevron-forward" size={14} color={Theme.colors.primary} />
                </TouchableOpacity>
              )}
            </View>
            
            {hasAssessment ? (
              <View style={styles.skillsChipsContainer}>
                {topSkills.map((skill) => (
                  <View key={skill} style={styles.dashboardSkillChip}>
                    <Text style={styles.dashboardSkillChipText}>{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.noSkillsContainer}
                onPress={() => navigation.navigate('CareerAssessment')}
              >
                <Text style={styles.noSkillsText}>
                  Complete your Career Assessment to identify your key skills.
                </Text>
                <Ionicons name="arrow-forward-outline" size={14} color={Theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Card 3: Saved Careers */}
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => navigation.navigate('Saved')}
          >
            <View style={[styles.statIconWrapper, { backgroundColor: 'rgba(5, 196, 143, 0.12)' }]}>
              <Ionicons name="bookmark" size={22} color={Theme.colors.primary} />
            </View>
            <View style={styles.statDetails}>
              <Text style={styles.statNumber}>{savedCount > 0 ? String(savedCount).padStart(2, '0') : '00'}</Text>
              <Text style={styles.statTitle}>Saved Careers</Text>
              <View style={styles.statSubContainer}>
                <Ionicons name="heart-outline" size={12} color={Theme.colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.statSubtext}>Active Roadmaps</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Top Recommendations (Courses) */}
        <View style={styles.recommendationHeader}>
          <Text style={styles.sectionTitle}>Top Recommendations</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LearningResources')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coursesList}>
          {/* Recommendation 1 */}
          <TouchableOpacity 
            style={styles.courseCard}
            onPress={() => navigation.navigate('LearningResources')}
          >
            <View style={styles.courseImagePlaceholder}>
              <Ionicons name="cloud-done-outline" size={28} color={Theme.colors.primary} />
            </View>
            <View style={styles.courseInfo}>
              <View style={styles.courseBadgeRow}>
                <View style={styles.courseUniBadge}>
                  <Text style={styles.courseUniversity}>University of Moratuwa</Text>
                </View>
                <Text style={styles.coursePriceFree}>Free</Text>
              </View>
              <Text style={styles.courseTitle}>Advanced Cloud Architecture</Text>
              <Text style={styles.courseDescription} numberOfLines={1}>Master AWS and Azure infrastructure components</Text>
              <View style={styles.courseMetaRow}>
                <Text style={styles.courseMetaText}><Ionicons name="time-outline" size={12} /> 12 Weeks</Text>
                <Text style={styles.courseMetaText}><Ionicons name="checkmark-circle" size={12} color={Theme.colors.success} /> Verified</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Recommendation 2 */}
          <TouchableOpacity 
            style={styles.courseCard}
            onPress={() => navigation.navigate('LearningResources')}
          >
            <View style={[styles.courseImagePlaceholder, { backgroundColor: 'rgba(5, 196, 143, 0.08)' }]}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color={Theme.colors.primary} />
            </View>
            <View style={styles.courseInfo}>
              <View style={styles.courseBadgeRow}>
                <View style={styles.courseUniBadge}>
                  <Text style={styles.courseUniversity}>British Council SL</Text>
                </View>
                <Text style={styles.coursePricePaid}>Rs. 5,000</Text>
              </View>
              <Text style={styles.courseTitle}>Professional Communication</Text>
              <Text style={styles.courseDescription} numberOfLines={1}>Enhance your corporate presentation and writing skills</Text>
              <View style={styles.courseMetaRow}>
                <Text style={styles.courseMetaText}><Ionicons name="time-outline" size={12} /> 4 Weeks</Text>
                <Text style={styles.courseMetaText}><Ionicons name="ribbon-outline" size={12} color="#EAB308" /> Certificate</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Skill Snapshot Block */}
        <View style={styles.skillSnapshotCard}>
          <View style={styles.skillHeaderRow}>
            <Text style={styles.skillCardTitle}>Skill Snapshot</Text>
            <Ionicons name="bar-chart-outline" size={20} color={Theme.colors.primary} />
          </View>

          {/* Skill 1 */}
          <View style={styles.skillProgressItem}>
            <View style={styles.skillLabelRow}>
              <Text style={styles.skillLabel}>Technical (React/Node)</Text>
              <Text style={styles.skillPercent}>88%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '88%', backgroundColor: Theme.colors.primary }]} />
            </View>
          </View>

          {/* Skill 2 */}
          <View style={styles.skillProgressItem}>
            <View style={styles.skillLabelRow}>
              <Text style={styles.skillLabel}>Data Analysis</Text>
              <Text style={styles.skillPercent}>62%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '62%', backgroundColor: Theme.colors.primary }]} />
            </View>
          </View>

          {/* Skill 3 */}
          <View style={styles.skillProgressItem}>
            <View style={styles.skillLabelRow}>
              <Text style={styles.skillLabel}>Leadership</Text>
              <Text style={styles.skillPercent}>45%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '45%', backgroundColor: Theme.colors.primary }]} />
            </View>
          </View>

          <Text style={styles.skillSuggestion}>
            *We suggest focusing on Cloud Computing to unlock 45 more senior roles.*
          </Text>

          <TouchableOpacity 
            style={styles.assessmentButton}
            onPress={() => navigation.navigate('CareerAssessment')}
          >
            <Text style={styles.assessmentButtonText}>Take Assessment</Text>
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
  topBrandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 12,
    backgroundColor: Theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    letterSpacing: 0.3,
  },
  brandIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandIconButton: {
    padding: 4,
    position: 'relative',
  },
  headerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  headerAvatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  container: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
    gap: Theme.spacing.lg,
  },
  greetingHeader: {
    marginTop: Theme.spacing.xs,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  subGreeting: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  cvBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.medium,
    paddingVertical: 12,
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  cvBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvBannerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A0B0D', // Dark text on green background
    letterSpacing: 0.5,
  },
  readinessCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: Theme.spacing.md,
  },
  progressRingWrapper: {
    marginVertical: Theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerProgressCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 8,
    borderColor: '#05C48F', // Emerald progress border color
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerProgressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readinessPercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  readinessLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
  },
  trendText: {
    fontSize: 12,
    color: Theme.colors.primary, // Green trend text
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  statBox: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  statDetails: {
    flex: 1,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Theme.colors.text,
    lineHeight: 30,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: 2,
  },
  statSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statSubtext: {
    fontSize: 11,
    color: Theme.colors.success,
    fontWeight: '600',
  },
  statSubtextMuted: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  statSubtextAlert: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  viewAllText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  coursesList: {
    flexDirection: 'column',
    gap: 12,
  },
  courseCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  courseImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: Theme.roundness.medium,
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  courseUniBadge: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  courseUniversity: {
    fontSize: 9,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textTransform: 'uppercase',
  },
  coursePriceFree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  coursePricePaid: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  courseDescription: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: 6,
  },
  courseMetaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  courseMetaText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  skillSnapshotCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  skillHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  skillCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  skillProgressItem: {
    marginBottom: Theme.spacing.sm,
  },
  skillLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text,
  },
  skillPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Theme.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  skillSuggestion: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: Theme.spacing.md,
    lineHeight: 18,
    textAlign: 'center',
  },
  assessmentButton: {
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: Theme.roundness.medium,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    backgroundColor: 'transparent',
  },
  assessmentButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  skillsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  skillsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllSkillsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllSkillsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  skillsChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Theme.spacing.sm,
    paddingLeft: 4,
  },
  dashboardSkillChip: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  dashboardSkillChipText: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  noSkillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Theme.spacing.xs,
    paddingLeft: 4,
  },
  noSkillsText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});
