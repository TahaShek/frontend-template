// Notification Store using Zustand
import { create } from "zustand";
import type { Notification, NotificationState } from "../types/notification.types";

interface NotificationStore extends NotificationState {
  // Actions
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  setNotifications: (notifications: Notification[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  addNotification: (notification) =>
    set((state) => {
      // Prevent duplicates
      if (state.notifications.some((n) => n.id === notification.id)) {
        return state;
      }

      const newNotifications = [notification, ...state.notifications];
      const unreadCount = newNotifications.filter((n) => !n.read).length;

      // Show browser notification
      if (Notification.permission === "granted" && !notification.read) {
        new Notification(notification.title, {
          body: notification.message,
          icon: notification.metadata?.image || "/vite.svg",
          tag: notification.id,
        });
      }

      return {
        notifications: newNotifications,
        unreadCount,
      };
    }),

  markAsRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  deleteNotification: (id) =>
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    }),

  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),

  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),
}));

