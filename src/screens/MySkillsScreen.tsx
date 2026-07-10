import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { getSkillsFromAssessment } from '../utils/skillsHelper';

export default function MySkillsScreen({ navigation }: any) {
  const { assessmentAnswers } = useAuth();
  
  const hasAssessment = !!assessmentAnswers;
  const skillsData = getSkillsFromAssessment(assessmentAnswers);

  const getStrengthLevel = (skillName: string, category: 'tech' | 'soft' | 'lang'): { level: string; percent: number } => {
    // Dynamic mapping for mock strengths
    if (category === 'tech') {
      if (['Python', 'JavaScript', 'React Native', 'SQL'].includes(skillName)) {
        return { level: 'Advanced', percent: 90 };
      }
      if (['Java', 'APIs', 'HTML/CSS', 'OOP', 'Data Structures'].includes(skillName)) {
        return { level: 'Intermediate', percent: 70 };
      }
      return { level: 'Beginner', percent: 45 };
    } else if (category === 'soft') {
      if (['Problem Solving', 'Teamwork', 'Communication'].includes(skillName)) {
        return { level: 'Advanced', percent: 85 };
      }
      return { level: 'Intermediate', percent: 65 };
    } else {
      if (skillName === 'English') {
        return { level: 'Advanced', percent: 95 };
      }
      return { level: 'Intermediate', percent: 80 };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Skills Portfolio</Text>
      </View>
      <View style={styles.separator} />

      {!hasAssessment ? (
        /* Empty / Call To Action State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Ionicons name="school-outline" size={48} color={Theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyTitle}>Assessments Pending</Text>
          <Text style={styles.emptySubtitle}>
            Complete your Career Assessment to identify your key skills and strength levels.
          </Text>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => navigation.navigate('CareerAssessment')}
          >
            <Text style={styles.actionBtnText}>Take Assessment</Text>
            <Ionicons name="arrow-forward" size={16} color="#0A0B0D" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      ) : (
        /* Skills List */
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Section: Technical Skills */}
          <View style={styles.sectionHeader}>
            <Ionicons name="code-slash-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Technical Skills</Text>
          </View>
          {skillsData.technical.length === 0 ? (
            <Text style={styles.noSkillsText}>No technical skills identified yet.</Text>
          ) : (
            skillsData.technical.map((skill) => {
              const { level, percent } = getStrengthLevel(skill, 'tech');
              const badgeStyle = level === 'Advanced' ? styles.advancedBadge : level === 'Intermediate' ? styles.intermediateBadge : styles.beginnerBadge;
              return (
                <View key={skill} style={styles.skillCard}>
                  <View style={styles.skillMetaRow}>
                    <Text style={styles.skillName}>{skill}</Text>
                    <Text style={[styles.strengthBadge, badgeStyle]}>
                      {level}
                    </Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{percent}%</Text>
                  </View>
                </View>
              );
            })
          )}

          {/* Section: Soft Skills */}
          <View style={styles.sectionHeader}>
            <Ionicons name="people-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Soft Skills</Text>
          </View>
          {skillsData.soft.length === 0 ? (
            <Text style={styles.noSkillsText}>No soft skills identified yet.</Text>
          ) : (
            skillsData.soft.map((skill) => {
              const { level, percent } = getStrengthLevel(skill, 'soft');
              const badgeStyle = level === 'Advanced' ? styles.advancedBadge : level === 'Intermediate' ? styles.intermediateBadge : styles.beginnerBadge;
              return (
                <View key={skill} style={styles.skillCard}>
                  <View style={styles.skillMetaRow}>
                    <Text style={styles.skillName}>{skill}</Text>
                    <Text style={[styles.strengthBadge, badgeStyle]}>
                      {level}
                    </Text>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{percent}%</Text>
                  </View>
                </View>
              );
            })
          )}

          {/* Section: Languages */}
          <View style={styles.sectionHeader}>
            <Ionicons name="language-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Languages</Text>
          </View>
          {skillsData.languages.map((skill) => {
            const { level, percent } = getStrengthLevel(skill, 'lang');
            const badgeStyle = level === 'Advanced' ? styles.advancedBadge : level === 'Intermediate' ? styles.intermediateBadge : styles.beginnerBadge;
            return (
              <View key={skill} style={styles.skillCard}>
                <View style={styles.skillMetaRow}>
                  <Text style={styles.skillName}>{skill}</Text>
                  <Text style={[styles.strengthBadge, badgeStyle]}>
                    {level}
                  </Text>
                </View>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{percent}%</Text>
                </View>
              </View>
            );
          })}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Theme.spacing.xl,
  },
  actionBtn: {
    backgroundColor: Theme.colors.primary,
    height: 44,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.roundness.medium,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  actionBtnText: {
    color: '#0A0B0D',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  noSkillsText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Theme.spacing.md,
  },
  skillCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    marginBottom: 12,
    ...Theme.shadows.small,
  },
  skillMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  strengthBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
  },
  advancedBadge: {
    color: Theme.colors.primary,
    borderColor: 'rgba(5, 196, 143, 0.2)',
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
  },
  intermediateBadge: {
    color: Theme.colors.warning,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    backgroundColor: 'rgba(234, 179, 8, 0.08)',
  },
  beginnerBadge: {
    color: '#38BDF8', // Light blue
    borderColor: 'rgba(56, 189, 248, 0.2)',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
    width: 28,
    textAlign: 'right',
  },
});
