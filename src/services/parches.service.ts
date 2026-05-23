import axios from 'axios';

// ──────────────────────────────────────────────
// Dedicated Axios instance for the Hangout Service
// ──────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_GATEWAY_URL ?? '/svc/gateway';

const hangoutApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token + user-id automatically from localStorage
hangoutApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // The hangout service identifies users via X-User-Id (studentId)
  try {
    const raw = localStorage.getItem('patricia-user');
    if (raw) {
      const user = JSON.parse(raw);
      const userId = user.studentId || user.id;
      if (userId) config.headers['X-User-Id'] = userId;
    }
  } catch { /* ignore */ }

  return config;
});

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export interface ParcheResponse {
  id: string;
  name: string;
  description: string;
  lugar: string;
  category: string;
  type: 'PUBLIC' | 'PRIVATE';
  status: 'ACTIVE' | 'ARCHIVED';
  maximumQuota: number;
  actualMembers: number;
  ownerId: string;
  date: string;        // yyyy-MM-dd
  hour: string;
  imageUrl: string;
}

export interface PlaceResponse {
  displayName: string;
  code: string;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  date: string;
  hour: string;
  place: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
}

export interface MemberResponse {
  id: string;
  parcheId: string;
  studentId: string;
  unionDate: string;
}

export interface ParcheDetailResponse extends Omit<ParcheResponse, 'lugar'> {
  place: PlaceResponse;
  event: EventResponse | null;
  members: MemberResponse[];
}

export interface CreateParcheRequest {
  name: string;
  description: string;
  lugar: string;              // campus zone code, e.g. "ED_A"
  category: string;
  date: string;               // yyyy-MM-dd
  hour: string;               // HH:mm:ss
  maximumQuota: number;
  type: 'PUBLIC' | 'PRIVATE';
  eventId?: string;
  imageUrl?: string;
}

export interface UpdateParcheRequest {
  description?: string;
  lugar?: string;
  category?: string;
  date?: string;
  hour?: string;
  maximumQuota?: number;
  type?: 'PUBLIC' | 'PRIVATE';
  eventId?: string;
  imageUrl?: string;
}

export interface InvitationResponse {
  id: string;
  parcheId: string;
  invitedStudentId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  sentAt: string;
  respondedAt: string | null;
}

export interface SearchParcheParams {
  nombre?: string;
  fecha?: string;           // yyyy-MM-dd
  categoria?: string;
  lugar?: string;
  cupoDisponible?: boolean;
}

// ──────────────────────────────────────────────
// Helper to filter out dummy example.com domains
// ──────────────────────────────────────────────
function cleanImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.includes('example.com') || url.includes('storage.example.com')) return '';
  return url;
}

function logFallback(endpoint: string, error: any) {
  console.warn(
    `[Fallback] La llamada a backend ${endpoint} falló (${error?.response?.status || 'Error de Red'}).`
  );
}

// ──────────────────────────────────────────────
// Parche endpoints
// ──────────────────────────────────────────────

/** GET /parches — public + active list with optional filters */
export async function searchParches(params?: SearchParcheParams): Promise<ParcheResponse[]> {
  try {
    const res = await hangoutApi.get<ParcheResponse[]>('/parches', { params });
    return res.data.map(p => ({
      ...p,
      imageUrl: cleanImageUrl(p.imageUrl)
    }));
  } catch (error) {
    logFallback('GET /parches', error);
    return [];
  }
}

/** POST /parches — create a new parche (ownerId passed via X-User-Id header) */
export async function createParche(
  data: CreateParcheRequest,
  userId: string,
): Promise<ParcheResponse> {
  try {
    const res = await hangoutApi.post<ParcheResponse>('/parches', data, {
      headers: { 'X-User-Id': userId },
    });
    const p = res.data;
    return {
      ...p,
      imageUrl: cleanImageUrl(p.imageUrl)
    };
  } catch (error) {
    logFallback('POST /parches', error);
    throw error;
  }
}

/** GET /parches/{id} — enriched detail (place, event, members) */
export async function getParcheById(id: string): Promise<ParcheDetailResponse> {
  try {
    const res = await hangoutApi.get<ParcheDetailResponse>(`/parches/${id}`);
    const data = res.data;
    return {
      ...data,
      imageUrl: cleanImageUrl(data.imageUrl)
    };
  } catch (error) {
    logFallback(`GET /parches/${id}`, error);
    throw error;
  }
}

/** PATCH /parches/{id} — update parche (owner only) */
export async function updateParche(
  id: string,
  data: UpdateParcheRequest,
): Promise<ParcheResponse> {
  try {
    const res = await hangoutApi.patch<ParcheResponse>(`/parches/${id}`, data);
    const p = res.data;
    return {
      ...p,
      imageUrl: cleanImageUrl(p.imageUrl)
    };
  } catch (error) {
    logFallback(`PATCH /parches/${id}`, error);
    throw error;
  }
}

/** DELETE /parches/{id} — soft-delete / archive (admin only) */
export async function archiveParche(id: string): Promise<void> {
  try {
    await hangoutApi.delete(`/parches/${id}`);
  } catch (error) {
    logFallback(`DELETE /parches/${id}`, error);
    throw error;
  }
}

/** GET /parches/me — my active parches (PUBLIC + PRIVATE where I'm a member) */
export async function getMyParches(): Promise<ParcheResponse[]> {
  try {
    const res = await hangoutApi.get<ParcheResponse[]>('/parches/me');
    return res.data.map(p => ({
      ...p,
      imageUrl: cleanImageUrl(p.imageUrl)
    }));
  } catch (error) {
    logFallback('GET /parches/me', error);
    return [];
  }
}

/** GET /parches/opciones/lugares */
export async function getAvailablePlaces(): Promise<PlaceResponse[]> {
  try {
    const res = await hangoutApi.get<PlaceResponse[]>('/parches/opciones/lugares');
    return res.data;
  } catch (error) {
    logFallback('GET /parches/opciones/lugares', error);
    return [];
  }
}

/** GET /parches/opciones/eventos */
export async function getAvailableEvents(): Promise<EventResponse[]> {
  try {
    const res = await hangoutApi.get<EventResponse[]>('/parches/opciones/eventos');
    return res.data;
  } catch (error) {
    logFallback('GET /parches/opciones/eventos', error);
    return [];
  }
}

/** GET /parches/opciones/categorias */
export async function getAvailableCategories(): Promise<CategoryResponse[]> {
  try {
    const res = await hangoutApi.get<CategoryResponse[]>('/parches/opciones/categorias');
    return res.data;
  } catch (error) {
    logFallback('GET /parches/opciones/categorias', error);
    return [];
  }
}

// ──────────────────────────────────────────────
// Member endpoints
// ──────────────────────────────────────────────

/** POST /parches/{parcheId}/miembros — join a public hangout */
export async function joinParche(parcheId: string): Promise<MemberResponse> {
  try {
    const res = await hangoutApi.post<MemberResponse>(`/parches/${parcheId}/miembros`);
    return res.data;
  } catch (error) {
    logFallback(`POST /parches/${parcheId}/miembros`, error);
    throw error;
  }
}

/** POST /parches/{parcheId}/miembros/leave — leave a hangout */
export async function leaveParche(parcheId: string, newOwnerId?: string): Promise<void> {
  try {
    await hangoutApi.post(`/parches/${parcheId}/miembros/leave`, newOwnerId ? { newOwnerId } : {});
  } catch (error) {
    logFallback(`POST /parches/${parcheId}/miembros/leave`, error);
    throw error;
  }
}

// ──────────────────────────────────────────────
// Invitation endpoints
// ──────────────────────────────────────────────

/** POST /parches/{parcheId}/invitaciones/{studentId} — send invitation */
export async function sendInvitation(
  parcheId: string,
  studentId: string,
): Promise<InvitationResponse> {
  try {
    const res = await hangoutApi.post<InvitationResponse>(
      `/parches/${parcheId}/invitaciones/${studentId}`,
    );
    return res.data;
  } catch (error) {
    logFallback(`POST /parches/${parcheId}/invitaciones/${studentId}`, error);
    throw error;
  }
}

/** POST /invitaciones/{invitationId}/aceptar */
export async function acceptInvitation(invitationId: string): Promise<InvitationResponse> {
  try {
    const res = await hangoutApi.post<InvitationResponse>(`/invitaciones/${invitationId}/aceptar`);
    return res.data;
  } catch (error) {
    logFallback(`POST /invitaciones/${invitationId}/aceptar`, error);
    throw error;
  }
}

/** POST /invitaciones/{invitationId}/rechazar */
export async function rejectInvitation(invitationId: string): Promise<InvitationResponse> {
  try {
    const res = await hangoutApi.post<InvitationResponse>(`/invitaciones/${invitationId}/rechazar`);
    return res.data;
  } catch (error) {
    logFallback(`POST /invitaciones/${invitationId}/rechazar`, error);
    throw error;
  }
}

/** PATCH /invitaciones/{invitationId} — respond with ACCEPTED or REJECTED */
export async function respondInvitation(
  invitationId: string,
  answer: 'ACCEPTED' | 'REJECTED',
): Promise<InvitationResponse> {
  try {
    const res = await hangoutApi.patch<InvitationResponse>(`/invitaciones/${invitationId}`, {
      answer,
    });
    return res.data;
  } catch (error) {
    logFallback(`PATCH /invitaciones/${invitationId}`, error);
    throw error;
  }
}
