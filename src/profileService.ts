import axios from 'axios';

// Estructura resistente: los campos de otros microservicios se declaran opcionales (?)
export interface UserProfileData {
    id: string;
    name: string;
    avatar: string;
    faculty: string;
    semester: number;
    interests: string[];
    xp?: number;
    activeParches?: number;
    streak?: number;
    rankFaculty?: number;
}

// URL base limpia apuntando directamente a la raíz de tu servicio de QA en Azure
const BASE_URL = 'https://patricia-profile-service-qa.ambitiousocean-47ea546c.eastus.azurecontainerapps.io';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const profileService = {
    // 1. Users - Reading: Obtener un usuario por ID (GET /api/v1/users/{userId})
    getUserById: async (userId: string): Promise<UserProfileData> => {
        try {
            const response = await api.get(`/api/v1/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener el usuario ${userId}:`, error);
            throw error;
        }
    },

    // 2. Users - Updating: Actualizar datos del estudiante (PATCH /api/v1/users/student/{userId})
    updateStudentData: async (userId: string, data: Partial<UserProfileData>): Promise<UserProfileData> => {
        try {
            const response = await api.patch(`/api/v1/users/student/${userId}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar datos del usuario ${userId}:`, error);
            throw error;
        }
    },

    // 3. User Profiles: Actualizar XP del estudiante (PATCH /api/v1/users/{userId}/xp)
    updateUserXp: async (userId: string, xpValue: number): Promise<any> => {
        try {
            const response = await api.patch(`/api/v1/users/${userId}/xp`, { xp: xpValue });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar la XP:", error);
            throw error;
        }
    },

    // 4. User Profiles: Añadir una etiqueta/interés (PATCH /api/v1/users/{userId}/tags)
    addTag: async (userId: string, tag: string): Promise<any> => {
        try {
            const response = await api.patch(`/api/v1/users/${userId}/tags`, { tag });
            return response.data;
        } catch (error) {
            console.error("Error al añadir etiqueta:", error);
            throw error;
        }
    },

    // 5. User Profiles: Remover una etiqueta/interés (PATCH /api/v1/users/{userId}/tags/remove)
    removeTag: async (userId: string, tag: string): Promise<any> => {
        try {
            const response = await api.patch(`/api/v1/users/${userId}/tags/remove`, { tag });
            return response.data;
        } catch (error) {
            console.error("Error al remover etiqueta:", error);
            throw error;
        }
    }
};