import { useContext } from 'react';
import {
  NotificationContext,
  type NotificationContextType,
} from '../store/NotificationContext';


export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      'useNotifications must be used within a <NotificationProvider>',
    );
  }
  return ctx;
}
