import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { jobService, JobOpportunity } from '../services/jobService';
import { useAuth } from '../context/AuthContext';

export default function JobOpportunitiesScreen({ navigation }: any) {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, [profile]);

  const loadJobs = async () => {
    try {
      const data = await jobService.getJobs(profile || undefined);
      setJobs(data);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to load job opportunities.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', "Don't know how to open this URL: " + url);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'An error occurred opening the job link.');
    }
  };

  const handleApplyJob = async (job: JobOpportunity) => {
    Alert.alert(
      'Apply to ' + job.companyName,
      `Launching application portal for ${job.title} at ${job.companyName}.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed to Apply',
          onPress: async () => {
            try {
              await Linking.openURL(job.externalUrl);
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Could not open the application link.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Opportunities</Text>
      </View>
      <View style={styles.separator} />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {jobs.map((job) => (
            <View key={job.id} style={styles.jobCard}>
              <View style={styles.cardHeader}>
                {job.logoUrl ? (
                  <Image source={{ uri: job.logoUrl }} style={styles.companyLogo} />
                ) : (
                  <View style={styles.logoPlaceholder}>
                    <Ionicons name="briefcase" size={22} color={Theme.colors.primary} />
                  </View>
                )}
                <View style={styles.titleContainer}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.companyName}>{job.companyName}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color={Theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{job.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={Theme.colors.textSecondary} />
                  <Text style={styles.metaText}>{job.postedDate}</Text>
                </View>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{job.employmentType}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{job.careerCategory}</Text>
                </View>
                {job.matchScore !== undefined && (
                  <View style={[styles.matchBadge, { borderColor: job.matchScore > 75 ? Theme.colors.primary : Theme.colors.warning }]}>
                    <Text style={[styles.matchBadgeText, { color: job.matchScore > 75 ? Theme.colors.primary : Theme.colors.warning }]}>
                      {job.matchScore}% AI Match
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.descriptionText}>{job.description}</Text>

              {job.skillGaps && job.skillGaps.length > 0 && (
                <View style={styles.skillGapContainer}>
                  <Text style={styles.skillGapTitle}>Potential Skill Gaps:</Text>
                  <View style={styles.skillGapList}>
                    {job.skillGaps.map((gap, idx) => (
                      <View key={idx} style={styles.skillGapItem}>
                        <Ionicons name="alert-circle-outline" size={12} color={Theme.colors.warning} />
                        <Text style={styles.skillGapText}>{gap}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.viewBtn]}
                  onPress={() => handleViewJob(job.externalUrl)}
                >
                  <Ionicons name="eye-outline" size={16} color={Theme.colors.text} style={{ marginRight: 6 }} />
                  <Text style={styles.viewBtnText}>View Job</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.applyBtn]}
                  onPress={() => handleApplyJob(job)}
                >
                  <Ionicons name="paper-plane-outline" size={16} color="#0A0B0D" style={{ marginRight: 6 }} />
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 12,
    backgroundColor: Theme.colors.background,
  },
  backBtn: {
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    gap: 16,
  },
  jobCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: Theme.roundness.medium,
    marginRight: Theme.spacing.md,
  },
  logoPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: Theme.roundness.medium,
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: Theme.spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Theme.spacing.md,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  typeBadgeText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  categoryBadgeText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  matchBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  descriptionText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: Theme.spacing.sm,
  },
  skillGapContainer: {
    backgroundColor: 'rgba(234, 179, 8, 0.05)',
    padding: 10,
    borderRadius: Theme.roundness.medium,
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.1)',
  },
  skillGapTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.warning,
    marginBottom: 6,
  },
  skillGapList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillGapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
  },
  skillGapText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 38,
    borderRadius: Theme.roundness.medium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtn: {
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: 'transparent',
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  applyBtn: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.small,
  },
  applyBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A0B0D',
  },
});
