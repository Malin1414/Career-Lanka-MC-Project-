import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', 'Finalist'];

export default function ProfileScreen({ navigation }: any) {
  const { user, profile, updateProfile, profileLoading, signOut } = useAuth();
  
  const [isEditMode, setIsEditMode] = useState(false);

  // Field states for editing
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [degree, setDegree] = useState('');
  const [academicYear, setAcademicYear] = useState('Finalist');
  const [district, setDistrict] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelectAvatar = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option to update your profile photo:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upload from Gallery', onPress: pickImageFromGallery },
        { text: 'Remove Photo', style: 'destructive', onPress: handleRemovePhoto }
      ]
    );
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Career Lanka needs library permissions to select photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      let photoUrl = asset.uri;

      if (asset.base64) {
        photoUrl = `data:image/jpeg;base64,${asset.base64}`;
      }

      setProfilePhoto(photoUrl);
      const updateResult = await updateProfile({ profile_photo: photoUrl });

      if (updateResult.success) {
        Alert.alert('Success', 'Profile photo updated successfully.');
      } else {
        Alert.alert('Upload Failed', updateResult.error || 'Failed to sync photo to storage service.');
      }
    }
  };

  const handleRemovePhoto = async () => {
    setProfilePhoto('');
    const updateResult = await updateProfile({ profile_photo: '' });
    if (updateResult.success) {
      Alert.alert('Photo Removed', 'Your profile photo has been reset to default.');
    } else {
      Alert.alert('Failed to Remove Photo', updateResult.error || 'Failed to remove photo.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Career Lanka?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  // Sync state with profile data
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUniversity(profile.university || '');
      setFaculty(profile.faculty || '');
      setDegree(profile.degree_program || '');
      setAcademicYear(profile.academic_year || 'Finalist');
      setDistrict(profile.district || '');
      setSkillsText(profile.skills ? profile.skills.join(', ') : '');
      setCareerGoal(profile.career_goal || '');
      setProfilePhoto(profile.profile_photo || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim() || !university.trim() || !faculty.trim() || !degree.trim()) {
      Alert.alert('Required Fields', 'Please fill in Name, University, Faculty, and Degree.');
      return;
    }

    setSaving(true);

    const skillsArray = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      full_name: fullName.trim(),
      university: university.trim(),
      faculty: faculty.trim(),
      degree_program: degree.trim(),
      academic_year: academicYear,
      district: district.trim(),
      skills: skillsArray,
      career_goal: careerGoal.trim(),
      profile_photo: profilePhoto.trim(),
    };

    const { success, error } = await updateProfile(payload);
    setSaving(false);

    if (success) {
      setIsEditMode(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } else {
      Alert.alert('Update Failed', error || 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Top Header / Brand Bar */}
      <View style={styles.topBrandBar}>
        <View style={styles.brandContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.smallLogo} resizeMode="contain" />
          <Text style={styles.brandText}>CareerLanka AI</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity 
            onPress={() => setIsEditMode(!isEditMode)} 
            style={styles.actionIconButton}
          >
            <Ionicons 
              name={isEditMode ? 'close-circle' : 'create-outline'} 
              size={22} 
              color={Theme.colors.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconButton} onPress={() => Alert.alert('Menu', 'Menu drawer clicked (Simulated)')}>
            <Ionicons name="menu-outline" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {isEditMode ? (
          /* ================= EDIT MODE UI ================= */
          <View style={styles.card}>
            <Text style={styles.cardSectionTitle}>Academic Profile</Text>

            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="e.g. Saman Perera" placeholderTextColor={Theme.colors.textSecondary} />
            </View>

            <Text style={styles.label}>University *</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={university} onChangeText={setUniversity} placeholder="e.g. University of Colombo" placeholderTextColor={Theme.colors.textSecondary} />
            </View>

            <Text style={styles.label}>Faculty *</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={faculty} onChangeText={setFaculty} placeholder="e.g. School of Computing" placeholderTextColor={Theme.colors.textSecondary} />
            </View>

            <Text style={styles.label}>Degree Program *</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={degree} onChangeText={setDegree} placeholder="e.g. BSc in Computer Science" placeholderTextColor={Theme.colors.textSecondary} />
            </View>

            <Text style={styles.label}>Academic Year</Text>
            <View style={styles.yearSelector}>
              {ACADEMIC_YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearOption,
                    academicYear === year && styles.yearOptionSelected,
                  ]}
                  onPress={() => setAcademicYear(year)}
                >
                  <Text
                    style={[
                      styles.yearText,
                      academicYear === year && styles.yearTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.cardSectionTitle}>Personal & Skills</Text>

            <Text style={styles.label}>District / City</Text>
            <View style={styles.inputContainer}>
              <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="e.g. Colombo, Sri Lanka" placeholderTextColor={Theme.colors.textSecondary} />
            </View>

            <Text style={styles.label}>Skills (comma separated)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={skillsText}
                onChangeText={setSkillsText}
                placeholder="e.g. Python, React / Next.js, AWS Cloud"
                placeholderTextColor={Theme.colors.textSecondary}
              />
            </View>

            <Text style={styles.label}>Career Goal</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={careerGoal}
                onChangeText={setCareerGoal}
                placeholder="e.g. Full Stack Developer"
                placeholderTextColor={Theme.colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator size="small" color="#0A0B0D" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#0A0B0D" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>Save Profile / Update</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* ================= VIEW MODE UI (Mockup Matching) ================= */
          <View style={styles.viewContainer}>
            {/* Profile Avatar & Primary Credentials */}
            <View style={styles.profileBanner}>
              <TouchableOpacity style={styles.avatarWrapper} onPress={handleSelectAvatar}>
                {profile?.profile_photo && !profile.profile_photo.includes('unsplash.com') ? (
                  <Image 
                    source={{ uri: profile.profile_photo }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="camera-outline" size={32} color="#94A3B8" />
                  </View>
                )}
                <View style={styles.verifiedBadge}>
                  <Ionicons name="camera" size={12} color="#0A0B0D" />
                </View>
              </TouchableOpacity>

              <Text style={styles.profileName}>{profile?.full_name || 'No Name Provided'}</Text>
              <Text style={styles.profileTag}>Finalist @ {profile?.university || 'University of Colombo'}</Text>

              {/* Bio Details Info Cards */}
              <View style={styles.detailsRowContainer}>
                <View style={styles.detailItem}>
                  <Ionicons name="school-outline" size={16} color={Theme.colors.primary} />
                  <Text style={styles.detailItemText}>{profile?.degree_program || 'BSc in Computer Science'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color={Theme.colors.primary} />
                  <Text style={styles.detailItemText}>{profile?.district || 'Colombo, Sri Lanka'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="mail-outline" size={16} color={Theme.colors.primary} />
                  <Text style={styles.detailItemText}>{user?.email || 'No Email'}</Text>
                </View>
              </View>

              {/* Generate PDF CV Shortcut */}
              <TouchableOpacity 
                style={styles.pdfCtaBtn}
                onPress={() => navigation.navigate('AICVBuilderHome')}
              >
                <Ionicons name="document-text-outline" size={18} color="#0A0B0D" style={{ marginRight: 8 }} />
                <Text style={styles.pdfCtaBtnText}>Generate PDF CV</Text>
              </TouchableOpacity>
            </View>

            {/* Section: UNIVERSITY info */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionCardLabel}>UNIVERSITY</Text>
              <View style={styles.uniContentRow}>
                <View style={styles.uniIconWrapper}>
                  <Ionicons name="business" size={24} color={Theme.colors.primary} />
                </View>
                <View style={styles.uniDetails}>
                  <Text style={styles.uniName}>{profile?.university || 'University of Colombo'}</Text>
                  <Text style={styles.uniFaculty}>{profile?.faculty || 'School of Computing'}</Text>
                  <Text style={styles.uniStatus}>{profile?.academic_year || 'Undergraduate Finalist'}</Text>
                </View>
              </View>
            </View>

            {/* Section: Technical Arsenal (Expertise) */}
            <View style={styles.sectionCard}>
              <View style={styles.expertiseHeader}>
                <View style={styles.iconTitleRow}>
                  <Ionicons name="code-working" size={20} color={Theme.colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.sectionCardTitle}>Technical Arsenal</Text>
                </View>
                <View style={styles.expertiseBadge}>
                  <Text style={styles.expertiseBadgeText}>Expertise</Text>
                </View>
              </View>

              {/* Skill 1 */}
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.slice(0, 3).map((skill, index) => {
                  const percent = index === 0 ? '90%' : index === 1 ? '85%' : '70%';
                  return (
                    <View key={skill} style={styles.skillProgressItem}>
                      <View style={styles.skillLabelRow}>
                        <Text style={styles.skillLabel}>{skill.trim()}</Text>
                        <Text style={styles.skillPercent}>{percent}</Text>
                      </View>
                      <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: percent, backgroundColor: Theme.colors.primary }]} />
                      </View>
                    </View>
                  );
                })
              ) : (
                <>
                  <View style={styles.skillProgressItem}>
                    <View style={styles.skillLabelRow}>
                      <Text style={styles.skillLabel}>Python</Text>
                      <Text style={styles.skillPercent}>90%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '90%', backgroundColor: Theme.colors.primary }]} />
                    </View>
                  </View>
                  <View style={styles.skillProgressItem}>
                    <View style={styles.skillLabelRow}>
                      <Text style={styles.skillLabel}>React / Next.js</Text>
                      <Text style={styles.skillPercent}>85%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '85%', backgroundColor: Theme.colors.primary }]} />
                    </View>
                  </View>
                  <View style={styles.skillProgressItem}>
                    <View style={styles.skillLabelRow}>
                      <Text style={styles.skillLabel}>AWS Cloud</Text>
                      <Text style={styles.skillPercent}>70%</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '70%', backgroundColor: Theme.colors.primary }]} />
                    </View>
                  </View>
                </>
              )}

              {/* Tag Chips */}
              <View style={styles.chipsContainer}>
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((item) => (
                    <View key={item} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{item.trim()}</Text>
                    </View>
                  ))
                ) : (
                  ['TypeScript', 'PostgreSQL', 'Docker', 'GraphQL'].map((item) => (
                    <View key={item} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{item}</Text>
                    </View>
                  ))
                )}
              </View>
            </View>

            {/* Section: Experience Timeline */}
            <View style={styles.sectionCard}>
              <View style={styles.iconTitleRow}>
                <Ionicons name="briefcase-outline" size={20} color={Theme.colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.sectionCardTitle}>Experience</Text>
              </View>

              <View style={styles.timelineList}>
                {/* Exp Item 1 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.timelineDotActive} />
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.timelineMetaRow}>
                      <Text style={styles.timelineRole}>Freelance Developer</Text>
                      <Text style={styles.timelineStatusTag}>Present</Text>
                    </View>
                    <Text style={styles.timelineCompany}>Self-Employed • Remote</Text>
                    <Text style={styles.timelineBullet}>• Architecting scalable SaaS solutions</Text>
                    <Text style={styles.timelineBullet}>• Custom AI Integration for local SMEs</Text>
                  </View>
                </View>

                {/* Exp Item 2 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={styles.timelineDot} />
                  </View>
                  <View style={styles.timelineRight}>
                    <View style={styles.timelineMetaRow}>
                      <Text style={styles.timelineRole}>Software Engineering Intern</Text>
                      <Text style={styles.timelineDuration}>2023 - 8 Months</Text>
                    </View>
                    <Text style={styles.timelineCompany}>Global Tech Solutions • Colombo</Text>
                    <Text style={styles.timelineBullet}>• Contributed to the core internal dashboard using React and Redux. Reduced API latency by 15%.</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Featured Project */}
            <View style={styles.sectionCard}>
              <View style={styles.projectImageContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop' }} 
                  style={styles.projectImage} 
                />
                <View style={styles.projectImageTag}>
                  <Text style={styles.projectImageTagText}>Featured Project</Text>
                </View>
              </View>
              
              <Text style={styles.projectTitle}>AI-Driven Job Matcher</Text>
              <Text style={styles.projectDescription}>
                A predictive analytics tool that maps student skills to real-time market demand using local industry datasets. Built with Python and OpenAI API.
              </Text>
              
              <View style={styles.projectLinksRow}>
                <TouchableOpacity style={styles.projectLinkBtn}>
                  <Ionicons name="link" size={14} color={Theme.colors.primary} />
                  <Text style={styles.projectLinkBtnText}>Live Demo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.projectLinkBtn}>
                  <Ionicons name="logo-github" size={14} color={Theme.colors.primary} />
                  <Text style={styles.projectLinkBtnText}>GitHub</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Section: Academic Journey Completion */}
            <View style={styles.sectionCard}>
              <View style={styles.academicHeaderRow}>
                <Text style={styles.academicTitle}>Academic Journey Completion</Text>
                <Text style={styles.academicPercent}>94%</Text>
              </View>

              {/* Progress split bar */}
              <View style={styles.academicProgressRow}>
                <View style={styles.academicProgressSegment} />
                <View style={styles.academicProgressSegment} />
                <View style={styles.academicProgressSegment} />
                <View style={[styles.academicProgressSegment, styles.academicProgressSegmentActive]}>
                  {/* Small round dot at 94% */}
                  <View style={styles.academicProgressNode} />
                </View>
              </View>

              {/* Year Labels */}
              <View style={styles.yearLabelsRow}>
                <Text style={styles.yearLabel}>Year 1</Text>
                <Text style={styles.yearLabel}>Year 2</Text>
                <Text style={styles.yearLabel}>Year 3</Text>
                <Text style={styles.yearLabelActive}>Final Year</Text>
              </View>
            </View>

            {/* Section: Account & settings menu */}
            <View style={[styles.sectionCard, { marginTop: 4 }]}>
              <Text style={styles.sectionCardLabel}>ACCOUNT SETTINGS</Text>
              
              {/* Edit Profile */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => setIsEditMode(true)}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="create-outline" size={20} color={Theme.colors.primary} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Edit Profile</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />

              {/* Notifications */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => navigation.navigate('Notifications')}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="notifications-outline" size={20} color={Theme.colors.primary} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Notifications</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              {/* Saved Careers */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => navigation.navigate('Saved')}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="bookmark-outline" size={20} color={Theme.colors.primary} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Saved Careers</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              {/* Privacy & Security */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => {
                  Alert.alert(
                    'Privacy & Security',
                    'Career Lanka secures your data using Supabase Authentication and RLS policy rules. Your data is protected and private.',
                    [{ text: 'Close', style: 'default' }]
                  );
                }}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={Theme.colors.primary} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Privacy & Security</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              {/* Help & Support */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => {
                  Alert.alert(
                    'Help & Support',
                    'Need assistance? Contact support at support@careerlanka.ai or check our guide in the Home tab.',
                    [{ text: 'Close', style: 'default' }]
                  );
                }}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="help-circle-outline" size={20} color={Theme.colors.primary} style={styles.menuIcon} />
                  <Text style={styles.menuText}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              {/* About */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => {
                  Alert.alert(
                    'About Career Lanka',
                    'Career Lanka AI v1.0.0\nAn AI-powered Career Guidance and CV builder system designed for Sri Lankan undergraduates.',
                    [{ text: 'Close', style: 'default' }]
                  );
                }}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="information-circle-outline" size={20} color={Theme.colors.primary} style={styles.menuIcon} />
                  <Text style={styles.menuText}>About</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              {/* Logout */}
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={handleLogout}
              >
                <View style={styles.menuRowLeft}>
                  <Ionicons name="log-out-outline" size={20} color={Theme.colors.error} style={styles.menuIcon} />
                  <Text style={[styles.menuText, { color: Theme.colors.error }]}>Logout</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
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
  topBrandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 12,
    backgroundColor: Theme.colors.background,
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
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconButton: {
    padding: 4,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
    gap: Theme.spacing.md,
  },
  viewContainer: {
    gap: Theme.spacing.md,
  },
  profileBanner: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    paddingVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Theme.colors.primary, // Green border
    ...Theme.shadows.small,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Theme.spacing.sm,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Theme.colors.primary,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1E293B',
    borderWidth: 3,
    borderColor: Theme.colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Theme.colors.primary, // Verification Green
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.card,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
  },
  profileTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  detailsRowContainer: {
    marginTop: Theme.spacing.md,
    gap: 8,
    alignSelf: 'stretch',
    paddingHorizontal: Theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailItemText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  pdfCtaBtn: {
    backgroundColor: Theme.colors.primary, // Active banner green
    borderRadius: Theme.roundness.medium,
    height: 44,
    paddingHorizontal: Theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.lg,
    width: '90%',
    ...Theme.shadows.small,
  },
  pdfCtaBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0A0B0D', // Dark text on green background
  },
  sectionCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  sectionCardLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.primary, // Labeled in small green caps text
    letterSpacing: 1,
    marginBottom: Theme.spacing.md,
  },
  sectionCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  uniContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uniIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: Theme.roundness.medium,
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  uniDetails: {
    flex: 1,
  },
  uniName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  uniFaculty: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  uniStatus: {
    fontSize: 11,
    color: Theme.colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  expertiseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  expertiseBadge: {
    backgroundColor: 'rgba(5, 196, 143, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.2)',
  },
  expertiseBadgeText: {
    fontSize: 10,
    color: Theme.colors.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Theme.spacing.md,
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
    fontWeight: '600',
  },
  timelineList: {
    marginTop: Theme.spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    width: 16,
  },
  timelineDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
    borderWidth: 2,
    borderColor: Theme.colors.card,
    zIndex: 2,
    marginTop: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.border,
    borderWidth: 2,
    borderColor: Theme.colors.card,
    zIndex: 2,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    backgroundColor: Theme.colors.border,
    flex: 1,
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: Theme.spacing.lg,
  },
  timelineMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineRole: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  timelineStatusTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  timelineDuration: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  timelineCompany: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
    marginBottom: 4,
  },
  timelineBullet: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
  },
  projectImageContainer: {
    position: 'relative',
    height: 150,
    borderRadius: Theme.roundness.medium,
    overflow: 'hidden',
    marginBottom: Theme.spacing.sm,
  },
  projectImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  projectImageTag: {
    position: 'absolute',
    bottom: Theme.spacing.sm,
    left: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Theme.roundness.small,
  },
  projectImageTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0A0B0D',
  },
  projectTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: Theme.spacing.md,
  },
  projectLinksRow: {
    flexDirection: 'row',
    gap: 16,
  },
  projectLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  projectLinkBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  academicHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  academicTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  academicPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  academicProgressRow: {
    flexDirection: 'row',
    height: 6,
    gap: 4,
    marginBottom: Theme.spacing.xs,
  },
  academicProgressSegment: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    borderRadius: 3,
  },
  academicProgressSegmentActive: {
    backgroundColor: 'rgba(5, 196, 143, 0.2)',
    position: 'relative',
  },
  academicProgressNode: {
    position: 'absolute',
    left: '75%', // Mock representing 94% overall completion (e.g. 75% through the final segment)
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.colors.primary,
    borderWidth: 2,
    borderColor: Theme.colors.card,
  },
  yearLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  yearLabel: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  yearLabelActive: {
    fontSize: 10,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  /* ================= EDIT MODE SPECIFIC ================= */
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: Theme.spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  inputContainer: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.roundness.small,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    height: 40,
    justifyContent: 'center',
  },
  input: {
    height: '100%',
    color: Theme.colors.text,
    fontSize: 14,
  },
  yearSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Theme.spacing.md,
  },
  yearOption: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: Theme.roundness.round,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  yearOptionSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  yearText: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  yearTextSelected: {
    color: '#0A0B0D',
  },
  saveBtn: {
    backgroundColor: Theme.colors.primary,
    height: 48,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  saveBtnText: {
    color: '#0A0B0D',
    fontWeight: 'bold',
    fontSize: 15,
  },
  smallLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 14,
    color: Theme.colors.text,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: 2,
  },
});
