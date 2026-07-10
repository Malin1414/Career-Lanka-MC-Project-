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
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CVData } from '../types';

const TABS = ['Personal', 'Education', 'Experience', 'Projects', 'Skills & Add'];

export default function CVInformationFormScreen({ navigation }: any) {
  const { cvData, saveCV } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState(0);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [address, setAddress] = useState('');
  const [summary, setSummary] = useState('');

  // Education (single item for prototype simplicity, expandable)
  const [eduInstitution, setEduInstitution] = useState('');
  const [eduDegree, setEduDegree] = useState('');
  const [eduPeriod, setEduPeriod] = useState('');
  const [eduGpa, setEduGpa] = useState('');
  const [eduAchievements, setEduAchievements] = useState('');

  // Experience (single item for simplicity)
  const [expCompany, setExpCompany] = useState('');
  const [expRole, setExpRole] = useState('');
  const [expPeriod, setExpPeriod] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Project (single item)
  const [projName, setProjName] = useState('');
  const [projRole, setProjRole] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projLink, setProjLink] = useState('');

  // Skills & Languages, Certifications, References
  const [skillsText, setSkillsText] = useState('');
  const [languagesText, setLanguagesText] = useState('');
  const [certsText, setCertsText] = useState('');
  const [achieveText, setAchieveText] = useState('');
  const [references, setReferences] = useState('');

  // Pre-populate fields on mount
  useEffect(() => {
    if (cvData) {
      setFullName(cvData.fullName || '');
      setTitle(cvData.title || '');
      setEmail(cvData.email || '');
      setPhone(cvData.phone || '');
      setGithub(cvData.github || '');
      setLinkedin(cvData.linkedin || '');
      setAddress(cvData.address || '');
      setSummary(cvData.summary || '');

      if (cvData.education && cvData.education.length > 0) {
        setEduInstitution(cvData.education[0].institution || '');
        setEduDegree(cvData.education[0].degree || '');
        setEduPeriod(cvData.education[0].period || '');
        setEduGpa(cvData.education[0].gpa || '');
        setEduAchievements(cvData.education[0].achievements || '');
      }

      if (cvData.experience && cvData.experience.length > 0) {
        setExpCompany(cvData.experience[0].company || '');
        setExpRole(cvData.experience[0].role || '');
        setExpPeriod(cvData.experience[0].period || '');
        setExpDesc(cvData.experience[0].description || '');
      }

      if (cvData.projects && cvData.projects.length > 0) {
        setProjName(cvData.projects[0].name || '');
        setProjRole(cvData.projects[0].role || '');
        setProjDesc(cvData.projects[0].description || '');
        setProjTech(cvData.projects[0].techStack || '');
        setProjLink(cvData.projects[0].link || '');
      }

      setSkillsText(cvData.skills ? cvData.skills.join(', ') : '');
      setLanguagesText(cvData.languages ? cvData.languages.join(', ') : '');
      setCertsText(cvData.certifications ? cvData.certifications.join(', ') : '');
      setAchieveText(cvData.achievements ? cvData.achievements.join(', ') : '');
      setReferences(cvData.references || '');
    }
  }, [cvData]);

  const handleNextSection = () => {
    if (activeTab < 4) {
      setActiveTab(activeTab + 1);
    } else {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Required Fields', 'Name and Email are mandatory fields.');
      return;
    }

    const skillsArray = skillsText.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const langArray = languagesText.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const certArray = certsText.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const achieveArray = achieveText.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

    const updatedCVPayload: CVData = {
      fullName: fullName.trim(),
      title: title.trim() || 'Software Engineering Student',
      email: email.trim(),
      phone: phone.trim(),
      github: github.trim(),
      linkedin: linkedin.trim(),
      address: address.trim(),
      summary: summary.trim(),
      education: [
        {
          id: 'edu-main',
          institution: eduInstitution.trim(),
          degree: eduDegree.trim(),
          period: eduPeriod.trim(),
          gpa: eduGpa.trim(),
          achievements: eduAchievements.trim(),
        }
      ],
      experience: expCompany.trim() ? [
        {
          id: 'exp-main',
          company: expCompany.trim(),
          role: expRole.trim(),
          period: expPeriod.trim(),
          description: expDesc.trim(),
        }
      ] : [],
      projects: projName.trim() ? [
        {
          id: 'proj-main',
          name: projName.trim(),
          role: projRole.trim(),
          description: projDesc.trim(),
          techStack: projTech.trim(),
          link: projLink.trim(),
        }
      ] : [],
      skills: skillsArray,
      languages: langArray,
      certifications: certArray,
      achievements: achieveArray,
      references: references.trim(),
    };

    const { success } = await saveCV(updatedCVPayload);

    if (success) {
      navigation.navigate('ResumeGenerationLoading');
    } else {
      Alert.alert('Error', 'Failed to save CV data locally.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>CV Information Form</Text>
        </View>

        {/* Tab Sliding Bar */}
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {TABS.map((tab, idx) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabItem, activeTab === idx && styles.tabItemActive]}
                onPress={() => setActiveTab(idx)}
              >
                <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Form Container */}
        <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
          
          {/* TAB 0: PERSONAL */}
          {activeTab === 0 && (
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Personal Details</Text>
              
              <Text style={styles.label}>Full Name *</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Saman Perera" />

              <Text style={styles.label}>Job Title / Headline</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Full Stack Developer" />

              <Text style={styles.label}>Email Address *</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="saman.p@careerlanka.ai" />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+94 77 123 4567" />

              <Text style={styles.label}>GitHub URL</Text>
              <TextInput style={styles.input} value={github} onChangeText={setGithub} autoCapitalize="none" placeholder="github.com/samanp" />

              <Text style={styles.label}>LinkedIn URL</Text>
              <TextInput style={styles.input} value={linkedin} onChangeText={setLinkedin} autoCapitalize="none" placeholder="linkedin.com/in/samanperera" />

              <Text style={styles.label}>City / Address</Text>
              <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Colombo, Sri Lanka" />

              <Text style={styles.label}>Professional Summary</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={summary} 
                onChangeText={setSummary} 
                multiline 
                numberOfLines={4} 
                placeholder="High-achieving computer science student..." 
              />
            </View>
          )}

          {/* TAB 1: EDUCATION */}
          {activeTab === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Education Details</Text>
              
              <Text style={styles.label}>University / School Name</Text>
              <TextInput style={styles.input} value={eduInstitution} onChangeText={setEduInstitution} placeholder="University of Colombo" />

              <Text style={styles.label}>Degree / Program</Text>
              <TextInput style={styles.input} value={eduDegree} onChangeText={setEduDegree} placeholder="BSc Hons in Computer Science" />

              <Text style={styles.label}>Period / Years</Text>
              <TextInput style={styles.input} value={eduPeriod} onChangeText={setEduPeriod} placeholder="2022 - Present" />

              <Text style={styles.label}>GPA / Grade</Text>
              <TextInput style={styles.input} value={eduGpa} onChangeText={setEduGpa} placeholder="3.85 / 4.00" />

              <Text style={styles.label}>Key Academic Achievements</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={eduAchievements} 
                onChangeText={setEduAchievements} 
                multiline 
                numberOfLines={3} 
                placeholder="Dean's List (2022-2024)" 
              />
            </View>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Experience (Last Employment)</Text>
              
              <Text style={styles.label}>Company / Entity Name</Text>
              <TextInput style={styles.input} value={expCompany} onChangeText={setExpCompany} placeholder="Global Tech Solutions" />

              <Text style={styles.label}>Role / Job Title</Text>
              <TextInput style={styles.input} value={expRole} onChangeText={setExpRole} placeholder="Software Engineering Intern" />

              <Text style={styles.label}>Period</Text>
              <TextInput style={styles.input} value={expPeriod} onChangeText={setExpPeriod} placeholder="Mar 2024 - Oct 2024" />

              <Text style={styles.label}>Responsibilities (Use bullet points)</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={expDesc} 
                onChangeText={setExpDesc} 
                multiline 
                numberOfLines={5} 
                placeholder="• Contributed to codebases...&#10;• Optimized API latency by 15%..." 
              />
            </View>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 3 && (
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Featured Project</Text>
              
              <Text style={styles.label}>Project Name</Text>
              <TextInput style={styles.input} value={projName} onChangeText={setProjName} placeholder="AI-Driven Job Matcher" />

              <Text style={styles.label}>Your Role</Text>
              <TextInput style={styles.input} value={projRole} onChangeText={setProjRole} placeholder="Lead Developer" />

              <Text style={styles.label}>Technologies Used</Text>
              <TextInput style={styles.input} value={projTech} onChangeText={setProjTech} placeholder="React Native, Python, FastAPI" />

              <Text style={styles.label}>Project Link (e.g. GitHub)</Text>
              <TextInput style={styles.input} value={projLink} onChangeText={setProjLink} autoCapitalize="none" placeholder="github.com/samanp/matcher" />

              <Text style={styles.label}>Description</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={projDesc} 
                onChangeText={setProjDesc} 
                multiline 
                numberOfLines={4} 
                placeholder="A predictive analytics tool mapping student skills..." 
              />
            </View>
          )}

          {/* TAB 4: SKILLS & ADD */}
          {activeTab === 4 && (
            <View style={styles.formSection}>
              <Text style={styles.formSectionTitle}>Skills & Additional Details</Text>
              
              <Text style={styles.label}>Technical Skills (Comma separated)</Text>
              <TextInput style={styles.input} value={skillsText} onChangeText={setSkillsText} placeholder="Python, JavaScript, AWS Cloud, Docker" />

              <Text style={styles.label}>Languages (Comma separated)</Text>
              <TextInput style={styles.input} value={languagesText} onChangeText={setLanguagesText} placeholder="English (Professional), Sinhala (Native)" />

              <Text style={styles.label}>Certifications (Comma separated)</Text>
              <TextInput style={styles.input} value={certsText} onChangeText={setCertsText} placeholder="AWS Developer Associate, Certified ScrumMaster" />

              <Text style={styles.label}>Key Achievements (Comma separated)</Text>
              <TextInput style={styles.input} value={achieveText} onChangeText={setAchieveText} placeholder="1st Place Inter-University Hackathon" />

              <Text style={styles.label}>References</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={references} 
                onChangeText={setReferences} 
                multiline 
                numberOfLines={3} 
                placeholder="Dr. K. Wickramasinghe, Senior Lecturer (k.wick@ucsc.cmb.ac.lk)" 
              />
            </View>
          )}

        </ScrollView>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          {activeTab > 0 ? (
            <TouchableOpacity 
              style={[styles.navBtn, styles.navBtnSecondary]}
              onPress={() => setActiveTab(activeTab - 1)}
            >
              <Text style={styles.navBtnTextSecondary}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.navBtn, styles.navBtnSecondary]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.navBtnTextSecondary}>Cancel</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.navBtn, styles.navBtnPrimary]}
            onPress={handleNextSection}
          >
            <Text style={styles.navBtnTextPrimary}>
              {activeTab === 4 ? 'Generate Resume' : 'Next Section'}
            </Text>
            <Ionicons 
              name={activeTab === 4 ? 'sparkles' : 'arrow-forward'} 
              size={16} 
              color={Theme.colors.white} 
              style={{ marginLeft: 6 }} 
            />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
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
  },
  backBtn: {
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  tabBar: {
    backgroundColor: Theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingVertical: Theme.spacing.xs,
  },
  tabScroll: {
    paddingHorizontal: Theme.spacing.lg,
    gap: 8,
  },
  tabItem: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 6,
    borderRadius: Theme.roundness.round,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  tabItemActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Theme.colors.white,
  },
  formContainer: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
  },
  formSection: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.small,
    gap: Theme.spacing.xs,
  },
  formSectionTitle: {
    fontSize: 15,
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
    marginTop: Theme.spacing.sm,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.roundness.small,
    height: 40,
    paddingHorizontal: Theme.spacing.md,
    color: Theme.colors.text,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingVertical: Theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    gap: 12,
  },
  navBtn: {
    flex: 1,
    height: 44,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navBtnPrimary: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.small,
  },
  navBtnSecondary: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  navBtnTextPrimary: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  navBtnTextSecondary: {
    color: Theme.colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
