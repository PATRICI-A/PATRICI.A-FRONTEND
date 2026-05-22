export interface UserProfileData {
    career: string;
    privacyLevel: string;
    gender: string;
    biography: string;
    id: string;
    name: string;
    avatar?: string;
    faculty: string;
    semester: number;
    xp: number;
    activeParches: number;
    streak: number;
    rankFaculty: number;
    interests: string[];
    isAvailable?: boolean;
}

export interface UpdateProfileData {
    name?: string;
    biography?: string;      // API espera 'biography'
    career?: string;         // API espera 'career'
    secondaryCareer?: string;
    semester?: number;
    gender?: string;
    privacyLevel?: string;
    interests?: string[];
}

const API_BASE_URL = 'https://patricia-api-gateway-qa.ambitiousocean-47ea546c.eastus.azurecontainerapps.io/api/v1';

// TU TOKEN Y TU ID QUEMADOS Y FUNCIONANDO
const HARDCODED_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyY2ZiYjQ5NC04MjhkLTQzMDItYTY5MC1hMTE1YzE2MTM0NWQiLCJpc3MiOiJwYXRyaWNpYS1hdXRoLXNlcnZpY2UiLCJlbWFpbCI6ImplaW1teS50b3JyZXMtbUBtYWlsLmVzY3VlbGFpbmcuZWR1LmNvIiwiaWF0IjoxNzc5NDgwODA1LCJleHAiOjE3Nzk0ODE3MDV9.hVYwo7XPr3jEN5gJSVaU-5Bd5JPCW5aBTRFELwExwzU";
const USER_ID = "6dd81b37-412d-46da-a591-66cc091f6606";

export const profileService = {

    // 1. OBTENER LOS DATOS DE TEXTO
    getMyProfile: async (): Promise<UserProfileData | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USER_ID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${HARDCODED_TOKEN}`
                },
            });
            if (!response.ok) throw new Error("Error al obtener perfil");
            return await response.json();
        } catch (error) {
            console.error("Fallo:", error);
            return null;
        }
    },

    updateProfile: async (data: UpdateProfileData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USER_ID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${HARDCODED_TOKEN}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Error al actualizar");
            return await response.json();
        } catch (error) {
            console.error("Fallo al actualizar:", error);
            throw error;
        }
    },

    // 2. OBTENER LA IMAGEN DEL PERFIL EXACTA DE SWAGGER
    getProfileImage: async (): Promise<string | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${USER_ID}/profile-image`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${HARDCODED_TOKEN}`
                },
            });

            if (!response.ok) return null;

            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Error al descargar la imagen:", error);
            return null;
        }
    },

    // 3. OBTENER CATÁLOGO DE TAGS
    getTagsCatalog: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/tags/catalog`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${HARDCODED_TOKEN}`
                }
            });
            if (!response.ok) return [];
            return await response.json();
        } catch (error) {
            return [];
        }
    }
};