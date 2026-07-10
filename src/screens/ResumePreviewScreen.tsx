import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { downloadPDF, shareCV } from '../utils/pdfHelper';

export default function ResumePreviewScreen({ route, navigation }: any) {
  const { cvData, saveCV } = useAuth();
  
  // Accept custom cvData from parameters (for viewing history)
  const displayCvData = route?.params?.cvData || cvData;
  const isViewingHistory = !!route?.params?.cvData;

  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  // Handle hardware back button to prevent navigation loop back to loading screen
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('AICVBuilderHome');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleDownload = async () => {
    if (!displayCvData) return;
    await downloadPDF(displayCvData, setDownloading);
  };

  const handleShare = async () => {
    if (!displayCvData) return;
    await shareCV(displayCvData, setSharing);
  };

  const handleEdit = () => {
    // If viewing history, we can load it into context before editing
    if (isViewingHistory) {
      saveCV(displayCvData);
    }
    navigation.navigate('CVInformationForm');
  };

  const handleBuildAnother = () => {
    Alert.alert(
      'Build Another CV',
      'Are you sure you want to build another CV? This will clear the current inputs.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Clear & Start',
          onPress: async () => {
            await saveCV({
              fullName: '',
              title: '',
              email: '',
              phone: '',
              github: '',
              linkedin: '',
              address: '',
              summary: '',
              education: [],
              skills: [],
              languages: [],
              experience: [],
              projects: [],
              certifications: [],
              achievements: [],
              references: '',
            });
            navigation.replace('CVInformationForm');
          },
        },
      ]
    );
  };

  const handleBackToDashboard = () => {
    navigation.navigate('MainTabs');
  };

  if (!displayCvData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('AICVBuilderHome')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resume Preview</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No CV data found. Please complete the form first.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AICVBuilderHome')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isViewingHistory ? 'View CV History' : 'Resume Preview'}
        </Text>
        <TouchableOpacity 
          style={styles.editHeaderBtn}
          onPress={handleEdit}
        >
          <Text style={styles.editHeaderText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Printable Paper-like Card Mockup */}
        <View style={styles.paperCV}>
          
          {/* Header Block */}
          <View style={styles.cvHeaderBlock}>
            <Text style={styles.cvName}>{displayCvData.fullName}</Text>
            <Text style={styles.cvHeadline}>{displayCvData.title}</Text>
            
            {/* Contact Details Row */}
            <View style={styles.cvContactRow}>
              {displayCvData.email && <Text style={styles.contactItem}><Ionicons name="mail" size={10} /> {displayCvData.email}</Text>}
              {displayCvData.phone && <Text style={styles.contactItem}><Ionicons name="call" size={10} /> {displayCvData.phone}</Text>}
              {displayCvData.address && <Text style={styles.contactItem}><Ionicons name="location" size={10} /> {displayCvData.address}</Text>}
            </View>
            
            {/* Social Links Row */}
            <View style={styles.cvSocialRow}>
              {displayCvData.github && <Text style={styles.contactItem}><Ionicons name="logo-github" size={10} /> {displayCvData.github}</Text>}
              {displayCvData.linkedin && <Text style={styles.contactItem}><Ionicons name="logo-linkedin" size={10} /> {displayCvData.linkedin}</Text>}
            </View>
          </View>

          <View style={styles.cvDivider} />

          {/* Double Column Layout */}
          <View style={styles.cvColumnsContainer}>
            
            {/* Left Column (Narrow, Skills/Certs) */}
            <View style={styles.cvLeftColumn}>
              
              {/* Skills */}
              <Text style={styles.columnSecTitle}>SKILLS</Text>
              {displayCvData.skills.map((s: string, idx: number) => (
                <Text key={idx} style={styles.skillBullet}>• {s}</Text>
              ))}

              {/* Languages */}
              {displayCvData.languages && displayCvData.languages.length > 0 && (
                <>
                  <Text style={[styles.columnSecTitle, { marginTop: 12 }]}>LANGUAGES</Text>
                  {displayCvData.languages.map((l: string, idx: number) => (
                    <Text key={idx} style={styles.skillBullet}>• {l}</Text>
                  ))}
                </>
              )}

              {/* Certifications */}
              {displayCvData.certifications && displayCvData.certifications.length > 0 && (
                <>
                  <Text style={[styles.columnSecTitle, { marginTop: 12 }]}>CERTIFICATIONS</Text>
                  {displayCvData.certifications.map((c: string, idx: number) => (
                    <Text key={idx} style={styles.certBullet}>• {c}</Text>
                  ))}
                </>
              )}
            </View>

            {/* Vertical column divider line */}
            <View style={styles.columnBorderDivider} />

            {/* Right Column (Wide, Exp/Edu) */}
            <View style={styles.cvRightColumn}>
              
              {/* Professional Summary */}
              {displayCvData.summary && (
                <View style={styles.cvSection}>
                  <Text style={styles.sectionHeading}>SUMMARY</Text>
                  <Text style={styles.sectionBodyText}>{displayCvData.summary}</Text>
                </View>
              )}

              {/* Education */}
              {displayCvData.education && displayCvData.education.length > 0 && (
                <View style={styles.cvSection}>
                  <Text style={styles.sectionHeading}>EDUCATION</Text>
                  {displayCvData.education.map((edu: any) => (
                    <View key={edu.id} style={styles.eduBlock}>
                      <View style={styles.blockHeaderRow}>
                        <Text style={styles.blockTitle}>{edu.institution}</Text>
                        <Text style={styles.blockPeriod}>{edu.period}</Text>
                      </View>
                      <Text style={styles.blockSub}>{edu.degree} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</Text>
                      {edu.achievements ? <Text style={styles.blockDesc}>{edu.achievements}</Text> : null}
                    </View>
                  ))}
                </View>
              )}

              {/* Experience */}
              {displayCvData.experience && displayCvData.experience.length > 0 && (
                <View style={styles.cvSection}>
                  <Text style={styles.sectionHeading}>EXPERIENCE</Text>
                  {displayCvData.experience.map((exp: any) => (
                    <View key={exp.id} style={styles.expBlock}>
                      <View style={styles.blockHeaderRow}>
                        <Text style={styles.blockTitle}>{exp.company}</Text>
                        <Text style={styles.blockPeriod}>{exp.period}</Text>
                      </View>
                      <Text style={styles.blockSub}>{exp.role}</Text>
                      <Text style={styles.blockDesc}>{exp.description}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Projects */}
              {displayCvData.projects && displayCvData.projects.length > 0 && (
                <View style={styles.cvSection}>
                  <Text style={styles.sectionHeading}>FEATURED PROJECT</Text>
                  {displayCvData.projects.map((proj: any) => (
                    <View key={proj.id} style={styles.projBlock}>
                      <View style={styles.blockHeaderRow}>
                        <Text style={styles.blockTitle}>{proj.name}</Text>
                        <Text style={styles.blockPeriod}>{proj.role}</Text>
                      </View>
                      {proj.link ? <Text style={styles.projLinkText}>{proj.link}</Text> : null}
                      <Text style={styles.projTechStack}>Tech Stack: {proj.techStack}</Text>
                      <Text style={styles.blockDesc}>{proj.description}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* References */}
              {displayCvData.references ? (
                <View style={styles.cvSection}>
                  <Text style={styles.sectionHeading}>REFERENCES</Text>
                  <Text style={styles.referencesText}>{displayCvData.references}</Text>
                </View>
              ) : null}

            </View>
          </View>
        </View>

        {/* Action controls below the document */}
        <View style={styles.actionsPanel}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.downloadBtn]}
            onPress={handleDownload}
            disabled={downloading || sharing}
          >
            {downloading ? (
              <ActivityIndicator size="small" color="#0A0B0D" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#0A0B0D" style={{ marginRight: 8 }} />
                <Text style={styles.downloadBtnText}>Download PDF</Text>
              </>
            )}
          </TouchableOpacity>
 
          <TouchableOpacity 
            style={[styles.actionBtn, styles.shareBtn]}
            onPress={handleShare}
            disabled={downloading || sharing}
          >
            {sharing ? (
              <ActivityIndicator size="small" color={Theme.colors.primary} />
            ) : (
              <>
                <Ionicons name="share-social-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.shareBtnText}>Share CV</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Secondary options row */}
        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={handleEdit}>
            <Ionicons name="create-outline" size={16} color={Theme.colors.text} style={{ marginRight: 6 }} />
            <Text style={styles.secondaryBtnText}>Edit Resume</Text>
          </TouchableOpacity>

          {!isViewingHistory && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleBuildAnother}>
              <Ionicons name="add-circle-outline" size={16} color={Theme.colors.text} style={{ marginRight: 6 }} />
              <Text style={styles.secondaryBtnText}>Build Another</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Return to Dashboard shortcut */}
        <TouchableOpacity style={styles.dashboardBtn} onPress={handleBackToDashboard}>
          <Ionicons name="home-outline" size={18} color="#0A0B0D" style={{ marginRight: 8 }} />
          <Text style={styles.dashboardBtnText}>Back to Dashboard</Text>
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
  editHeaderBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: Theme.roundness.small,
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
  },
  editHeaderText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  scrollContainer: {
    padding: Theme.spacing.md,
    paddingBottom: 40,
    gap: 16,
  },
  paperCV: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D2D6DC',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 560,
  },
  cvHeaderBlock: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cvName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  cvHeadline: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cvContactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  cvSocialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  contactItem: {
    fontSize: 10,
    color: '#4B5563',
  },
  cvDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  cvColumnsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cvLeftColumn: {
    width: '32%',
  },
  columnBorderDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  cvRightColumn: {
    flex: 1,
  },
  columnSecTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 2,
    marginBottom: 6,
  },
  skillBullet: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 14,
    marginBottom: 2,
  },
  certBullet: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 13,
    marginBottom: 4,
  },
  cvSection: {
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 2,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  sectionBodyText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 14,
  },
  eduBlock: {
    marginBottom: 8,
  },
  expBlock: {
    marginBottom: 8,
  },
  projBlock: {
    marginBottom: 8,
  },
  blockHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  blockTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    marginRight: 6,
    lineHeight: 14,
  },
  blockPeriod: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '500',
  },
  blockSub: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 1,
  },
  blockDesc: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 13,
    marginTop: 2,
  },
  projLinkText: {
    fontSize: 9,
    color: Theme.colors.primary,
    fontWeight: '500',
    marginTop: 1,
  },
  projTechStack: {
    fontSize: 9,
    color: '#1F2937',
    fontWeight: '600',
    marginTop: 1,
  },
  referencesText: {
    fontSize: 9.5,
    color: '#374151',
    fontStyle: 'italic',
  },
  actionsPanel: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  downloadBtn: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.small,
  },
  downloadBtnText: {
    color: '#0A0B0D', // Black text on green
    fontWeight: 'bold',
    fontSize: 14,
  },
  shareBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
  },
  shareBtnText: {
    color: Theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: Theme.roundness.medium,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  secondaryBtnText: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 13,
  },
  dashboardBtn: {
    height: 48,
    borderRadius: Theme.roundness.medium,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Theme.shadows.medium,
  },
  dashboardBtnText: {
    color: '#0A0B0D', // Black text on green
    fontWeight: 'bold',
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: Theme.colors.error,
    textAlign: 'center',
  },
});
