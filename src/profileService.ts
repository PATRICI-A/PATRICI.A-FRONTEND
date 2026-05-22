
export interface UserProfileData {
    id: string;
    name: string;
    avatar?: string; // Aquí guardaremos la URL de la imagen descargada
    faculty: string;
    semester: number;
    xp: number;
    activeParches: number;
    streak: number;
    rankFaculty: number;
    interests: string[];
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${HARDCODED_TOKEN}`
                },
            });

            if (!response.ok) throw new Error("Error del API");

            const data = await response.json();

            return {
                id: data.id || USER_ID,
                name: data.name || 'Jeimmy Torres',
                avatar: '', // Arranca vacío hasta que descarguemos la imagen real
                faculty: data.faculty || 'Ingeniería de Sistemas',
                semester: Number(data.semester) || 1,
                xp: Number(data.xp) || 0,
                activeParches: Number(data.activeParches || data.active_parches) || 0,
                streak: Number(data.streak) || 0,
                rankFaculty: Number(data.rankFaculty || data.rank_faculty) || 1,
                interests: Array.isArray(data.interests) ? data.interests : [],
            };
        } catch (error) {
            console.error("Fallo al conectar con QA:", error);
            return null;
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

            if (!response.ok) return null; // Si no tiene foto, no rompe nada

            // La imagen viaja como archivo binario (Blob)
            const blob = await response.blob();
            return URL.createObjectURL(blob); // Esto crea una URL local para que React la pueda pintar
        } catch (error) {
            console.error("Error al descargar la imagen:", error);
            return null;
        }
    },


    // 3. OBTENER CATÁLOGO DE TAGS (Listo para tu página de Editar Perfil)
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