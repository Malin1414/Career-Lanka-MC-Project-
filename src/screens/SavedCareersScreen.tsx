import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SavedCareer } from '../types';

export default function SavedCareersScreen({ navigation }: any) {
  const { savedCareers, deleteSavedCareer } = useAuth();
  const [list, setList] = useState<SavedCareer[]>([]);

  useEffect(() => {
    setList(savedCareers);
  }, [savedCareers]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remove Career',
      `Are you sure you want to remove "${name}" from your saved list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const { success } = await deleteSavedCareer(id);
            if (!success) {
              Alert.alert('Error', 'Failed to remove career.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Careers</Text>
        <Text style={styles.headerSubtitle}>Manage your saved career portfolios</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {list.length > 0 ? (
          <View style={styles.list}>
            {list.map((career) => (
              <View key={career.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.careerTitle}>{career.career_name}</Text>
                    <View style={styles.scoreBadge}>
                      <Text style={styles.scoreText}>{career.match_score}% Match</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(career.id, career.career_name)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.reasonText} numberOfLines={2}>
                  {career.reason}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.metaInfo}>
                    <Ionicons name="cash-outline" size={14} color={Theme.colors.textSecondary} />
                    <Text style={styles.metaText}>{career.salary_range}</Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() =>
                      navigation.navigate('CareerDetails', {
                        career,
                        isSaved: true,
                        savedId: career.id,
                      })
                    }
                  >
                    <Text style={styles.detailsText}>View Details</Text>
                    <Ionicons name="arrow-forward" size={14} color={Theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="bookmark-outline" size={48} color={Theme.colors.textSecondary} style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No saved careers yet</Text>
            <Text style={styles.emptySubtitle}>
              Take the Career Assessment to get AI recommendations and save your preferred paths here.
            </Text>
            <TouchableOpacity
              style={styles.browseBtn}
              onPress={() => navigation.navigate('Assessment')}
            >
              <Text style={styles.browseBtnText}>Take Assessment</Text>
            </TouchableOpacity>
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
    backgroundColor: Theme.colors.card,
    paddingHorizontal: Theme.spacing.lg,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 10 : 10,
    paddingBottom: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    flexGrow: 1,
    paddingBottom: 40,
  },
  list: {
    gap: 12,
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
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    gap: 4,
  },
  careerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  scoreBadge: {
    backgroundColor: 'rgba(91, 61, 245, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Theme.roundness.small,
    alignSelf: 'flex-start',
  },
  scoreText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  deleteBtn: {
    padding: Theme.spacing.xs,
  },
  reasonText: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: Theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingTop: Theme.spacing.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: 'bold',
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
    marginBottom: Theme.spacing.lg,
  },
  browseBtn: {
    backgroundColor: Theme.colors.primary,
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.roundness.medium,
    ...Theme.shadows.small,
  },
  browseBtnText: {
    color: Theme.colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
