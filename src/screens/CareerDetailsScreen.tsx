import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { RecommendedCareer } from '../types';

// Static Learning Resources Pool for Local Matching
const MOCK_RESOURCES = [
  {
    id: 'r1',
    title: 'Google Data Analytics Professional Certificate',
    provider: 'Coursera',
    link: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    category: 'Data Science',
    tags: ['data', 'analytics', 'python', 'sql'],
  },
  {
    id: 'r2',
    title: 'Meta Front-End Developer Certificate',
    provider: 'Coursera',
    link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    category: 'Software Engineering',
    tags: ['react', 'next.js', 'javascript', 'frontend'],
  },
  {
    id: 'r3',
    title: 'Responsive Web Design Certification',
    provider: 'freeCodeCamp',
    link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    category: 'Web Development',
    tags: ['html', 'css', 'javascript', 'web design'],
  },
  {
    id: 'r4',
    title: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy',
    link: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity',
    category: 'Cybersecurity',
    tags: ['security', 'networks', 'networking'],
  },
  {
    id: 'r5',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    provider: 'Microsoft Learn',
    link: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    category: 'Cloud Computing',
    tags: ['aws cloud', 'cloud', 'azure', 'fundamentals'],
  },
  {
    id: 'r6',
    title: 'Harvard CS50: Introduction to Computer Science',
    provider: 'YouTube',
    link: 'https://www.youtube.com/watch?v=8mAITcNt70k',
    category: 'Computer Science',
    tags: ['python', 'javascript', 'sql', 'algorithms'],
  },
  {
    id: 'r7',
    title: 'AWS Cloud Practitioner Essentials',
    provider: 'Cisco Networking Academy',
    link: 'https://www.netacad.com/',
    category: 'Cloud Computing',
    tags: ['aws cloud', 'cloud', 'architecture'],
  },
  {
    id: 'r8',
    title: 'UI/UX Design Masterclass',
    provider: 'YouTube',
    link: 'https://www.youtube.com/',
    category: 'UI/UX Design',
    tags: ['figma', 'wireframing', 'user research', 'ui/ux'],
  }
];

export default function CareerDetailsScreen({ route, navigation }: any) {
  const { career, isSaved: initialIsSaved, savedId: initialSavedId } = route.params;
  const { saveCareer, deleteSavedCareer, savedCareers } = useAuth();

  const [isSaved, setIsSaved] = useState(initialIsSaved || false);
  const [savedId, setSavedId] = useState<string | undefined>(initialSavedId);
  const [saving, setSaving] = useState(false);
  const [matchedCourses, setMatchedCourses] = useState<any[]>([]);

  // Check and sync save status with AuthContext
  useEffect(() => {
    const savedItem = savedCareers.find((c) => c.career_name.toLowerCase() === career.career_name.toLowerCase());
    if (savedItem) {
      setIsSaved(true);
      setSavedId(savedItem.id);
    } else {
      setIsSaved(false);
      setSavedId(undefined);
    }
  }, [career.career_name, savedCareers]);

  // Local matching of courses based on skills
  useEffect(() => {
    const careerSkills = (career.required_skills || []).map((s: string) => s.toLowerCase());
    
    const matched = MOCK_RESOURCES.filter((res) => {
      // Check if category matches or any tags match career skills
      const isCatMatch = res.category.toLowerCase().includes(career.career_name.toLowerCase()) || 
                          career.career_name.toLowerCase().includes(res.category.toLowerCase());
      
      const hasTagMatch = res.tags.some((tag) => 
        careerSkills.some((skill: string) => skill.includes(tag) || tag.includes(skill))
      );

      return isCatMatch || hasTagMatch;
    });

    setMatchedCourses(matched);
  }, [career]);

  const handleSaveToggle = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 600)); // Simulated lag

    try {
      if (isSaved && savedId) {
        const { success } = await deleteSavedCareer(savedId);
        if (success) {
          setIsSaved(false);
          setSavedId(undefined);
          Alert.alert('Removed', 'Career removed from your saved list.');
        }
      } else {
        const { success, id } = await saveCareer(career);
        if (success && id) {
          setIsSaved(true);
          setSavedId(id);
          Alert.alert('Saved', 'Career saved to your dashboard portfolio.');
        }
      }
    } catch (err: any) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Open Link', 'Your device does not support opening this URL: ' + url);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {career.career_name}
        </Text>
        <TouchableOpacity onPress={handleSaveToggle} disabled={saving} style={styles.saveHeaderBtn}>
          {saving ? (
            <ActivityIndicator size="small" color={Theme.colors.primary} />
          ) : (
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? Theme.colors.primary : Theme.colors.text}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Core Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Match Score</Text>
            <Text style={styles.statValue}>{career.match_score}%</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Salary in LK</Text>
            <Text style={[styles.statValue, { fontSize: 13, fontWeight: 'bold' }]} numberOfLines={2}>
              {career.salary_range}
            </Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Job Demand</Text>
            <Text style={[styles.statValue, { color: career.job_demand === 'High' ? '#00E676' : Theme.colors.warning }]}>
              {career.job_demand}
            </Text>
          </View>
        </View>

        {/* Section: Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.descText}>{career.description}</Text>
          
          <Text style={styles.subHeading}>Suggested Degree Path:</Text>
          <View style={styles.degreeBox}>
            <Ionicons name="school-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.degreeText}>{career.required_degree}</Text>
          </View>
        </View>

        {/* Section: Skills & Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills & Certifications</Text>
          
          <Text style={styles.subHeading}>Required Skills:</Text>
          <View style={styles.chipsContainer}>
            {career.required_skills.map((skill: string, idx: number) => (
              <View key={idx} style={styles.skillChip}>
                <Text style={styles.skillChipText}>{skill}</Text>
              </View>
            ))}
          </View>

          {career.recommended_certifications && career.recommended_certifications.length > 0 && (
            <>
              <Text style={styles.subHeading}>Recommended Certifications:</Text>
              {career.recommended_certifications.map((cert: string, idx: number) => (
                <View key={idx} style={styles.certRow}>
                  <Ionicons name="ribbon-outline" size={16} color={Theme.colors.warning} style={{ marginRight: 8 }} />
                  <Text style={styles.certText}>{cert}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Section: Career Roadmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Roadmap</Text>
          <Text style={styles.descTextSecondary}>Sequential milestones to help you transition into this role:</Text>
          
          {career.career_roadmap.map((step: string, idx: number) => (
            <View key={idx} style={styles.roadmapStep}>
              <View style={styles.roadmapLeft}>
                <View style={styles.roadmapDot}>
                  <Text style={styles.roadmapDotText}>{idx + 1}</Text>
                </View>
                {idx < career.career_roadmap.length - 1 && <View style={styles.roadmapLine} />}
              </View>
              <View style={styles.roadmapRight}>
                <Text style={styles.roadmapStepText}>{step}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Section: Sri Lankan Job Market */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sri Lankan Job Market</Text>
          
          <View style={styles.marketItem}>
            <Text style={styles.subHeading}>Future Outlook:</Text>
            <Text style={styles.descText}>{career.future_demand}</Text>
          </View>

          <Text style={styles.subHeading}>Top Hiring Companies in LK:</Text>
          <View style={styles.companiesContainer}>
            {career.companies_hiring.map((company: string, idx: number) => (
              <View key={idx} style={styles.companyBadge}>
                <Ionicons name="business" size={14} color={Theme.colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.companyText}>{company}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Section: Matching Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Courses to Progress</Text>
          <Text style={styles.descTextSecondary}>Actual courses from your learning partners portfolio matching your skills:</Text>

          {matchedCourses.length > 0 ? (
            matchedCourses.map((res: any) => (
              <TouchableOpacity
                key={res.id}
                style={styles.resourceCard}
                onPress={() => handleOpenLink(res.link)}
              >
                <View style={styles.resourceInfo}>
                  <Text style={styles.resourceTitle}>{res.title}</Text>
                  <Text style={styles.resourceProvider}>
                    Provided by: {res.provider} • {res.category}
                  </Text>
                </View>
                <Ionicons name="open-outline" size={20} color={Theme.colors.primary} />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.descTextSecondary}>No matching courses found. You can browse general courses in the Learning Resources tab.</Text>
          )}
        </View>

        {/* Save Toggle CTA */}
        <TouchableOpacity
          style={[
            styles.ctaButton,
            isSaved ? styles.ctaButtonDelete : styles.ctaButtonSave,
          ]}
          onPress={handleSaveToggle}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Theme.colors.white} />
          ) : (
            <>
              <Ionicons
                name={isSaved ? 'trash-outline' : 'bookmark-outline'}
                size={20}
                color={Theme.colors.white}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.ctaButtonText}>
                {isSaved ? 'Remove from Saved Careers' : 'Save this Career Path'}
              </Text>
            </>
          )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 10,
    paddingBottom: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  backBtn: {
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    flex: 1,
  },
  saveHeaderBtn: {
    padding: Theme.spacing.xs,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
    gap: 16,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    paddingVertical: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xs,
  },
  statLabel: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  dividerVertical: {
    width: 1,
    backgroundColor: Theme.colors.border,
    height: '80%',
    alignSelf: 'center',
  },
  section: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: Theme.spacing.xs,
  },
  descText: {
    fontSize: 13,
    color: Theme.colors.text,
    lineHeight: 20,
  },
  descTextSecondary: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  subHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  degreeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.roundness.small,
    padding: Theme.spacing.sm,
    marginTop: 4,
  },
  degreeText: {
    fontSize: 13,
    color: Theme.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  skillChip: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  skillChipText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  certText: {
    fontSize: 13,
    color: Theme.colors.text,
    flex: 1,
  },
  roadmapStep: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  roadmapLeft: {
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    width: 24,
  },
  roadmapDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  roadmapDotText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.white,
  },
  roadmapLine: {
    width: 2,
    backgroundColor: Theme.colors.border,
    flex: 1,
    marginVertical: 4,
  },
  roadmapRight: {
    flex: 1,
    paddingBottom: Theme.spacing.lg,
    paddingTop: 2,
  },
  roadmapStepText: {
    fontSize: 13,
    color: Theme.colors.text,
    lineHeight: 18,
  },
  marketItem: {
    marginBottom: Theme.spacing.md,
  },
  companiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  companyText: {
    fontSize: 12,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  resourceInfo: {
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 2,
  },
  resourceProvider: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
  },
  ctaButton: {
    height: 48,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: Theme.spacing.md,
    ...Theme.shadows.medium,
  },
  ctaButtonSave: {
    backgroundColor: Theme.colors.primary,
  },
  ctaButtonDelete: {
    backgroundColor: Theme.colors.error,
  },
  ctaButtonText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
