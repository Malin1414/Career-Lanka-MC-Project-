import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Theme } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, AppNotification } from '../context/NotificationContext';

export default function NotificationsScreen({ navigation }: any) {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleNotificationPress = (notification: AppNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const handleDelete = (id: string) => {
    deleteNotification(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.some(n => !n.read) && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.separator} />

      {notifications.length === 0 ? (
        /* Empty State */
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconWrapper}>
            <Ionicons name="notifications-off-outline" size={48} color={Theme.colors.textSecondary} />
          </View>
          <Text style={styles.emptyStateTitle}>No notifications yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            Career updates and important announcements will appear here.
          </Text>
        </View>
      ) : (
        /* Notification List */
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.notificationCard, !item.read && styles.notificationCardUnread]}
              onPress={() => handleNotificationPress(item)}
              activeOpacity={0.8}
            >
              {/* Unread indicator dot */}
              {!item.read && <View style={styles.unreadDot} />}
              
              <View style={styles.iconWrapper}>
                <Ionicons
                  name={item.read ? "notifications-outline" : "notifications-sharp"}
                  size={20}
                  color={item.read ? Theme.colors.textSecondary : Theme.colors.primary}
                />
              </View>

              <View style={styles.detailsContainer}>
                <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>
                  {item.title}
                </Text>
                <Text style={styles.notificationDesc}>{item.description}</Text>
                <Text style={styles.notificationTime}>{item.timestamp}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.deleteBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={18} color={Theme.colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 12,
    paddingBottom: 12,
    backgroundColor: Theme.colors.background,
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
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: Theme.colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: Theme.colors.border,
  },
  scrollContainer: {
    padding: Theme.spacing.lg,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.roundness.medium,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  notificationCardUnread: {
    borderColor: 'rgba(5, 196, 143, 0.3)',
  },
  unreadDot: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    marginLeft: 4,
  },
  detailsContainer: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    marginBottom: 4,
  },
  notificationTitleUnread: {
    fontWeight: 'bold',
    color: Theme.colors.text,
  },
  notificationDesc: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: Theme.colors.textSecondary,
  },
  deleteBtn: {
    padding: Theme.spacing.xs,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
