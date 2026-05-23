import api from './http';

// --- Enums del microservicio ---
export type PatchCategory = 'STUDY' | 'SPORTS' | 'CULTURE' | 'GAMING' | 'FOOD' | 'MUSIC' | 'OTHER';
export type CampusZone = 'BIBLIOTECA' | 'CAFETERIA' | 'CANCHA' | 'SALON' | 'PARQUEADERO' | 'EXTERNO';
export type PatchStatus = 'OPEN' | 'FULL' | 'CLOSED' | 'CANCELLED';
export type InteractionType = 'VIEW' | 'JOIN' | 'SKIP';

// --- DTOs de respuesta ---
export interface PatchSummaryResponse {
  id: string;
  title: string;
  description: string;
  category: PatchCategory;
  campusZone: CampusZone;
  status: PatchStatus;
  startTime: string; // ISO 8601 datetime
  capacity: number;
  currentCount: number;
  isPublic: boolean;
  creatorName: string;
  affinityScore: number | null; // 0.0 - 1.0
  userIsMember: boolean;
}

export interface SearchResponse {
  results: PatchSummaryResponse[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface PatchRecommendationResponse {
  patchId: string;
  patch: PatchSummaryResponse;
  affinityScore: number;
  reason: string;
}

// --- Parámetros de consulta ---
export interface FeedParams {
  userId: string;
  category?: PatchCategory;
  campusZone?: CampusZone;
  dateFrom?: string; // YYYY-MM-DD
  page?: number;
  size?: number;
}

export interface SearchParams {
  userId?: string;
  q?: string;
  category?: PatchCategory;
  campusZone?: CampusZone;
  status?: PatchStatus;
  dateFrom?: string;
  dateTo?: string;
  maxGroupSize?: number;
  hasAvailableSpots?: boolean;
  page?: number;
  size?: number;
}

export const feedService = {
  getFeed(params: FeedParams): Promise<PatchSummaryResponse[]> {
    return api.get<PatchSummaryResponse[]>('/v1/feed/parches', { params }).then((r) => r.data);
  },

  getRecommended(userId: string): Promise<PatchRecommendationResponse[]> {
    return api.get<PatchRecommendationResponse[]>('/v1/feed/recommended', { params: { userId } }).then((r) => r.data);
  },

  interact(patchId: string, userId: string, action: InteractionType): Promise<void> {
    return api.post(`/v1/feed/parches/${patchId}/interact`, { action }, { params: { userId } }).then(() => undefined);
  },

  joinPatch(patchId: string, userId: string): Promise<void> {
    return api.post(`/v1/feed/${patchId}/join`, null, { params: { userId } }).then(() => undefined);
  },

  search(params: SearchParams): Promise<SearchResponse> {
    return api.get<SearchResponse>('/v1/parches/search', { params }).then((r) => r.data);
  },
};
