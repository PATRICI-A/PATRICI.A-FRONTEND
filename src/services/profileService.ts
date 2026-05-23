import axios from 'axios';

const profileApi = axios.create({
  baseURL: 'https://patricia-profile-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

profileApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

profileApi.interceptors.response.use(
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

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  gender: string;
  userType: string;
}

export interface BatchProfileResponse {
  id: string;
  name: string;
  email: string;
  biography?: string;
  photoUrl?: string;
}

export interface UserMatchProfileDto {
  id: string;
  career?: string;
  semester: number;
  tags: string[];
  schedulesAvailable: string[];
  active: boolean;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  career?: string;
  secondaryCareer?: string;
  semester: number;
  gender: string;
  biography?: string;
  photoUrl?: string;
  avatar?: string;
  privacyLevel?: string;
  faculty?: string;
  xp?: number;
  activeParches?: number;
  streak?: number;
  rankFaculty?: number;
  interests?: string[];
  isAvailable?: boolean;
}

export interface UpdateProfileData {
  name?: string;
  biography?: string;
  career?: string;
  secondaryCareer?: string;
  semester?: number;
  gender?: string;
  privacyLevel?: string;
  interests?: string[];
}

export type CareerEnum =
  | 'CIVIL_ENGINEERING'
  | 'ELECTRICAL_ENGINEERING'
  | 'SYSTEMS_ENGINEERING'
  | 'INDUSTRIAL_ENGINEERING'
  | 'ELECTRONIC_ENGINEERING'
  | 'ECONOMICS'
  | 'BUSINESS_ADMINISTRATION'
  | 'MATHEMATICS'
  | 'MECHANICAL_ENGINEERING'
  | 'BIOMEDICAL_ENGINEERING'
  | 'ENVIRONMENTAL_ENGINEERING'
  | 'STATISTICAL_ENGINEERING'
  | 'AI_ENGINEERING'
  | 'CYBERSECURITY_ENGINEERING'
  | 'BIOTECHNOLOGY_ENGINEERING';

export interface UserStudentRequest {
  name: string;
  email: string;
  password: string;
  gender: string;
  career: CareerEnum;
  semester: number;
  studentCarnet: string;
  dateOfBirth: string;
  privacyLevel?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
  geolocationEnabled?: boolean;
  photourl?: string;
  biography?: string;
}

export interface TagSummaryResponse {
  id: string;
  name: string;
}

export interface CategoryWithTagsResponse {
  id: string;
  name: string;
  tags: TagSummaryResponse[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const profileService = {
  async getUserByEmail(email: string): Promise<UserResponse> {
    const { data } = await profileApi.get<UserResponse>(
      `/api/v1/users/mail/${encodeURIComponent(email)}`
    );
    return data;
  },

  async getUserById(userId: string): Promise<UserResponse> {
    const { data } = await profileApi.get<UserResponse>(`/api/v1/users/${userId}`);
    return data;
  },

  async getMyProfile(userId?: string): Promise<UserProfileData | null> {
    const id = userId ?? localStorage.getItem('patricia_user_id');
    if (!id) return null;
    const { data } = await profileApi.get<UserProfileData>(`/api/v1/users/${id}`);
    return data;
  },

  async updateProfile(userId: string, payload: UpdateProfileData): Promise<UserProfileData> {
    const { data } = await profileApi.patch<UserProfileData>(`/api/v1/users/${userId}`, payload);
    return data;
  },

  async getProfileImage(userId?: string): Promise<string | null> {
    const id = userId ?? localStorage.getItem('patricia_user_id');
    if (!id) return null;
    try {
      const response = await profileApi.get(`/api/v1/users/${id}/profile-image`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch {
      return null;
    }
  },

  async getBatchProfiles(ids: string[]): Promise<BatchProfileResponse[]> {
    if (ids.length === 0) return [];
    const { data } = await profileApi.post<BatchProfileResponse[]>('/api/v1/users/batch', { ids });
    return data;
  },

  async getMatchingCandidates(userId: string): Promise<UserMatchProfileDto[]> {
    const { data } = await profileApi.get<UserMatchProfileDto[]>(
      `/api/v1/internal/matching/profiles/candidates/${userId}`
    );
    return data;
  },

  async createStudent(payload: UserStudentRequest): Promise<UserResponse> {
    const { data } = await profileApi.post<UserResponse>('/api/v1/users/student', payload);
    return data;
  },

  async getTagsCatalog(): Promise<CategoryWithTagsResponse[]> {
    const { data } = await profileApi.get<CategoryWithTagsResponse[]>('/api/v1/users/tags/catalog');
    return data;
  },

  async addTag(userId: string, tagId: string): Promise<void> {
    await profileApi.patch(`/api/v1/users/${userId}/tags`, { tagId });
  },
};
