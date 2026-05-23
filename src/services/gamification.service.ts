import axios from 'axios';

const BASE_URL = '/svc/gateway';

const gamificationApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

gamificationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const userId = localStorage.getItem('patricia_user_id');
  if (userId) config.headers['X-User-Id'] = userId;
  return config;
});

export interface MonaResponse {
  monaId: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlocked: boolean;
  earnedAt: string | null;
  currentCount: number;
  targetCount: number;
  progressPercentage: number;
}

export interface UserStatsResponse {
  userId: string;
  totalXp: number;
  weeklyXp: number;
  weeklyMonas: number;
  totalMonas: number;
  nivel: number;
  levelName: string;
  rankingOptIn: boolean;
  totalBadgesEarned: number;
  totalRewardsUnlocked: number;
}

export interface EarnedBadgeResponse {
  badgeId: string;
  badgeName: string;
  earnedAt: string;
  xpAwarded: number;
}

export interface RankingEntryResponse {
  studentId: string;
  studentName: string;
  totalMonas: number;
  position: number;
  xp: number;
}

export interface RankingPositionResponse {
  position: number | null;
  monasThisPeriod: number;
  rankingOptIn: boolean;
  periodStart: string;
  periodEnd: string;
  rankingType: 'WEEKLY' | 'MONTHLY' | 'SEMESTER';
}

export interface BadgeProgressResponse {
  badgeId: string;
  currentValue: number;
  requiredValue: number;
  completed: boolean;
  percentageComplete: number;
}

export interface UserLevelResponse {
  userId: string;
  nivel: number;
  levelName: string;
  totalMonas: number;
  monasParaSiguienteNivel: number;
}

export interface RankingOptInResponse {
  studentId: string;
  rankingOptIn: boolean;
  updatedAt: string;
}

function logFallback(endpoint: string, error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status;
  console.warn(`[Gamification] La llamada a backend ${endpoint} falló (${status || 'Error de Red'}).`);
}

export async function getMonas(): Promise<MonaResponse[]> {
  try {
    const res = await gamificationApi.get<MonaResponse[]>('/gamificacion/monas');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/monas', error);
    throw error;
  }
}

export async function getMonaById(monaId: string): Promise<MonaResponse> {
  try {
    const res = await gamificationApi.get<MonaResponse>(`/gamificacion/monas/${monaId}`);
    return res.data;
  } catch (error) {
    logFallback(`GET /gamificacion/monas/${monaId}`, error);
    throw error;
  }
}

export async function redeemEventCode(eventCode: string): Promise<EarnedBadgeResponse> {
  try {
    const res = await gamificationApi.post<EarnedBadgeResponse>('/gamificacion/monas/evento', { eventCode });
    return res.data;
  } catch (error) {
    logFallback('POST /gamificacion/monas/evento', error);
    throw error;
  }
}

export async function setRankingOptIn(participe: boolean): Promise<RankingOptInResponse> {
  try {
    const res = await gamificationApi.patch<RankingOptInResponse>('/gamificacion/me/ranking/optin', { participe });
    return res.data;
  } catch (error) {
    logFallback('PATCH /gamificacion/me/ranking/optin', error);
    throw error;
  }
}

export async function getRanking(tipo: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' = 'WEEKLY'): Promise<RankingEntryResponse[]> {
  try {
    const res = await gamificationApi.get<RankingEntryResponse[]>('/gamificacion/ranking', { params: { tipo } });
    return res.data;
  } catch (error) {
    logFallback(`GET /gamificacion/ranking?tipo=${tipo}`, error);
    return [];
  }
}

export async function getMyRankingPosition(tipo: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' = 'WEEKLY'): Promise<RankingPositionResponse> {
  try {
    const res = await gamificationApi.get<RankingPositionResponse>('/gamificacion/ranking/mi-posicion', { params: { tipo } });
    return res.data;
  } catch (error) {
    logFallback(`GET /gamificacion/ranking/mi-posicion?tipo=${tipo}`, error);
    throw error;
  }
}

export async function getGamificationStats(): Promise<UserStatsResponse> {
  try {
    const res = await gamificationApi.get<UserStatsResponse>('/gamificacion/me/stats');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/stats', error);
    throw error;
  }
}

export async function getBadgeProgress(): Promise<BadgeProgressResponse[]> {
  try {
    const res = await gamificationApi.get<BadgeProgressResponse[]>('/gamificacion/me/progress');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/progress', error);
    throw error;
  }
}

export async function getMyCurrentLevel(): Promise<UserLevelResponse> {
  try {
    const res = await gamificationApi.get<UserLevelResponse>('/gamificacion/me/nivel');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/nivel', error);
    throw error;
  }
}

export async function getUnlockedBadges(): Promise<EarnedBadgeResponse[]> {
  try {
    const res = await gamificationApi.get<EarnedBadgeResponse[]>('/gamificacion/me/badges');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/badges', error);
    throw error;
  }
}
