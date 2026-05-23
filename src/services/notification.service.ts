import api from './http';
import type { Notification } from '../types/mockData';

export const notificationService = {
  /**
   * Obtiene todas las notificaciones del usuario autenticado
   */
  async fetchAll(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications');
    return data;
  },

  /**
   * Obtiene únicamente las notificaciones no leídas
   */
  async fetchUnread(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>('/notifications/unread');
    return data;
  },

  /**
   * Marca una notificación específica como leída
   * @param notificationId ID de la notificación
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const { data } = await api.patch<Notification>(`/notifications/${notificationId}/read`);
    return data;
  },

  /**
   * Marca todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<void> {
    await api.post('/notifications/read-all');
  },

  /**
   * Elimina una notificación
   * @param notificationId ID de la notificación a eliminar
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }
};
