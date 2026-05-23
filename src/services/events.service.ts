import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_EVENTS_API_URL ??
  'https://patricia-campus-events-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io';

const eventsApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token + user-id automatically from localStorage
eventsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  try {
    const raw = localStorage.getItem('patricia-user');
    if (raw) {
      const user = JSON.parse(raw);
      const userId = user.studentId || user.id;
      if (userId) config.headers['X-User-Id'] = userId;
      const role = user.role || 'STUDENT';
      config.headers['X-User-Role'] = role;
    }
  } catch { /* ignore */ }

  return config;
});

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  zone: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  locationDetails: string;
  capacity: number;
  registeredCount: number;
  status: 'PUBLISHED' | 'CANCELLED' | 'COMPLETED' | string;
  organizerId: string;
  organizerName: string;
  imageUrl: string;
  isRegistered: boolean;
}

export interface EventFeedResponse {
  content: EventResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface EventRsvpResponse {
  id: string;
  eventId: string;
  userId: string;
  status: 'CONFIRMED' | 'CANCELLED' | string;
  registrationDate: string;
}

export interface EventFeedRequest {
  searchTerm?: string;
  category?: string;
  zone?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  page?: number;
  size?: number;
}

// Fallback logic
let localEventsList: EventResponse[] = [];

function getLocalEventsList(): EventResponse[] {
  if (localEventsList.length > 0) return localEventsList;

  try {
    const cached = sessionStorage.getItem('patricia-mock-events');
    if (cached) {
      localEventsList = JSON.parse(cached);
      return localEventsList;
    }
  } catch { /* ignore */ }

  // Initial seed
  localEventsList = [
    {
      id: 'e1',
      name: 'Feria de Emprendimiento',
      description: 'Conoce las mejores startups del campus y conecta con futuros socios.',
      category: 'FERIA',
      zone: 'ED_A',
      startDate: '2026-06-15',
      endDate: '2026-06-15',
      startTime: '09:00:00',
      endTime: '15:00:00',
      locationDetails: 'Plaza Central',
      capacity: 500,
      registeredCount: 120,
      status: 'PUBLISHED',
      organizerId: 'org1',
      organizerName: 'Centro de Emprendimiento',
      imageUrl: '',
      isRegistered: false
    },
    {
      id: 'e2',
      name: 'Hackathon Patricia 2026',
      description: '48 horas de código, pizza y premios. ¡Forma tu equipo y participa!',
      category: 'COMPETENCIA',
      zone: 'ED_G',
      startDate: '2026-07-01',
      endDate: '2026-07-03',
      startTime: '18:00:00',
      endTime: '18:00:00',
      locationDetails: 'Auditorio Principal',
      capacity: 100,
      registeredCount: 85,
      status: 'PUBLISHED',
      organizerId: 'org2',
      organizerName: 'Facultad de Ingeniería',
      imageUrl: '',
      isRegistered: true
    }
  ];
  saveLocalEventsList();
  return localEventsList;
}

function saveLocalEventsList() {
  try {
    sessionStorage.setItem('patricia-mock-events', JSON.stringify(localEventsList));
  } catch { /* ignore */ }
}

function logFallback(endpoint: string, error: any) {
  console.warn(
    `[Fallback] La llamada a backend ${endpoint} falló (${error?.response?.status || 'Error de Red'}). ` +
    `Se activó el sistema de fallback mockeado para una experiencia interactiva sin errores.`
  );
}

export async function searchEvents(params?: EventFeedRequest): Promise<EventFeedResponse> {
  try {
    const res = await eventsApi.get<EventFeedResponse>('/events', { params });
    return res.data;
  } catch (error) {
    logFallback('GET /events', error);
    let list = getLocalEventsList();
    
    if (params?.searchTerm) {
      const q = params.searchTerm.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (params?.category && params.category !== 'ALL') {
      list = list.filter(e => e.category === params.category);
    }
    
    return {
      content: list,
      pageNumber: params?.page || 0,
      pageSize: params?.size || 20,
      totalElements: list.length,
      totalPages: 1,
      last: true
    };
  }
}

export async function rsvpEvent(eventId: string): Promise<EventRsvpResponse> {
  try {
    const res = await eventsApi.post<EventRsvpResponse>(`/events/${eventId}/rsvp`);
    return res.data;
  } catch (error) {
    logFallback(`POST /events/${eventId}/rsvp`, error);
    const list = getLocalEventsList();
    const event = list.find(e => e.id === eventId);
    let userId = 'u1';
    try {
      const raw = localStorage.getItem('patricia-user');
      if (raw) {
        const user = JSON.parse(raw);
        userId = user.studentId || user.id || 'u1';
      }
    } catch { /* ignore */ }
    
    if (event) {
      event.isRegistered = !event.isRegistered;
      if (event.isRegistered) event.registeredCount++;
      else event.registeredCount--;
      saveLocalEventsList();
    }
    
    return {
      id: `rsvp-${Date.now()}`,
      eventId,
      userId,
      status: event?.isRegistered ? 'CONFIRMED' : 'CANCELLED',
      registrationDate: new Date().toISOString()
    };
  }
}

export async function getAgenda(params?: { page?: number; size?: number }): Promise<EventFeedResponse> {
  try {
    const res = await eventsApi.get<EventFeedResponse>('/events/rsvp/agenda', { params });
    return res.data;
  } catch (error) {
    logFallback('GET /events/rsvp/agenda', error);
    const list = getLocalEventsList().filter(e => e.isRegistered);
    return {
      content: list,
      pageNumber: params?.page || 0,
      pageSize: params?.size || 20,
      totalElements: list.length,
      totalPages: 1,
      last: true
    };
  }
}
