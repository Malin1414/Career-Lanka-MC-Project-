import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = '@careerlanka_notifications';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'New AI career recommendations are available',
    description: 'Your latest assessment has been analyzed by CareerLanka AI. Check out your updated matches.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'Complete your profile to improve recommendations',
    description: 'Add your technical skills and academic background to receive highly accurate matching career paths.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    title: 'New learning resources have been added',
    description: 'Explore new AWS and Professional Communication certification modules curated for you.',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '4',
    title: 'Your saved career roadmap has been updated',
    description: 'Tech market trends indicate a +24% YoY growth in Software Engineering roles in Colombo.',
    timestamp: '3 days ago',
    read: true,
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        setNotifications(DEFAULT_NOTIFICATIONS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      }
    } catch (e) {
      console.error('Failed to load notifications', e);
      setNotifications(DEFAULT_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async (updated: AppNotification[]) => {
    try {
      setNotifications(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save notifications', e);
    }
  };

  const markAsRead = async (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    await saveNotifications(updated);
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    await saveNotifications(updated);
  };

  const deleteNotification = async (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    await saveNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
