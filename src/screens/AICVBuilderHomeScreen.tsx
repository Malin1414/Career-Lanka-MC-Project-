import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { downloadPDF, shareCV } from '../utils/pdfHelper';

const { width } = Dimensions.get('window');

const RESUME_TIPS = [
  {
    title: 'Use Action Verbs',
    desc: 'Begin each bullet point with strong verbs like "Architected", "Optimized", or "Synthesized" to demonstrate active impact.'
  },
  {
    title: 'Highlight Metrics',
    desc: 'Quantify achievements where possible. E.g. "Reduced API response latency by 15%" is much stronger than "Improved API speed".'
  },
  {
    title: 'Tailor for ATS',
    desc: 'Applicant Tracking Systems look for matching keywords. Scan the job description and weave key technical terms directly into your skills.'
  }
];

export default function AICVBuilderHomeScreen({ navigation }: any) {
  const { profile } = useAuth();
  const [myCVs, setMyCVs] = useState<any[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Load CV history whenever this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadCVHistory();
    }, [])
  );

  const loadCVHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('@careerlanka_my_cvs');
      if (stored) {
        setMyCVs(JSON.parse(stored));
      } else {
        setMyCVs([]);
      }
    } catch (e) {
      console.error('Failed to load CV history:', e);
    }
  };

  const handleDownloadItem = async (data: any) => {
    await downloadPDF(data, setDownloading);
  };

  const handleShareItem = async (data: any) => {
    await shareCV(data, setSharing);
  };

  const handleDeleteItem = async (id: string) => {
    Alert.alert(
      'Delete CV',
      'Are you sure you want to delete this CV from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = myCVs.filter(c => c.id !== id);
              setMyCVs(updated);
              await AsyncStorage.setItem('@careerlanka_my_cvs', JSON.stringify(updated));
            } catch (e) {
              console.error(e);
              Alert.alert('Error', 'Failed to delete CV.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI CV Builder</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Ready to stand out, {profile?.full_name?.split(' ')[0] || 'Saman'}?</Text>
          <Text style={styles.welcomeSub}>
            Generate an ATS-friendly, professional resume formatted specifically for tech and engineering roles in Sri Lanka.
          </Text>
          
          <TouchableOpacity 
            style={styles.buildBtn}
            onPress={() => navigation.navigate('CVInformationForm')}
          >
            <Ionicons name="sparkles" size={18} color="#0A0B0D" style={{ marginRight: 8 }} />
            <Text style={styles.buildBtnText}>Build Resume</Text>
          </TouchableOpacity>
        </View>

        {/* ATS Score Preview */}
        <View style={styles.atsCard}>
          <View style={styles.atsHeaderRow}>
            <Text style={styles.atsCardTitle}>ATS Score Preview</Text>
            <View style={styles.atsBadge}>
              <Text style={styles.atsBadgeText}>85% Score</Text>
            </View>
          </View>
          
          <Text style={styles.atsDesc}>
            Your CV details are highly structured. Add more AWS cloud and container keywords to reach a 95%+ match.
          </Text>

          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: '85%' }]} />
          </View>
        </View>

        {/* My CVs List Section */}
        <Text style={styles.sectionTitle}>My CVs</Text>
        
        {downloading || sharing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Theme.colors.primary} />
            <Text style={styles.loadingText}>Processing document...</Text>
          </View>
        ) : null}

        {myCVs.length > 0 ? (
          myCVs.map((item) => (
            <View key={item.id} style={styles.cvCard}>
              <View style={styles.cvIconWrapper}>
                <Ionicons name="document-text" size={30} color={Theme.colors.primary} />
              </View>
              <View style={styles.cvDetails}>
                <Text style={styles.cvName}>{item.fullName || 'Unnamed Resume'}</Text>
                <Text style={styles.cvRole}>{item.title || 'No Headline'}</Text>
                <Text style={styles.cvDate}>{item.dateString}</Text>
              </View>
              <View style={styles.cvActionsCol}>
                <View style={styles.cvActionsRow}>
                  <TouchableOpacity 
                    style={styles.cvIconBtn} 
                    onPress={() => navigation.navigate('ResumePreview', { cvData: item.cvData })}
                  >
                    <Ionicons name="eye-outline" size={18} color={Theme.colors.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cvIconBtn} 
                    onPress={() => handleDownloadItem(item.cvData)}
                  >
                    <Ionicons name="download-outline" size={18} color={Theme.colors.text} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.cvIconBtn} 
                    onPress={() => handleShareItem(item.cvData)}
                  >
                    <Ionicons name="share-social-outline" size={18} color={Theme.colors.text} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.cvIconBtn} 
                    onPress={() => handleDeleteItem(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCVCard}>
            <Ionicons name="document-outline" size={36} color={Theme.colors.textSecondary} style={{ marginBottom: 8 }} />
            <Text style={styles.emptyCVText}>No resumes generated yet.</Text>
          </View>
        )}

        {/* Resume Writing Tips Carousel */}
        <Text style={styles.sectionTitle}>Resume Writing Tips</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tipsScroll}
        >
          {RESUME_TIPS.map((tip, idx) => (
            <View key={idx} style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb-outline" size={18} color={Theme.colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.tipTitle}>{tip.title}</Text>
              </View>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </View>
          ))}
        </ScrollView>

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
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
    gap: 16,
  },
  welcomeCard: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.lg,
    ...Theme.shadows.medium,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0A0B0D', // Black on green theme background
    marginBottom: Theme.spacing.xs,
  },
  welcomeSub: {
    fontSize: 13,
    color: 'rgba(10, 11, 13, 0.85)',
    lineHeight: 18,
    marginBottom: Theme.spacing.lg,
  },
  buildBtn: {
    backgroundColor: '#0A0B0D', // Dark button on green
    borderRadius: Theme.roundness.medium,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  buildBtnText: {
    color: Theme.colors.primary, // Green text on dark background
    fontWeight: 'bold',
    fontSize: 14,
  },
  atsCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  atsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  atsCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  atsBadge: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  atsBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  atsDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: Theme.spacing.md,
  },
  scoreBarBg: {
    height: 6,
    backgroundColor: Theme.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.primary, // Green accent
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginTop: Theme.spacing.xs,
  },
  cvCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  cvIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Theme.roundness.medium,
    backgroundColor: 'rgba(5, 196, 143, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  cvDetails: {
    flex: 1,
    marginRight: Theme.spacing.xs,
  },
  cvName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  cvRole: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginTop: 1,
  },
  cvDate: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  cvActionsCol: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  cvActionsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cvIconBtn: {
    padding: 6,
    borderRadius: Theme.roundness.small,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCVCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyCVText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
  },
  tipsScroll: {
    gap: 12,
    paddingRight: Theme.spacing.lg,
  },
  tipCard: {
    width: width * 0.7,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  tipDesc: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    lineHeight: 15,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 196, 143, 0.05)',
    padding: 10,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.1)',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});
