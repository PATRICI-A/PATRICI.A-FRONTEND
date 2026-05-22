import api from './http';
import type { InAppNotificationPayload } from '../types/notification';


export const notificationService = {
  async fetchUnread(): Promise<InAppNotificationPayload[]> {

    return [];
  },
  async markAsRead(notificationId: string): Promise<void> {

    void notificationId;
  },
  async markAllAsRead(): Promise<void> {

  },
};
