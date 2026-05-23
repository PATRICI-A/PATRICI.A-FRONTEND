import axios from 'axios';

// Dedicated axios instance pointing at the analytics microservice
const analyticsApi = axios.create({
  baseURL: '/svc/analytics',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

analyticsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type MetricType = 'USERS' | 'PARCHES' | 'EVENTS' | 'MATCHES' | 'ZONES';
export type PatchCategory = 'STUDY' | 'SPORTS' | 'CULTURE' | 'GAMING' | 'FOOD' | 'MUSIC' | 'OTHER';
export type CampusZone = 'BIBLIOTECA' | 'CAFETERIA' | 'CANCHA' | 'SALON' | 'PARQUEADERO' | 'EXTERNO';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type ParticipationLevel = 'EMBAJADOR' | 'CONECTOR' | 'ACTIVO' | 'NUEVO';

export interface AchievementInfo {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  earnedAt: string;
}

export interface StudentDashboardResponse {
  userId: string;
  patchesAttended: number;
  topCategory: PatchCategory;
  weeklyActivity: Partial<Record<DayOfWeek, number>>;
  participationLevel: ParticipationLevel;
  computedAt: string;
  achievementsEarned: number;
  recentAchievements: AchievementInfo[];
  progressToNextLevel: number;
}

export interface SocialIndicatorsResponse {
  weeklyParticipation: Record<string, unknown>;
  networkGrowth: Record<string, unknown>;
  socialAffinity: Record<string, number>;
  activityLevel: string;
}

export interface InteractionAnalyticsResponse {
  totalInteractions: number;
  mostActiveZone: CampusZone;
  peakActivityDay: DayOfWeek;
  interactionSummary: Record<string, number>;
}
export type InstitutionalMetricType = 'EVENTS' | 'PARTICIPATION' | 'SOCIAL_ACTIVITY' | 'ALL';
export type ReportFormat = 'CSV';
export type ScheduleFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface CategoryStat {
  category: string;
  count: number;
  percentage: number;
}

export interface AnalyticsDTO {
  timeSeries: Record<string, number>;
  total: number;
  categories: CategoryStat[];
}

export interface EventAnalyticsDTO {
  eventId: string;
  eventName: string;
  rsvpCount: number;
  rank: number;
  category: string;
}

export interface HeatmapDTO {
  zones: Record<string, Record<string, number>>;
  peakZone: string;
  peakHour: number;
}

export interface AlertDTO {
  metricName: string;
  dropPercentage: number;
  message: string;
}

export interface AdminAnalyticsResponse {
  activeUsers: AnalyticsDTO;
  parcheStats: AnalyticsDTO;
  topEvents: EventAnalyticsDTO[];
  matchSuccessRate: number;
  campusHeatmap: HeatmapDTO;
  retentionRate: number;
  abandonedParches: number;
  avgTimeToFirstMember: number;
  alerts: AlertDTO[];
}

export interface InstitutionalStatsResponse {
  eventsStats: {
    totalCreated: number;
    activeCount: number;
    cancelledCount: number;
    finishedCount: number;
  };
  participationStats: {
    totalActiveStudents: number;
    totalParchesAttended: number;
    totalRsvpConfirmed: number;
    participationTrend: 'GROWING' | 'STABLE' | 'DECLINING';
  };
  socialActivityIndex: number;
}

export interface ReportHistoryDTO {
  reportId: string;
  generatedAt: string;
  metrics: MetricType[];
  downloadUrl: string;
  expiresAt: string;
}

export interface ReportRequestResponse {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
  fileUrl: string;
}

export interface ReportFiltersRequest {
  dateFrom?: string;
  dateTo?: string;
  metrics: MetricType[];
  format?: ReportFormat;
  preview?: boolean;
  schedule?: {
    frequency: ScheduleFrequency;
    deliveryEmail: string;
  };
}

// ─── API calls ───────────────────────────────────────────────────────────────

/** Estudiante — GET /api/v1/analytics/dashboard */
export const getStudentDashboard = async (): Promise<StudentDashboardResponse> => {
  const { data } = await analyticsApi.get<StudentDashboardResponse>('/api/v1/analytics/dashboard');
  return data;
};

/** Estudiante — GET /api/v1/analytics/social-indicators */
export const getSocialIndicators = async (weekRange?: number): Promise<SocialIndicatorsResponse> => {
  const { data } = await analyticsApi.get<SocialIndicatorsResponse>('/api/v1/analytics/social-indicators', {
    params: weekRange !== undefined ? { weekRange } : undefined,
  });
  return data;
};

/** Estudiante — GET /api/v1/analytics/interaction-analytics */
export const getInteractionAnalytics = async (): Promise<InteractionAnalyticsResponse> => {
  const { data } = await analyticsApi.get<InteractionAnalyticsResponse>('/api/v1/analytics/interaction-analytics');
  return data;
};

/** Tab: Análisis — GET /api/v1/analytics/admin */
export const getAdminAnalytics = async (params: {
  startDate?: string;
  endDate?: string;
  metricType?: MetricType;
  facultyFilter?: string;
}): Promise<AdminAnalyticsResponse> => {
  const { data } = await analyticsApi.get<AdminAnalyticsResponse>('/api/v1/analytics/admin', { params });
  return data;
};

/** Tab: Estadísticas Institucionales — GET /api/v1/analytics/institutional */
export const getInstitutionalStats = async (params: {
  startDate?: string;
  endDate?: string;
  metricType?: InstitutionalMetricType;
}): Promise<InstitutionalStatsResponse> => {
  const { data } = await analyticsApi.get<InstitutionalStatsResponse>('/api/v1/analytics/institutional', { params });
  return data;
};

/** Tab: Reportes — POST /api/analytics/reports */
export const generateReport = async (body: ReportFiltersRequest): Promise<ReportRequestResponse> => {
  const { data } = await analyticsApi.post<ReportRequestResponse>('/api/analytics/reports', body);
  return data;
};

/** Tab: Reportes — GET /api/analytics/reports/history */
export const getReportHistory = async (): Promise<ReportHistoryDTO[]> => {
  const { data } = await analyticsApi.get<ReportHistoryDTO[]>('/api/analytics/reports/history');
  return data;
};

/** Tab: Reportes — GET /api/analytics/reports/{id}/download */
export const downloadReport = async (id: string): Promise<string> => {
  const { data } = await analyticsApi.get<string>(`/api/analytics/reports/${id}/download`);
  return data;
};
