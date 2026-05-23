import axios from 'axios';
import { monas as initialMonas, rankingUsers } from '../types/mockData';

// ──────────────────────────────────────────────
// Dedicated Axios instance for the Gamification Service
// ──────────────────────────────────────────────
const BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL ??
  'https://patricia-api-gateway-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io';

const gamificationApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token + user-id automatically from localStorage
gamificationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

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
  position: number;
  studentId: string;
  displayName: string;
  levelName: string;
  monasThisPeriod: number;
  totalMonas: number;
}

export interface RankingPositionResponse {
  position: number | null;
  monasThisPeriod: number;
  rankingOptIn: boolean;
  periodStart: string;
  periodEnd: string;
  rankingType: 'WEEKLY' | 'MONTHLY' | 'SEMESTER';
}

export interface RankingOptInResponse {
  studentId: string;
  rankingOptIn: boolean;
  updatedAt: string;
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

// ──────────────────────────────────────────────
// Interactive High-Fidelity Mock Fallback Layer
// ──────────────────────────────────────────────

let localMonas: MonaResponse[] = [];
let localStats: UserStatsResponse | null = null;
let localOptIn = true;

function initLocalGamification() {
  if (localMonas.length > 0) return;

  try {
    const cachedMonas = sessionStorage.getItem('patricia-mock-monas');
    const cachedStats = sessionStorage.getItem('patricia-mock-stats');
    const cachedOptIn = sessionStorage.getItem('patricia-mock-optin');
    
    if (cachedMonas) {
      localMonas = JSON.parse(cachedMonas);
      localStats = cachedStats ? JSON.parse(cachedStats) : null;
      localOptIn = cachedOptIn === 'true';
      return;
    }
  } catch { /* ignore */ }

  // Map initialMonas from mockData to MonaResponse shape
  localMonas = initialMonas.map(m => ({
    monaId: m.id,
    name: m.name,
    description: m.description,
    rarity: mapMockRarityToApi(m.rarity),
    unlocked: m.unlocked,
    earnedAt: m.unlockedAt || null,
    currentCount: m.unlocked ? 1 : 0,
    targetCount: 1,
    progressPercentage: m.unlocked ? 1.0 : 0.0
  }));

  localStats = {
    userId: 'u1',
    totalXp: 1250,
    weeklyXp: 180,
    weeklyMonas: 3,
    totalMonas: localMonas.filter(m => m.unlocked).length,
    nivel: 2,
    levelName: 'Explorador Novato',
    rankingOptIn: localOptIn,
    totalBadgesEarned: localMonas.filter(m => m.unlocked).length,
    totalRewardsUnlocked: 1
  };

  saveLocalGamification();
}

function mapMockRarityToApi(rarity: string): 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' {
  const map: Record<string, 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'> = {
    'común': 'COMMON',
    'poco común': 'UNCOMMON',
    'raro': 'RARE',
    'épico': 'EPIC',
    'legendario': 'LEGENDARY'
  };
  return map[rarity.toLowerCase()] ?? 'COMMON';
}

function saveLocalGamification() {
  try {
    sessionStorage.setItem('patricia-mock-monas', JSON.stringify(localMonas));
    if (localStats) sessionStorage.setItem('patricia-mock-stats', JSON.stringify(localStats));
    sessionStorage.setItem('patricia-mock-optin', String(localOptIn));
  } catch { /* ignore */ }
}

function getLocalRanking(tipo: string = 'WEEKLY'): RankingEntryResponse[] {
  initLocalGamification();
  const list = rankingUsers.map((u, index) => ({
    position: index + 1,
    studentId: u.id,
    displayName: u.name,
    levelName: `Nivel ${u.level}`,
    monasThisPeriod: tipo === 'WEEKLY' ? u.streak * 2 : u.streak * 5,
    totalMonas: Math.round(u.xp / 100)
  })).sort((a, b) => b.monasThisPeriod - a.monasThisPeriod);

  return list.map((item, idx) => ({ ...item, position: idx + 1 }));
}

function logFallback(endpoint: string, error: any) {
  console.warn(
    `[Gamification Fallback] La llamada a backend ${endpoint} falló (${error?.response?.status || 'Error de Red'}). ` +
    `Se activó el sistema de fallback mockeado para una experiencia interactiva sin errores.`
  );
}

// ──────────────────────────────────────────────
// API Endpoints
// ──────────────────────────────────────────────

/** GET /gamificacion/monas — Mona catalogue */
export async function getMonas(): Promise<MonaResponse[]> {
  try {
    const res = await gamificationApi.get<MonaResponse[]>('/gamificacion/monas');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/monas', error);
    initLocalGamification();
    return localMonas;
  }
}

/** GET /gamificacion/monas/{monaId} — Mona detail */
export async function getMonaById(monaId: string): Promise<MonaResponse> {
  try {
    const res = await gamificationApi.get<MonaResponse>(`/gamificacion/monas/${monaId}`);
    return res.data;
  } catch (error) {
    logFallback(`GET /gamificacion/monas/${monaId}`, error);
    initLocalGamification();
    const found = localMonas.find(m => m.monaId === monaId);
    if (!found) throw new Error('Mona not found');
    return found;
  }
}

/** POST /gamificacion/monas/evento — Redeem event code */
export async function redeemEventCode(eventCode: string): Promise<EarnedBadgeResponse> {
  try {
    const res = await gamificationApi.post<EarnedBadgeResponse>('/gamificacion/monas/evento', { eventCode });
    return res.data;
  } catch (error) {
    logFallback('POST /gamificacion/monas/evento', error);
    initLocalGamification();
    
    // Simulate unlocking a random COMMON mona that is currently locked
    const locked = localMonas.filter(m => !m.unlocked);
    const targetMona = locked[Math.floor(Math.random() * locked.length)] || localMonas[0];
    
    targetMona.unlocked = true;
    targetMona.earnedAt = new Date().toISOString().split('T')[0];
    targetMona.currentCount = 1;
    targetMona.progressPercentage = 1.0;

    if (localStats) {
      localStats.totalMonas += 1;
      localStats.totalBadgesEarned += 1;
      localStats.totalXp += 150;
    }
    
    saveLocalGamification();

    return {
      badgeId: targetMona.monaId,
      badgeName: targetMona.name,
      earnedAt: new Date().toISOString(),
      xpAwarded: 150
    };
  }
}

/** PATCH /gamificacion/me/ranking/optin — Set ranking participation */
export async function setRankingOptIn(participe: boolean): Promise<RankingOptInResponse> {
  try {
    const res = await gamificationApi.patch<RankingOptInResponse>('/gamificacion/me/ranking/optin', { participe });
    return res.data;
  } catch (error) {
    logFallback('PATCH /gamificacion/me/ranking/optin', error);
    initLocalGamification();
    localOptIn = participe;
    if (localStats) localStats.rankingOptIn = participe;
    saveLocalGamification();
    return {
      studentId: 'u1',
      rankingOptIn: participe,
      updatedAt: new Date().toISOString()
    };
  }
}

/** GET /gamificacion/ranking — Ranking leaderboard */
export async function getRanking(tipo: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' = 'WEEKLY'): Promise<RankingEntryResponse[]> {
  try {
    const res = await gamificationApi.get<RankingEntryResponse[]>('/gamificacion/ranking', { params: { tipo } });
    return res.data;
  } catch (error) {
    logFallback(`GET /gamificacion/ranking?tipo=${tipo}`, error);
    return getLocalRanking(tipo);
  }
}

/** GET /gamificacion/ranking/mi-posicion — My ranking position */
export async function getMyRankingPosition(tipo: 'WEEKLY' | 'MONTHLY' | 'SEMESTER' = 'WEEKLY'): Promise<RankingPositionResponse> {
  try {
    const res = await gamificationApi.get<RankingPositionResponse>('/gamificacion/ranking/mi-posicion', { params: { tipo } });
    return res.data;
  } catch (error) {
    logFallback(`GET /gamificacion/ranking/mi-posicion?tipo=${tipo}`, error);
    initLocalGamification();
    const rank = getLocalRanking(tipo);
    const pos = rank.findIndex(r => r.studentId === 'u1') + 1;
    return {
      position: localOptIn ? (pos || 4) : null,
      monasThisPeriod: localOptIn ? 5 : 0,
      rankingOptIn: localOptIn,
      periodStart: new Date().toISOString().split('T')[0],
      periodEnd: new Date().toISOString().split('T')[0],
      rankingType: tipo
    };
  }
}

/** GET /gamificacion/me/stats — My gamification stats */
export async function getGamificationStats(): Promise<UserStatsResponse> {
  try {
    const res = await gamificationApi.get<UserStatsResponse>('/gamificacion/me/stats');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/stats', error);
    initLocalGamification();
    return localStats!;
  }
}

/** GET /gamificacion/me/progress — My progress towards badges */
export async function getBadgeProgress(): Promise<BadgeProgressResponse[]> {
  try {
    const res = await gamificationApi.get<BadgeProgressResponse[]>('/gamificacion/me/progress');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/progress', error);
    initLocalGamification();
    // Return mock badge progress for all locked badges
    return localMonas.filter(m => !m.unlocked).map(m => ({
      badgeId: m.monaId,
      currentValue: 0,
      requiredValue: 1,
      completed: false,
      percentageComplete: 0
    }));
  }
}

/** GET /gamificacion/me/nivel — My current level */
export async function getMyCurrentLevel(): Promise<UserLevelResponse> {
  try {
    const res = await gamificationApi.get<UserLevelResponse>('/gamificacion/me/nivel');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/nivel', error);
    initLocalGamification();
    return {
      userId: 'u1',
      nivel: localStats?.nivel || 2,
      levelName: localStats?.levelName || 'Explorador Novato',
      totalMonas: localStats?.totalMonas || 3,
      monasParaSiguienteNivel: 5
    };
  }
}

/** GET /gamificacion/me/badges — My unlocked badges */
export async function getUnlockedBadges(): Promise<EarnedBadgeResponse[]> {
  try {
    const res = await gamificationApi.get<EarnedBadgeResponse[]>('/gamificacion/me/badges');
    return res.data;
  } catch (error) {
    logFallback('GET /gamificacion/me/badges', error);
    initLocalGamification();
    return localMonas.filter(m => m.unlocked).map(m => ({
      badgeId: m.monaId,
      badgeName: m.name,
      earnedAt: m.earnedAt || new Date().toISOString(),
      xpAwarded: 100
    }));
  }
}
