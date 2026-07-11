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
  Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validateEmail = (emailStr: string) => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(emailStr.trim());
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) {
      Alert.alert('Required Fields', 'Please fill in both email and password.');
      return;
    }

    if (!validateEmail(cleanEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const { success, error } = await signIn(cleanEmail, password);
    setLoading(false);

    if (!success) {
      Alert.alert('Login Failed', error || 'Invalid email or password.');
    } else {
      // Fetch fresh session to get role
      const { user } = useAuth();
      if (user?.role === 'recruiter') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'RecruiterDashboard' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset instructions have been sent to your registered email (Simulated).');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Top Header Row */}
      <View style={styles.topBrandBar}>
        <Image source={require('../../assets/logo.png')} style={styles.smallLogo} resizeMode="contain" />
        <Text style={styles.brandText}>CareerLanka AI</Text>
      </View>
      <View style={styles.separator} />

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Welcome Text */}
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue your career evolution.</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Email Field */}
          <Text style={styles.label}>Email Address</Text>
          <View style={[
            styles.inputContainer,
            isEmailFocused && styles.inputContainerFocused
          ]}>
            <TextInput
              style={styles.input}
              placeholder="name@university.edu.lk"
              placeholderTextColor={Theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsEmailFocused(true)}
              onBlur={() => setIsEmailFocused(false)}
            />
            <Ionicons name="mail-outline" size={20} color={isEmailFocused ? Theme.colors.primary : Theme.colors.textSecondary} style={styles.inputIconRight} />
          </View>

          {/* Password Label Row */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordTextLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Password Field */}
          <View style={[
            styles.inputContainer,
            isPasswordFocused && styles.inputContainerFocused
          ]}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showPasswordButton}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#0A0B0D" />
            ) : (
              <Text style={styles.loginButtonText}>AUTHENTICATE SESSION</Text>
            )}
          </TouchableOpacity>


        </View>

        {/* Footer Link */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>New to the network?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Join the Pulse</Text>
          </TouchableOpacity>
        </View>

        {/* Mock Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>Demo Account: demo@student.lk / 123456</Text>
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
  topBrandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 12,
    gap: 8,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  smallLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    marginTop: Theme.spacing.md,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.text,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.large,
    padding: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    ...Theme.shadows.medium,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
  },
  forgotPasswordTextLink: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.primary,
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
  loginButton: {
    backgroundColor: Theme.colors.primary,
    height: 48,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
    ...Theme.shadows.small,
  },
  loginButtonText: {
    color: '#0A0B0D', // Dark text on green background
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.textSecondary,
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    height: 44,
    borderRadius: Theme.roundness.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    color: Theme.colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Theme.spacing.xl,
  },
  footerText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    marginRight: 6,
  },
  signupLink: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(5, 196, 143, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(5, 196, 143, 0.12)',
    borderRadius: Theme.roundness.small,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  infoBoxText: {
    fontSize: 12,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});
