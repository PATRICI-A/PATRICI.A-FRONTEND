import { createContext, useCallback, useState, type ReactNode } from 'react';
import type {
  InAppNotification,
  InAppNotificationPayload,
} from '../types/notification';

const DEFAULT_DURATION_MS = 5_000;
const MAX_VISIBLE = 5;

export interface NotificationContextType {

  notifications: InAppNotification[];
  push: (payload: InAppNotificationPayload) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const push = useCallback((payload: InAppNotificationPayload) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const duration = payload.duration ?? DEFAULT_DURATION_MS;

    const notification: InAppNotification = {
      id,
      title: payload.title,
      message: payload.message,
      variant: payload.variant ?? 'info',
      duration,
      avatar: payload.avatar,
      actionRoute: payload.actionRoute,
      createdAt: Date.now(),
    };

    setNotifications(prev => [notification, ...prev].slice(0, MAX_VISIBLE));

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, push, dismiss, dismissAll }}>
      {children}
    </NotificationContext.Provider>
  );
}
