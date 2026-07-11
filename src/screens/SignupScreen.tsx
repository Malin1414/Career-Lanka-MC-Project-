import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type SignupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;

interface Props {
  navigation: SignupScreenNavigationProp;
}

const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', 'Finalist'];

export default function SignupScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  
  // Field States
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [faculty, setFaculty] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [district, setDistrict] = useState('');
  const [role, setRole] = useState<'student' | 'recruiter'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Focus States
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateEmail = (emailStr: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(emailStr.trim());
  };

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !university.trim() ||
      !faculty.trim() ||
      !degreeProgram.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Missing Info', 'Please fill in all the required fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    const profileData = {
      full_name: fullName.trim(),
      university: university.trim(),
      faculty: faculty.trim(),
      degree_program: degreeProgram.trim(),
      academic_year: academicYear,
      district: district.trim() || 'Colombo',
      skills: role === 'student' ? ['Python', 'JavaScript', 'SQL'] : [],
      interests: role === 'student' ? ['Software Development'] : [],
    };

    const { success, error } = await signUp(email.trim(), password, profileData, role);
    setLoading(false);

    if (!success) {
      Alert.alert('Registration Failed', error || 'Failed to register account.');
    } else {
      Alert.alert(
        'Registration Success',
        'Your profile has been created successfully! You can now log in using your registered credentials.',
        [{ text: 'Login Now', onPress: () => navigation.navigate('Login') }]
      );
    }
  };

  const getInputStyle = (fieldName: string) => [
    styles.inputContainer,
    focusedField === fieldName && styles.inputContainerFocused
  ];

  const getIconColor = (fieldName: string) => {
    return focusedField === fieldName ? Theme.colors.primary : Theme.colors.textSecondary;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Join the Pulse</Text>
          <Text style={styles.subtitle}>Begin your career guide with Career Lanka</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>User Role</Text>
          <View style={styles.roleSelectorContainer}>
            <TouchableOpacity
              style={[styles.roleOption, role === 'student' && styles.roleOptionSelected]}
              onPress={() => setRole('student')}
            >
              <Ionicons name="school-outline" size={20} color={role === 'student' ? '#0A0B0D' : Theme.colors.textSecondary} />
              <Text style={[styles.roleOptionText, role === 'student' && styles.roleOptionTextSelected]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, role === 'recruiter' && styles.roleOptionSelected]}
              onPress={() => setRole('recruiter')}
            >
              <Ionicons name="briefcase-outline" size={20} color={role === 'recruiter' ? '#0A0B0D' : Theme.colors.textSecondary} />
              <Text style={[styles.roleOptionText, role === 'recruiter' && styles.roleOptionTextSelected]}>Recruiter</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            {role === 'student' ? 'Academic Information' : 'Professional Information'}
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Name *</Text>
          <View style={getInputStyle('fullName')}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Kasun Perera"
              placeholderTextColor={Theme.colors.textSecondary}
              value={fullName}
              onChangeText={setFullName}
              onFocus={() => setFocusedField('fullName')}
              onBlur={() => setFocusedField(null)}
            />
            <Ionicons name="person-outline" size={20} color={getIconColor('fullName')} style={styles.inputIconRight} />
          </View>

          {/* University */}
          <Text style={styles.label}>{role === 'student' ? 'University *' : 'Company *'}</Text>
          <View style={getInputStyle('university')}>
            <TextInput
              style={styles.input}
              placeholder={role === 'student' ? "e.g. University of Colombo" : "e.g. Acme Corp"}
              placeholderTextColor={Theme.colors.textSecondary}
              value={university}
              onChangeText={setUniversity}
              onFocus={() => setFocusedField('university')}
              onBlur={() => setFocusedField(null)}
            />
            <Ionicons name={role === 'student' ? "business-outline" : "briefcase-outline"} size={20} color={getIconColor('university')} style={styles.inputIconRight} />
          </View>

          {role === 'student' && (
            <>
              {/* Faculty */}
              <Text style={styles.label}>Faculty *</Text>
              <View style={getInputStyle('faculty')}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. School of Computing"
                  placeholderTextColor={Theme.colors.textSecondary}
                  value={faculty}
                  onChangeText={setFaculty}
                  onFocus={() => setFocusedField('faculty')}
                  onBlur={() => setFocusedField(null)}
                />
                <Ionicons name="school-outline" size={20} color={getIconColor('faculty')} style={styles.inputIconRight} />
              </View>

              {/* Degree Program */}
              <Text style={styles.label}>Degree Program *</Text>
              <View style={getInputStyle('degreeProgram')}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. BSc Hons in Computer Science"
                  placeholderTextColor={Theme.colors.textSecondary}
                  value={degreeProgram}
                  onChangeText={setDegreeProgram}
                  onFocus={() => setFocusedField('degreeProgram')}
                  onBlur={() => setFocusedField(null)}
                />
                <Ionicons name="ribbon-outline" size={20} color={getIconColor('degreeProgram')} style={styles.inputIconRight} />
              </View>
            </>
          )}

          {role === 'recruiter' && (
            <>
              {/* Designation */}
              <Text style={styles.label}>Designation *</Text>
              <View style={getInputStyle('faculty')}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. HR Manager"
                  placeholderTextColor={Theme.colors.textSecondary}
                  value={faculty}
                  onChangeText={setFaculty}
                  onFocus={() => setFocusedField('faculty')}
                  onBlur={() => setFocusedField(null)}
                />
                <Ionicons name="person-circle-outline" size={20} color={getIconColor('faculty')} style={styles.inputIconRight} />
              </View>
            </>
          )}

          {/* District */}
          <Text style={styles.label}>District of Residence</Text>
          <View style={getInputStyle('district')}>
            <TextInput
              style={styles.input}
              placeholder="e.g. Colombo, Gampaha, Kandy"
              placeholderTextColor={Theme.colors.textSecondary}
              value={district}
              onChangeText={setDistrict}
              onFocus={() => setFocusedField('district')}
              onBlur={() => setFocusedField(null)}
            />
            <Ionicons name="location-outline" size={20} color={getIconColor('district')} style={styles.inputIconRight} />
          </View>

          {/* Academic Year */}
          {role === 'student' && (
            <>
              <Text style={styles.label}>Academic Year *</Text>
              <View style={styles.yearSelectorContainer}>
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
                        styles.yearOptionText,
                        academicYear === year && styles.yearOptionTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { marginTop: Theme.spacing.md }]}>Account Credentials</Text>

          {/* Email */}
          <Text style={styles.label}>Email Address *</Text>
          <View style={getInputStyle('email')}>
            <TextInput
              style={styles.input}
              placeholder="e.g. kasun@student.lk"
              placeholderTextColor={Theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
            <Ionicons name="mail-outline" size={20} color={getIconColor('email')} style={styles.inputIconRight} />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password *</Text>
          <View style={getInputStyle('password')}>
            <TextInput
              style={styles.input}
              placeholder="Min 6 characters"
              placeholderTextColor={Theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password *</Text>
          <View style={getInputStyle('confirmPassword')}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Theme.colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
            />
            <Ionicons name="lock-closed-outline" size={20} color={getIconColor('confirmPassword')} style={styles.inputIconRight} />
          </View>

          {/* Register Button */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#0A0B0D" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: Theme.spacing.lg,
  },
  headerContainer: {
    marginBottom: Theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
  },
  backButton: {
    marginBottom: Theme.spacing.md,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.lg,
    ...Theme.shadows.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    paddingBottom: Theme.spacing.xs,
  },
  roleSelectorContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Theme.spacing.lg,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 44,
    borderRadius: Theme.roundness.medium,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  roleOptionSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
  },
  roleOptionTextSelected: {
    color: '#0A0B0D',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    borderRadius: Theme.roundness.medium,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    height: 48,
  },
  inputContainerFocused: {
    borderColor: Theme.colors.primary,
    borderWidth: 1.2,
  },
  inputIconRight: {
    marginLeft: Theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Theme.colors.text,
    fontSize: 14,
  },
  showPasswordButton: {
    padding: Theme.spacing.xs,
  },
  yearSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.md,
    gap: 8,
  },
  yearOption: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.roundness.round,
    backgroundColor: Theme.colors.background,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  yearOptionSelected: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  yearOptionText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
  },
  yearOptionTextSelected: {
    color: '#0A0B0D', // Dark text on green background
  },
  registerButton: {
    backgroundColor: Theme.colors.primary,
    height: 48,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  registerButtonText: {
    color: '#0A0B0D',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  footerText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    marginRight: 6,
  },
  loginLink: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
