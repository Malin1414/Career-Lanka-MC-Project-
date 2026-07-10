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
  StatusBar,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { LearningResource } from '../types';

const SAMPLE_RESOURCES: LearningResource[] = [
  {
    id: 'l1',
    title: 'Google Data Analytics Professional Certificate',
    description: 'Gain in-demand skills that can lead to an entry-level job in data analytics. Learn data cleaning, analysis, visualization, and R programming.',
    provider: 'Google Certificates',
    link: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    category: 'Data Science',
    tags: ['data analytics', 'r programming', 'tableau', 'sql'],
  },
  {
    id: 'l2',
    title: 'Meta Front-End Developer Professional Certificate',
    description: 'Prepare for a career as a front-end developer. Learn HTML, CSS, JavaScript, React, and UX design principles.',
    provider: 'Coursera',
    link: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    category: 'Web Development',
    tags: ['react', 'javascript', 'html', 'css'],
  },
  {
    id: 'l3',
    title: 'Responsive Web Design Certification',
    description: 'Learn the basics of web design, including HTML, CSS, visual design, and accessibility by building responsive projects.',
    provider: 'freeCodeCamp',
    link: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    category: 'Web Development',
    tags: ['html', 'css', 'flexbox', 'grid'],
  },
  {
    id: 'l4',
    title: 'Introduction to Cybersecurity',
    description: 'Explore the field of cybersecurity, including the threats, vulnerabilities, and how organizations protect themselves online.',
    provider: 'Cisco Networking Academy',
    link: 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity',
    category: 'Cybersecurity',
    tags: ['networks', 'security', 'firewalls', 'threats'],
  },
  {
    id: 'l5',
    title: 'Microsoft Azure Fundamentals (AZ-900)',
    description: 'Understand foundational cloud concepts, Azure services, security, privacy, compliance, and trust.',
    provider: 'Microsoft Learn',
    link: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/',
    category: 'Cloud Computing',
    tags: ['azure', 'cloud', 'networking', 'saas'],
  },
  {
    id: 'l6',
    title: 'Harvard CS50: Introduction to Computer Science',
    description: 'The legendary introductory course on computer science covering C, Python, SQL, JavaScript, CSS, and HTML.',
    provider: 'YouTube',
    link: 'https://www.youtube.com/watch?v=8mAITcNt70k',
    category: 'Computer Science',
    tags: ['cs50', 'programming', 'algorithms', 'python'],
  },
  {
    id: 'l7',
    title: 'AWS Certified Cloud Practitioner Course',
    description: 'Comprehensive video preparation for AWS Cloud Architect basics. Ideal starting point for infrastructure engineering.',
    provider: 'YouTube',
    link: 'https://www.youtube.com/watch?v=SOTamWGuq2c',
    category: 'Cloud Computing',
    tags: ['aws', 'cloud', 'architecture', 'devops'],
  }
];

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'Computer Science'];

export default function LearningResourcesScreen({ navigation }: any) {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setResources(SAMPLE_RESOURCES);
  }, []);

  const getFilteredResources = () => {
    if (activeCategory === 'All') return resources;
    return resources.filter(
      (res) => res.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
    );
  };

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Open Link', 'Device cannot open this link: ' + url);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link.');
    }
  };

  const getProviderColor = (provider: string) => {
    const p = provider.toLowerCase();
    if (p.includes('coursera')) return '#2A73CC';
    if (p.includes('freecodecamp')) return '#0A0A23';
    if (p.includes('cisco')) return '#049FD9';
    if (p.includes('google')) return '#EA4335';
    if (p.includes('microsoft')) return '#F25022';
    if (p.includes('youtube')) return '#FF0000';
    return Theme.colors.primary;
  };

  const filteredList = getFilteredResources();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Resources</Text>
      </View>

      {/* Category Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterTab,
                activeCategory === cat && styles.filterTabActive,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeCategory === cat && styles.filterTabTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredList.length > 0 ? (
          <View style={styles.list}>
            {filteredList.map((res) => (
              <View key={res.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.providerBadge,
                      { backgroundColor: getProviderColor(res.provider) },
                    ]}
                  >
                    <Text style={styles.providerText}>{res.provider}</Text>
                  </View>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{res.category}</Text>
                  </View>
                </View>

                <Text style={styles.resourceTitle}>{res.title}</Text>
                <Text style={styles.resourceDesc}>{res.description}</Text>

                {res.tags && res.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {res.tags.map((tag, tIdx) => (
                      <Text key={tIdx} style={styles.tagText}>
                        #{tag}
                      </Text>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={styles.openBtn}
                  onPress={() => handleOpenLink(res.link)}
                >
                  <Text style={styles.openBtnText}>Start Learning</Text>
                  <Ionicons name="open-outline" size={16} color={Theme.colors.white} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="book-outline" size={44} color={Theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No courses found</Text>
            <Text style={styles.emptySubtitle}>
              There are no courses matching category "{activeCategory}" at this time.
            </Text>
          </View>
        )}
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
  },
  filterBar: {
    backgroundColor: Theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: Theme.spacing.lg,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.roundness.round,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  filterTabActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  filterTabText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: Theme.colors.white,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },
  list: {
    gap: 16,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  providerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
  },
  providerText: {
    color: Theme.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  categoryBadge: {
    backgroundColor: Theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  categoryText: {
    color: Theme.colors.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 6,
  },
  resourceDesc: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: Theme.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Theme.spacing.md,
  },
  tagText: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  openBtn: {
    backgroundColor: Theme.colors.primary,
    height: 38,
    borderRadius: Theme.roundness.small,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  openBtnText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
    marginTop: Theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
