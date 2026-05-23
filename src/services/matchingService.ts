import axios from 'axios';

const matchingApi = axios.create({
  baseURL: '/svc/matching',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

matchingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const userId = localStorage.getItem('patricia_user_id');
  if (userId) config.headers['X-User-Id'] = userId;
  return config;
});

matchingApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('patricia-token');
      localStorage.removeItem('patricia-logged-in');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Types ───────────────────────────────────────────────────────────────────

export type MatchStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface MatchRequest {
  requesterId: string;
  targetId: string;
}

export interface MatchUpdateRequest {
  status: MatchStatus;
}

export interface AffinityScoreResponse {
  score: number;
  interestScore: number;
  academicScore: number;
  scheduleScore: number;
}

export interface MatchResponse {
  idMatch: string;
  requesterId: string;
  targetId: string;
  status: MatchStatus;
  affinityScore?: AffinityScoreResponse;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecommendationResponse {
  userId: string;
  recommendedUserIds: string[];
}

export interface RecommendationWithScoreResponse {
  targetUserId: string;
  totalScore: number;
  interestScore: number;
  academicScore: number;
  scheduleScore: number;
}

export interface NearbyRecommendationResponse extends RecommendationWithScoreResponse {
  distanceMeters: number;
}

export interface FilterCriteriaRequest {
  careers?: string;
  semesters?: string;
  tag?: string;
  geolocation?: boolean;
  active?: boolean;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const matchingService = {
  // ── Recommendations ────────────────────────────────────────────────────────

  async getRecommendations(userId: string): Promise<RecommendationResponse> {
    const { data } = await matchingApi.get<RecommendationResponse>(
      `/api/v1/matches/recommendations/${userId}`
    );
    return data;
  },

  async getFilteredRecommendations(
    userId: string,
    filters: FilterCriteriaRequest
  ): Promise<RecommendationResponse> {
    const { data } = await matchingApi.post<RecommendationResponse>(
      `/api/v1/matches/recommendations/${userId}/filtered`,
      filters
    );
    return data;
  },

  async getRecommendationsWithScores(
    userId: string
  ): Promise<RecommendationWithScoreResponse[]> {
    const { data } = await matchingApi.get<RecommendationWithScoreResponse[]>(
      `/api/v1/matches/recommendations/${userId}/scores`
    );
    return data;
  },

  async getNearbyRecommendations(userId: string): Promise<NearbyRecommendationResponse[]> {
    const { data } = await matchingApi.get<NearbyRecommendationResponse[]>(
      `/api/v1/matches/recommendations/${userId}/nearby`
    );
    return data;
  },

  // ── Matches ────────────────────────────────────────────────────────────────

  async sendRequest(requesterId: string, targetId: string): Promise<MatchResponse> {
    const { data } = await matchingApi.post<MatchResponse>('/api/v1/matches', {
      requesterId,
      targetId,
    });
    return data;
  },

  async getMatchById(matchId: string): Promise<MatchResponse> {
    const { data } = await matchingApi.get<MatchResponse>(`/api/v1/matches/${matchId}`);
    return data;
  },

  async updateMatchStatus(matchId: string, status: MatchStatus): Promise<MatchResponse> {
    const { data } = await matchingApi.patch<MatchResponse>(
      `/api/v1/matches/${matchId}/status`,
      { status } satisfies MatchUpdateRequest
    );
    return data;
  },

  async deleteMatch(matchId: string): Promise<void> {
    await matchingApi.delete(`/api/v1/matches/${matchId}`);
  },

  async getUserMatches(userId: string): Promise<MatchResponse[]> {
    const { data } = await matchingApi.get<MatchResponse[]>(
      `/api/v1/matches/user/${userId}`
    );
    return data;
  },

  async getSentRequests(userId: string): Promise<MatchResponse[]> {
    const { data } = await matchingApi.get<MatchResponse[]>(
      `/api/v1/matches/user/${userId}/sent`
    );
    return data;
  },

  async getReceivedRequests(userId: string): Promise<MatchResponse[]> {
    const { data } = await matchingApi.get<MatchResponse[]>(
      `/api/v1/matches/user/${userId}/received`
    );
    return data;
  },
};
