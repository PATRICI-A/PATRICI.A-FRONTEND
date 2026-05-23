import axios from 'axios';

const BASE_URL = '/svc/wellness';

const wellnessApi = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

wellnessApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type WellnessApiCategory =
  | 'EMOTIONAL_SUPPORT'
  | 'SPORTS'
  | 'CULTURE'
  | 'HEALTH'
  | 'RECOMMENDATIONS'
  | 'ALL';

export type ReportType =
  | 'HARASSMENT'
  | 'INAPPROPRIATE_BEHAVIOR'
  | 'OFFENSIVE_CONTENT';

export type ReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface WellnessResourceResponse {
  id: string;
  name: string;
  description: string;
  category: WellnessApiCategory;
  location: string;
  contactInfo: string;
  schedule?: string;
  available: boolean;
  appointmentEmail?: string;
  psychologistName?: string;
  recommendationReason?: string;
  createdAt: string;
}

export interface SurveyQuestion {
  questionId: string;
  questionText: string;
  options: string[];
}

export interface SurveyAnswerRequest {
  questionId: string;
  answer: string;
}

export interface SurveySubmitResponse {
  surveyId: string;
  recommendedCategories: Array<{ category: string; score: number; reason: string }>;
  message: string;
  submittedAt: string;
}

export interface BehaviorReport {
  id: string;
  caseNumber: string;
  message: string;
  reporterId: string;
  reportType: ReportType;
  description: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

// Mapping from API category to frontend tab keys used in WellnessPage
export const API_TO_FRONTEND_CATEGORY: Record<string, string> = {
  HEALTH: 'SALUD',
  SPORTS: 'DEPORTE',
  CULTURE: 'CULTURA',
  EMOTIONAL_SUPPORT: 'MENTAL_HEALTH',
  RECOMMENDATIONS: 'RECOMMENDATIONS',
};

// ── Service ───────────────────────────────────────────────────────────────────

export const wellnessService = {
  async getResources(category?: WellnessApiCategory): Promise<WellnessResourceResponse[]> {
    try {
      const params = category && category !== 'ALL' ? { category } : undefined;
      const { data } = await wellnessApi.get<any>('/api/v1/wellness/resources', { params });
      if (Array.isArray(data)) return data;
      return data?.content ?? data?.resources ?? data?.data ?? [];
    } catch {
      return [];
    }
  },

  async getResourceById(id: string): Promise<WellnessResourceResponse | null> {
    try {
      const { data } = await wellnessApi.get<WellnessResourceResponse>(`/api/v1/wellness/resources/${id}`);
      return data;
    } catch {
      return null;
    }
  },

  async getAppointmentMailto(id: string): Promise<{ appointmentEmailTo: string; appointmentEmailSubject: string; appointmentEmailBody: string } | null> {
    try {
      const { data } = await wellnessApi.get(`/api/v1/wellness/resources/${id}/cita-mailto`);
      return data;
    } catch {
      return null;
    }
  },

  async getSurveyQuestions(): Promise<SurveyQuestion[]> {
    try {
      const { data } = await wellnessApi.get<SurveyQuestion[]>('/api/v1/bienestar/encuesta/preguntas');
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  async submitSurvey(responses: SurveyAnswerRequest[]): Promise<SurveySubmitResponse | null> {
    try {
      const { data } = await wellnessApi.post<SurveySubmitResponse>('/api/v1/bienestar/encuesta', {
        surveyResponses: responses,
      });
      return data;
    } catch {
      return null;
    }
  },

  async getRecommendations(): Promise<WellnessResourceResponse[]> {
    try {
      const { data } = await wellnessApi.get<any>('/api/v1/bienestar/encuesta/recomendaciones');
      if (Array.isArray(data)) return data;
      return data?.content ?? data?.recommendations ?? data?.data ?? [];
    } catch {
      return [];
    }
  },

  async submitReport(reportType: ReportType, description: string, referenceId?: string): Promise<BehaviorReport | null> {
    try {
      const { data } = await wellnessApi.post<BehaviorReport>('/api/v1/wellness/reports', {
        reportType,
        description,
        ...(referenceId ? { referenceId } : {}),
      });
      return data;
    } catch {
      return null;
    }
  },

  async getMyReports(): Promise<BehaviorReport[]> {
    try {
      const { data } = await wellnessApi.get<any>('/api/v1/wellness/reports/my-reports');
      if (Array.isArray(data)) return data;
      return data?.content ?? data?.reports ?? data?.data ?? [];
    } catch {
      return [];
    }
  },
};
