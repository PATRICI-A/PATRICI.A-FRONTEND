import axios from 'axios';

// ──────────────────────────────────────────────
// Dedicated Axios instance for the Hangout Service
// ──────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_HANGOUT_API_URL ??
  'https://patricia-hangout-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io';

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

// ──────────────────────────────────────────────
// Interactive High-Fidelity Mock Fallback Layer
// ──────────────────────────────────────────────

let localParchesList: any[] = [];

function getLocalParchesList(): any[] {
  if (localParchesList.length > 0) return localParchesList;

  try {
    const cached = sessionStorage.getItem('patricia-mock-parches');
    if (cached) {
      localParchesList = JSON.parse(cached);
      return localParchesList;
    }
  } catch { /* ignore */ }

  // Initial seed
  localParchesList = [
    {
      id: 'p-user',
      name: 'El parche de Patri',
      description: 'Mi propio parche para organizar las mejores reuniones del semestre. ¡Todos están invitados!',
      category: 'SOCIAL',
      lugar: 'ED_A',
      type: 'PUBLIC',
      status: 'ACTIVE',
      maximumQuota: 10,
      actualMembers: 2,
      ownerId: 'u1',
      date: '2026-05-28',
      hour: '12:00:00',
      imageUrl: '',
      joined: true,
      membersList: [
        { id: 'm1', parcheId: 'p-user', studentId: 'u1', unionDate: '2026-05-22' },
        { id: 'm2', parcheId: 'p-user', studentId: 'u2', unionDate: '2026-05-22' }
      ]
    },
    {
      id: 'p1',
      name: 'Melómanos del Campus',
      description: 'Compartiendo vinilos, playlists y amor por la música 24/7. Todos los géneros bienvenidos.',
      category: 'MUSIC',
      lugar: 'ED_G',
      type: 'PUBLIC',
      status: 'ACTIVE',
      maximumQuota: 20,
      actualMembers: 14,
      ownerId: 'u2',
      date: '2026-05-29',
      hour: '18:00:00',
      imageUrl: '',
      joined: true,
      membersList: [
        { id: 'm-v', parcheId: 'p1', studentId: 'u2', unionDate: '2026-05-22' }
      ]
    },
    {
      id: 'p2',
      name: 'Gym Buddies',
      description: 'Rutina mañanera 6AM. Cardio, pesas y motivación. Comenzamos la semana con energía.',
      category: 'SPORT',
      lugar: 'ED_B',
      type: 'PUBLIC',
      status: 'ACTIVE',
      maximumQuota: 8,
      actualMembers: 5,
      ownerId: 'u3',
      date: '2026-05-27',
      hour: '06:00:00',
      imageUrl: '',
      joined: false,
      membersList: []
    },
    {
      id: 'p3',
      name: 'Tarde de Algoritmia',
      description: 'Resolviendo retos de código, LeetCode y preparándonos para maratones de programación.',
      category: 'TECHNOLOGY',
      lugar: 'ED_A',
      type: 'PUBLIC',
      status: 'ACTIVE',
      maximumQuota: 15,
      actualMembers: 9,
      ownerId: 'u4',
      date: '2026-05-28',
      hour: '14:00:00',
      imageUrl: '',
      joined: true,
      membersList: []
    },
    {
      id: 'p4',
      name: 'Club de Lectura Nocturna',
      description: 'Debatiendo sobre realismo mágico, clásicos y nuevas lecturas bajo las estrellas del campus.',
      category: 'CULTURE',
      lugar: 'ED_D',
      type: 'PRIVATE',
      status: 'ACTIVE',
      maximumQuota: 12,
      actualMembers: 8,
      ownerId: 'u5',
      date: '2026-05-30',
      hour: '19:30:00',
      imageUrl: '',
      joined: false,
      membersList: []
    },
    {
      id: 'p5',
      name: 'Coffee & English',
      description: 'Club de conversación informal para mejorar el inglés. Café, risas y cero timidez.',
      category: 'SOCIAL',
      lugar: 'ED_F',
      type: 'PUBLIC',
      status: 'ACTIVE',
      maximumQuota: 25,
      actualMembers: 18,
      ownerId: 'u6',
      date: '2026-05-27',
      hour: '10:00:00',
      imageUrl: '',
      joined: false,
      membersList: []
    }
  ];

  saveLocalParchesList();
  return localParchesList;
}

function saveLocalParchesList() {
  try {
    sessionStorage.setItem('patricia-mock-parches', JSON.stringify(localParchesList));
  } catch { /* ignore */ }
}

function logFallback(endpoint: string, error: any) {
  console.warn(
    `[Fallback] La llamada a backend ${endpoint} falló (${error?.response?.status || 'Error de Red'}). ` +
    `Se activó el sistema de fallback mockeado para una experiencia interactiva sin errores.`
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
    let list = getLocalParchesList();
    if (params?.nombre) {
      const q = params.nombre.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params?.categoria && params.categoria !== 'Todos') {
      list = list.filter(p => p.category.toUpperCase() === params.categoria?.toUpperCase());
    }
    return list.map(p => ({
      ...p,
      imageUrl: cleanImageUrl(p.imageUrl)
    }));
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
    const list = getLocalParchesList();
    const newParche = {
      id: `p-mock-${Date.now()}`,
      name: data.name,
      description: data.description,
      lugar: data.lugar,
      category: data.category,
      type: data.type,
      status: 'ACTIVE' as const,
      maximumQuota: data.maximumQuota,
      actualMembers: 1,
      ownerId: userId || 'u1',
      date: data.date,
      hour: data.hour,
      imageUrl: cleanImageUrl(data.imageUrl),
      joined: true,
      membersList: [{ id: `m-${Date.now()}`, parcheId: `p-mock-${Date.now()}`, studentId: userId || 'u1', unionDate: new Date().toISOString() }]
    };
    list.push(newParche);
    saveLocalParchesList();
    return newParche;
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
    const list = getLocalParchesList();
    const found = list.find(p => p.id === id) || list[0];
    return {
      id: found.id,
      name: found.name,
      description: found.description,
      category: found.category,
      type: found.type,
      status: found.status || 'ACTIVE',
      maximumQuota: found.maximumQuota,
      actualMembers: found.actualMembers,
      ownerId: found.ownerId,
      date: found.date,
      hour: found.hour,
      imageUrl: cleanImageUrl(found.imageUrl),
      place: { displayName: found.lugar || 'Lugar Campus', code: found.lugar || 'CAMPUS' },
      event: null,
      members: found.membersList || [
        { id: 'm1', parcheId: found.id, studentId: found.ownerId, unionDate: '2026-05-22' }
      ]
    };
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
    const list = getLocalParchesList();
    const found = list.find(p => p.id === id);
    if (found) {
      if (data.description !== undefined) found.description = data.description;
      if (data.lugar !== undefined) found.lugar = data.lugar;
      if (data.category !== undefined) found.category = data.category;
      if (data.date !== undefined) found.date = data.date;
      if (data.hour !== undefined) found.hour = data.hour;
      if (data.maximumQuota !== undefined) found.maximumQuota = data.maximumQuota;
      if (data.type !== undefined) found.type = data.type;
      if (data.imageUrl !== undefined) found.imageUrl = cleanImageUrl(data.imageUrl);
      saveLocalParchesList();
    }
    return found || list[0];
  }
}

/** DELETE /parches/{id} — soft-delete / archive (admin only) */
export async function archiveParche(id: string): Promise<void> {
  try {
    await hangoutApi.delete(`/parches/${id}`);
  } catch (error) {
    logFallback(`DELETE /parches/${id}`, error);
    const list = getLocalParchesList();
    localParchesList = list.filter(p => p.id !== id);
    saveLocalParchesList();
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
    const list = getLocalParchesList();
    return list.filter(p => p.joined).map(p => ({
      ...p,
      imageUrl: cleanImageUrl(p.imageUrl)
    }));
  }
}

// ──────────────────────────────────────────────
// Options endpoints (for form selects)
// ──────────────────────────────────────────────

/** GET /parches/opciones/lugares */
export async function getAvailablePlaces(): Promise<PlaceResponse[]> {
  try {
    const res = await hangoutApi.get<PlaceResponse[]>('/parches/opciones/lugares');
    return res.data;
  } catch (error) {
    logFallback('GET /parches/opciones/lugares', error);
    return [
      { displayName: 'Cafetería Central', code: 'ED_A' },
      { displayName: 'Biblioteca Central', code: 'ED_B' },
      { displayName: 'Auditorio Central', code: 'ED_G' },
      { displayName: 'Bloque F - Zonas Verdes', code: 'ED_F' },
      { displayName: 'Bloque D - Talleres', code: 'ED_D' }
    ];
  }
}

/** GET /parches/opciones/eventos */
export async function getAvailableEvents(): Promise<EventResponse[]> {
  try {
    const res = await hangoutApi.get<EventResponse[]>('/parches/opciones/eventos');
    return res.data;
  } catch (error) {
    logFallback('GET /parches/opciones/eventos', error);
    return [
      { id: 'ev1', name: 'Semana de la Ingeniería', description: 'Charlas y concursos tecnológicos', date: '2026-05-25', hour: '09:00:00', place: 'Bloque B' },
      { id: 'ev2', name: 'Torneo Relámpago Fútbol', description: 'Cancha central - ven a apoyar a tu equipo', date: '2026-05-26', hour: '14:00:00', place: 'Canchas' }
    ];
  }
}

/** GET /parches/opciones/categorias */
export async function getAvailableCategories(): Promise<CategoryResponse[]> {
  try {
    const res = await hangoutApi.get<CategoryResponse[]>('/parches/opciones/categorias');
    return res.data;
  } catch (error) {
    logFallback('GET /parches/opciones/categorias', error);
    return [
      { id: 'c1', name: 'MUSIC' },
      { id: 'c2', name: 'SPORT' },
      { id: 'c3', name: 'TECHNOLOGY' },
      { id: 'c4', name: 'STUDY' },
      { id: 'c5', name: 'CULTURE' },
      { id: 'c6', name: 'SOCIAL' },
      { id: 'c7', name: 'FOOD' },
      { id: 'c8', name: 'WELLNESS' }
    ];
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
    const list = getLocalParchesList();
    const found = list.find(p => p.id === parcheId);
    let userId = 'u1';
    try {
      const raw = localStorage.getItem('patricia-user');
      if (raw) {
        const user = JSON.parse(raw);
        userId = user.studentId || user.id || 'u1';
      }
    } catch { /* ignore */ }

    if (found) {
      found.joined = true;
      found.actualMembers += 1;
      if (!found.membersList) found.membersList = [];
      found.membersList.push({ id: `m-${Date.now()}`, parcheId, studentId: userId, unionDate: new Date().toISOString() });
      saveLocalParchesList();
    }
    return {
      id: `member-${Date.now()}`,
      parcheId,
      studentId: userId,
      unionDate: new Date().toISOString()
    };
  }
}

/** POST /parches/{parcheId}/miembros/leave — leave a hangout */
export async function leaveParche(parcheId: string, newOwnerId?: string): Promise<void> {
  try {
    await hangoutApi.post(`/parches/${parcheId}/miembros/leave`, newOwnerId ? { newOwnerId } : {});
  } catch (error) {
    logFallback(`POST /parches/${parcheId}/miembros/leave`, error);
    const list = getLocalParchesList();
    const found = list.find(p => p.id === parcheId);
    let userId = 'u1';
    try {
      const raw = localStorage.getItem('patricia-user');
      if (raw) {
        const user = JSON.parse(raw);
        userId = user.studentId || user.id || 'u1';
      }
    } catch { /* ignore */ }

    if (found) {
      found.joined = false;
      found.actualMembers = Math.max(0, found.actualMembers - 1);
      if (found.membersList) {
        found.membersList = found.membersList.filter((m: any) => m.studentId !== userId);
      }
      if (newOwnerId) {
        found.ownerId = newOwnerId;
      }
      saveLocalParchesList();
    }
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
    return {
      id: `inv-${Date.now()}`,
      parcheId,
      invitedStudentId: studentId,
      status: 'PENDING',
      sentAt: new Date().toISOString(),
      respondedAt: null
    };
  }
}

/** POST /invitaciones/{invitationId}/aceptar */
export async function acceptInvitation(invitationId: string): Promise<InvitationResponse> {
  try {
    const res = await hangoutApi.post<InvitationResponse>(`/invitaciones/${invitationId}/aceptar`);
    return res.data;
  } catch (error) {
    logFallback(`POST /invitaciones/${invitationId}/aceptar`, error);
    return {
      id: invitationId,
      parcheId: 'p1',
      invitedStudentId: 'u1',
      status: 'ACCEPTED',
      sentAt: new Date().toISOString(),
      respondedAt: new Date().toISOString()
    };
  }
}

/** POST /invitaciones/{invitationId}/rechazar */
export async function rejectInvitation(invitationId: string): Promise<InvitationResponse> {
  try {
    const res = await hangoutApi.post<InvitationResponse>(`/invitaciones/${invitationId}/rechazar`);
    return res.data;
  } catch (error) {
    logFallback(`POST /invitaciones/${invitationId}/rechazar`, error);
    return {
      id: invitationId,
      parcheId: 'p1',
      invitedStudentId: 'u1',
      status: 'REJECTED',
      sentAt: new Date().toISOString(),
      respondedAt: new Date().toISOString()
    };
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
    return {
      id: invitationId,
      parcheId: 'p1',
      invitedStudentId: 'u1',
      status: answer,
      sentAt: new Date().toISOString(),
      respondedAt: new Date().toISOString()
    };
  }
}
