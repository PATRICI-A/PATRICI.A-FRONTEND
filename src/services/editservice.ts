import { profileService } from './profileService';
import type { CareerEnum } from './profileService';

export interface UIProfileData {
    name: string;
    bio: string;
    faculty: string;
    semester: number;
    secondCareer?: string;
    genero: string;
    privacidad: string;
    interests: string[];
    photo?: File | null;
}

const CAREER_MAP: Record<string, CareerEnum> = {
    'Ingeniería Civil': 'CIVIL_ENGINEERING',
    'Ingeniería Eléctrica': 'ELECTRICAL_ENGINEERING',
    'Ingeniería de Sistemas': 'SYSTEMS_ENGINEERING',
    'Ingeniería Industrial': 'INDUSTRIAL_ENGINEERING',
    'Ingeniería Electrónica': 'ELECTRONIC_ENGINEERING',
    'Economía': 'ECONOMICS',
    'Administración de Empresas': 'BUSINESS_ADMINISTRATION',
    'Matemáticas': 'MATHEMATICS',
    'Ingeniería Mecánica': 'MECHANICAL_ENGINEERING',
    'Ingeniería Biomédica': 'BIOMEDICAL_ENGINEERING',
    'Ingeniería Ambiental': 'ENVIRONMENTAL_ENGINEERING',
    'Ingeniería Estadística': 'STATISTICAL_ENGINEERING',
    'Ingeniería de Inteligencia Artificial': 'AI_ENGINEERING',
    'Ingeniería de Ciberseguridad': 'CYBERSECURITY_ENGINEERING',
    'Ingeniería en Biotecnología': 'BIOTECHNOLOGY_ENGINEERING',
};

const PRIVACY_MAP: Record<string, string> = {
    'PUBLICO': 'PUBLIC',
    'SOLO_MATCHES': 'FRIENDS_ONLY',
    'PRIVADO': 'PRIVATE',
    'PUBLIC': 'PUBLIC',
    'FRIENDS_ONLY': 'FRIENDS_ONLY',
    'PRIVATE': 'PRIVATE',
};

const GENDER_MAP: Record<string, string> = {
    'M': 'MALE',
    'F': 'FEMALE',
    'O': 'OTHER',
    'PREFER_NOT_TO_SAY': 'PREFER_NOT_TO_SAY',
    'MALE': 'MALE',
    'FEMALE': 'FEMALE',
    'OTHER': 'OTHER',
};

export const editService = {
    getProfile: async () => {
        const data = await profileService.getMyProfile();
        if (!data) return null;

        return {
            ...data,
            bio: data.biography || '',
            genero: data.gender || 'M',
            privacidad: data.privacyLevel || 'PUBLICO',
            faculty: data.career || '',
            secondCareer: ''
        };
    },

    updateProfile: async (data: UIProfileData) => {
        const userId = localStorage.getItem('patricia_user_id');
        if (!userId) throw new Error('No user ID found');

        const mappedCareer = CAREER_MAP[data.faculty] ?? data.faculty;
        const mappedPrivacy = PRIVACY_MAP[data.privacidad] ?? 'PUBLIC';
        const mappedGender = GENDER_MAP[data.genero] ?? data.genero;

        // Do not send interests in PATCH — backend expects tag UUIDs via addTag separately
        const payload: Record<string, any> = {
            name: data.name,
            biography: data.bio,
            career: mappedCareer,
            semester: data.semester,
            gender: mappedGender,
            privacyLevel: mappedPrivacy,
        };
        if (data.secondCareer) payload.secondaryCareer = data.secondCareer;

        const result = await profileService.updateProfile(userId, payload);

        // Resolve interest labels to tag IDs and add them
        if (data.interests && data.interests.length > 0) {
            try {
                const catalog = await profileService.getTagsCatalog();
                const labelToId = new Map<string, string>();
                for (const cat of catalog) {
                    for (const tag of cat.tags) {
                        labelToId.set(tag.name, tag.id);
                    }
                }
                const tagIds = data.interests
                    .map(key => { const [, label] = key.split('::'); return label ? labelToId.get(label) : labelToId.get(key); })
                    .filter((id): id is string => Boolean(id));
                await Promise.all(tagIds.map(tagId => profileService.addTag(userId, tagId)));
            } catch {
                // non-blocking: tag update failure doesn't fail the save
            }
        }

        return result;
    }
};
