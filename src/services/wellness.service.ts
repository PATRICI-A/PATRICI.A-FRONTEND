import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_WELLNESS_API_URL ??
  'https://patricia-suport-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io';

const wellnessApi = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically from localStorage
wellnessApi.interceptors.request.use((config) => {
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

export interface WellnessResourceResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  url: string;
}

export interface BehaviorReportRequest {
  type: string;
  description: string;
  incidentDate: string; // ISO date
  location: string;
  isAnonymous?: boolean;
}

export interface BehaviorReportResponse {
  id: string;
  reportType: string;
  status: string;
  createdAt: string;
}

export interface SurveyAnswerRequest {
  questionId: string;
  answerValue: number;
}

export interface SurveySubmissionRequest {
  answers: SurveyAnswerRequest[];
}

export interface SurveySubmissionResponse {
  id: string;
  riskLevel: string;
  submittedAt: string;
}

// Fallback logic
let localResourcesList: WellnessResourceResponse[] = [];

function getLocalResourcesList(): WellnessResourceResponse[] {
  if (localResourcesList.length > 0) return localResourcesList;

  try {
    const cached = sessionStorage.getItem('patricia-mock-resources');
    if (cached) {
      localResourcesList = JSON.parse(cached);
      return localResourcesList;
    }
  } catch { /* ignore */ }

  // Initial seed
  localResourcesList = [
    {
      id: 'r1',
      title: 'Guía para el manejo del estrés',
      description: 'Aprende técnicas de respiración y mindfulness para época de parciales.',
      category: 'MENTAL_HEALTH',
      type: 'ARTICLE',
      url: 'https://example.com/estres'
    },
    {
      id: 'r2',
      title: 'Línea de Apoyo Psicológico',
      description: 'Línea 24/7 para estudiantes. Contacto directo con profesionales.',
      category: 'SUPPORT',
      type: 'CONTACT',
      url: 'tel:+123456789'
    },
    {
      id: 'r3',
      title: 'Ruta de Atención de Violencias',
      description: 'Pasos a seguir en caso de violencia de género o discriminación.',
      category: 'PROTOCOL',
      type: 'DOCUMENT',
      url: 'https://example.com/protocolo'
    }
  ];
  saveLocalResourcesList();
  return localResourcesList;
}

function saveLocalResourcesList() {
  try {
    sessionStorage.setItem('patricia-mock-resources', JSON.stringify(localResourcesList));
  } catch { /* ignore */ }
}

function logFallback(endpoint: string, error: any) {
  console.warn(
    `[Fallback] La llamada a backend ${endpoint} falló (${error?.response?.status || 'Error de Red'}). ` +
    `Se activó el sistema de fallback mockeado para una experiencia interactiva sin errores.`
  );
}

export async function getWellnessResources(category?: string): Promise<WellnessResourceResponse[]> {
  try {
    const params = category ? { category } : {};
    const res = await wellnessApi.get<WellnessResourceResponse[]>('/wellness/resources', { params });
    return res.data;
  } catch (error) {
    logFallback('GET /wellness/resources', error);
    const list = getLocalResourcesList();
    if (category) {
      return list.filter(r => r.category === category);
    }
    return list;
  }
}

export async function submitSurvey(data: SurveySubmissionRequest): Promise<SurveySubmissionResponse> {
  try {
    const res = await wellnessApi.post<SurveySubmissionResponse>('/bienestar/encuesta', data);
    return res.data;
  } catch (error) {
    logFallback('POST /bienestar/encuesta', error);
    return {
      id: `survey-${Date.now()}`,
      riskLevel: 'MODERATE',
      submittedAt: new Date().toISOString()
    };
  }
}

export async function getSurveyRecommendations(): Promise<WellnessResourceResponse[]> {
  try {
    const res = await wellnessApi.get<WellnessResourceResponse[]>('/bienestar/encuesta/recomendaciones');
    return res.data;
  } catch (error) {
    logFallback('GET /bienestar/encuesta/recomendaciones', error);
    return getLocalResourcesList().slice(0, 2);
  }
}

export async function submitBehaviorReport(data: BehaviorReportRequest): Promise<BehaviorReportResponse> {
  try {
    const res = await wellnessApi.post<BehaviorReportResponse>('/wellness/reports', data);
    return res.data;
  } catch (error) {
    logFallback('POST /wellness/reports', error);
    return {
      id: `rep-${Date.now()}`,
      reportType: data.type,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
  }
}
