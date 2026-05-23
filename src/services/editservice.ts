import { profileService } from './profileService';

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

export const editService = {
    getProfile: async () => {
        const data = await profileService.getMyProfile();
        if (!data) return null;

        // Mapeo: Backend -> UI
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
        const payload = {
            name: data.name,
            biography: data.bio,
            career: data.faculty,
            secondaryCareer: data.secondCareer,
            semester: data.semester,
            gender: data.genero,
            privacyLevel: data.privacidad,
            interests: data.interests
        };
        return await profileService.updateProfile(userId, payload);
    }
};