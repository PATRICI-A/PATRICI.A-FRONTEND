import axios from 'axios';

const BASE_URL = '/svc/notifications';

const notificationsApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

notificationsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiNotification {
  id: string;
  userId: string;
  type: string;
  channel: string;
  title: string;
  body: string;
  read: boolean;
  referenceId?: string;
  createdAt: string;
}

export interface NotificationPreferences {
  connectionRequest?: boolean;
  parcheMessage?: boolean;
  eventReminder?: boolean;
  nearbyParche?: boolean;
  achievementUnlocked?: boolean;
  otpVerification?: boolean;
  passwordReset?: boolean;
  invitationAccepted?: boolean;
  invitationSent?: boolean;
  memberJoined?: boolean;
  matchReceived?: boolean;
  matchResponse?: boolean;
  friendshipCreated?: boolean;
  chatMessage?: boolean;
  eventChange?: boolean;
  invitationRejected?: boolean;
  parcheDissolved?: boolean;
  memberLeft?: boolean;
  reportReady?: boolean;
}

// Maps backend notification types to frontend category types
export type FrontendNotifType = 'chat' | 'match' | 'high_match' | 'event' | 'parche_invitation' | 'event_reminder';

const TYPE_MAP: Record<string, FrontendNotifType> = {
  chatMessage: 'chat',
  parcheMessage: 'chat',
  matchReceived: 'match',
  matchResponse: 'match',
  friendshipCreated: 'high_match',
  connectionRequest: 'match',
  eventReminder: 'event_reminder',
  eventChange: 'event',
  invitationAccepted: 'parche_invitation',
  invitationSent: 'parche_invitation',
  invitationRejected: 'parche_invitation',
  memberJoined: 'parche_invitation',
  memberLeft: 'parche_invitation',
  parcheDissolved: 'parche_invitation',
  nearbyParche: 'parche_invitation',
  achievementUnlocked: 'high_match',
  reportReady: 'event',
};

const COLOR_MAP: Record<FrontendNotifType, string> = {
  chat: '#3B82F6',
  match: '#EC4899',
  high_match: '#F59E0B',
  event: '#F59E0B',
  event_reminder: '#F59E0B',
  parche_invitation: '#8B5CF6',
};

const ACTION_URL_MAP: Record<FrontendNotifType, string> = {
  chat: '/chat',
  match: '/matches',
  high_match: '/matches',
  event: '/events',
  event_reminder: '/events',
  parche_invitation: '/parches',
};

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
}

export function mapApiNotification(n: ApiNotification) {
  const type: FrontendNotifType = TYPE_MAP[n.type] ?? 'event';
  return {
    id: n.id,
    type,
    title: n.title,
    message: n.body,
    timestamp: formatRelativeTime(n.createdAt),
    read: n.read,
    color: COLOR_MAP[type],
    actionUrl: ACTION_URL_MAP[type],
    avatar: undefined,
    icon: undefined,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const notificationsService = {
  async getNotifications(): Promise<ApiNotification[]> {
    try {
      const { data } = await notificationsApi.get<any>('/api/notifications');
      if (Array.isArray(data)) return data;
      return data?.content ?? data?.notifications ?? data?.data ?? [];
    } catch {
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await notificationsApi.put(`/api/notifications/${notificationId}/read`);
    } catch { /* ignore */ }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await notificationsApi.put('/api/notifications/read');
    } catch { /* ignore */ }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const { data } = await notificationsApi.get<{ count: number }>('/api/notifications/unread/count');
      return data.count ?? 0;
    } catch {
      return 0;
    }
  },

  async deleteAllNotifications(): Promise<void> {
    try {
      const userId = localStorage.getItem('patricia_user_id');
      if (!userId) return;
      await notificationsApi.delete(`/api/notifications/users/${userId}/cleanup`);
    } catch { /* ignore */ }
  },

  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const { data } = await notificationsApi.get<NotificationPreferences>('/api/notifications/preferences');
      return data;
    } catch {
      return {};
    }
  },

  async updatePreference(type: string, enabled: boolean): Promise<NotificationPreferences> {
    try {
      const { data } = await notificationsApi.put<NotificationPreferences>(
        '/api/notifications/preferences',
        { type, enabled },
      );
      return data;
    } catch {
      return {};
    }
  },

  async createEventReminder(eventId: string, eventDate: string): Promise<void> {
    try {
      const userId = localStorage.getItem('patricia_user_id');
      if (!userId) return;
      await notificationsApi.post('/api/event-reminders', { userId, eventId, eventDate });
    } catch { /* ignore */ }
  },
};
