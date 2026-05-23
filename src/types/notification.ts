//Notificaciones dentro de la app 
export type NotificationVariant = 'info' | 'success' | 'warning' | 'error' | 'match' | 'parche' | 'message';

export interface InAppNotificationPayload {
  title: string;
  message: string;
  variant?: NotificationVariant;
  duration?: number;
  avatar?: string;
  actionRoute?: string;
}

export interface InAppNotification extends Required<Pick<InAppNotificationPayload, 'title' | 'message'>> {
  id: string;
  variant: NotificationVariant;
  duration: number;
  avatar?: string;
  actionRoute?: string;
  createdAt: number;
}
