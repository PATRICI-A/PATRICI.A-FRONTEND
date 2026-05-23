import axios from 'axios';

const BASE_URL = '/svc/events';

const eventsApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

eventsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  const userId = localStorage.getItem('patricia_user_id');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (userId) {
    config.headers['X-User-Id'] = userId;
    config.headers['X-User-Role'] = 'ESTUDIANTE';
  }
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type EventCategory = 'ACADEMIC' | 'CULTURAL' | 'SPORTS' | 'WELLNESS';
export type EventType = 'OPEN' | 'WITH_CAPACITY';
export type EventStatus = 'ACTIVE' | 'CANCELLED' | 'FINISHED';
export type RsvpAction = 'CONFIRM' | 'CANCEL';
export type RsvpStatus = 'CONFIRMED' | 'CANCELLED';

export interface ApiEvent {
  id: string;
  name: string;
  description?: string;
  dateTime: string;
  startTime: string;
  duration?: number;
  durationMinutes?: number;
  location: string;
  category: EventCategory;
  type: EventType;
  maxCapacity?: number;
  availableCapacity?: number;
  status: EventStatus;
  qrCode?: string;
}

export interface RsvpResponse {
  id: string;
  eventId: string;
  studentId: string;
  status: RsvpStatus;
}

export interface EventCreateRequest {
  name: string;
  description?: string;
  dateTime: string;
  startTime: string;
  duration: number;
  location: string;
  category: EventCategory;
  type: EventType;
  maxCapacity?: number;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const eventsService = {
  async getEvents(filters?: { category?: EventCategory; date?: string }): Promise<ApiEvent[]> {
    try {
      const { data } = await eventsApi.get<any>('/events', { params: filters });
      if (Array.isArray(data)) return data;
      return data?.content ?? data?.events ?? data?.data ?? [];
    } catch {
      return [];
    }
  },

  async getEventById(eventId: string): Promise<ApiEvent | null> {
    try {
      const { data } = await eventsApi.get<ApiEvent>(`/events/${eventId}`);
      return data;
    } catch {
      return null;
    }
  },

  async rsvpEvent(eventId: string, action: RsvpAction): Promise<RsvpResponse | null> {
    try {
      const userId = localStorage.getItem('patricia_user_id') ?? '';
      const { data } = await eventsApi.post<RsvpResponse>(
        `/events/${eventId}/rsvp`,
        null,
        { params: { action }, headers: { 'X-User-Id': userId } },
      );
      return data;
    } catch {
      return null;
    }
  },

  async getMyAgenda(): Promise<ApiEvent[]> {
    try {
      const { data } = await eventsApi.get<any>('/events/rsvp/agenda');
      if (Array.isArray(data)) return data;
      return data?.content ?? data?.events ?? data?.data ?? [];
    } catch {
      return [];
    }
  },

  async createEvent(payload: EventCreateRequest): Promise<ApiEvent | null> {
    try {
      const { data } = await eventsApi.post<ApiEvent>('/events', payload);
      return data;
    } catch {
      return null;
    }
  },

  async cancelEvent(eventId: string): Promise<boolean> {
    try {
      await eventsApi.patch(`/events/${eventId}`);
      return true;
    } catch {
      return false;
    }
  },
};
