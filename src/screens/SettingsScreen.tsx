import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Platform,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen({ navigation }: any) {
  const { signOut, clearAllData } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

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

  const handleResetData = () => {
    Alert.alert(
      'Reset App Data',
      'This will permanently delete all local mock profiles, assessments, saved careers, and generated CVs, restoring defaults. Do you wish to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            Alert.alert('Reset Complete', 'All local data has been cleared. Restoring defaults.', [
              { text: 'OK', onPress: () => navigation.popToTop() }
            ]);
          },
        },
      ]
    );
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Career Lanka values your privacy. In this prototype version, all your profile details, quiz assessment selections, and CV fields are stored strictly on-device using local AsyncStorage. No data is sent over the internet or shared with third-party service providers.',
      [{ text: 'Close', style: 'default' }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      'About Career Lanka',
      'Version 1.0.0\n\nAI-powered Career Guidance and CV Builder platform designed specifically for Sri Lankan undergraduate students. Built as a high-fidelity local UI/UX prototype.',
      [{ text: 'OK', style: 'default' }]
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
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Section: Preferences */}
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="moon-outline" size={22} color={Theme.colors.text} style={styles.rowIcon} />
              <Text style={styles.rowText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(val) => {
                setDarkMode(val);
                if (val) {
                  Alert.alert('Theme Lock', 'Career Lanka uses a modern Light/Violet theme optimized for student portfolios. Dark Mode is currently locked.');
                  setDarkMode(false);
                }
              }}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={Platform.OS === 'android' ? Theme.colors.white : undefined}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="notifications-outline" size={22} color={Theme.colors.text} style={styles.rowIcon} />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Theme.colors.border, true: Theme.colors.primary }}
              thumbColor={Platform.OS === 'android' ? Theme.colors.white : undefined}
            />
          </View>
        </View>

        {/* Section: Support */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowBtn} onPress={showPrivacyPolicy}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Theme.colors.text} style={styles.rowIcon} />
              <Text style={styles.rowText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.rowBtn} onPress={showAbout}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle-outline" size={22} color={Theme.colors.text} style={styles.rowIcon} />
              <Text style={styles.rowText}>About App</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Section: Account Actions */}
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowBtn} onPress={handleResetData}>
            <View style={styles.rowLeft}>
              <Ionicons name="refresh-circle-outline" size={22} color={Theme.colors.error} style={styles.rowIcon} />
              <Text style={[styles.rowText, { color: Theme.colors.error }]}>Reset Mock App Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={Theme.colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Career Lanka © 2026</Text>
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
  container: {
    padding: Theme.spacing.lg,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginTop: Theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    overflow: 'hidden',
    ...Theme.shadows.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  rowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    marginRight: Theme.spacing.md,
  },
  rowText: {
    fontSize: 15,
    color: Theme.colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginHorizontal: Theme.spacing.md,
  },
  logoutBtn: {
    backgroundColor: Theme.colors.error,
    height: 48,
    borderRadius: Theme.roundness.medium,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: Theme.spacing.xl,
    ...Theme.shadows.small,
  },
  logoutBtnText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.xl,
  },
});
