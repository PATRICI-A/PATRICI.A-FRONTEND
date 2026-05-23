import { create } from 'zustand';
import { matchingService } from '../services/matchingService';
import { profileService } from '../services/profileService';
import type { BatchProfileResponse, UserMatchProfileDto } from '../services/profileService';

export interface EnrichedMatchUser {
  id: string;
  name: string;
  bio?: string;
  photoUrl?: string;
  career?: string;
  semester: number;
  tags: string[];
  active: boolean;
  matchPercent: number;
  matchId?: string;
  connectionStatus: 'none' | 'pending' | 'connected';
}

type Tab = 'explore' | 'sent' | 'received' | 'friends';

interface MatchingState {
  explore: EnrichedMatchUser[];
  sent: EnrichedMatchUser[];
  received: EnrichedMatchUser[];
  friends: EnrichedMatchUser[];
  loading: Record<Tab, boolean>;
  error: string | null;

  loadTab: (tab: Tab) => Promise<void>;
  sendRequest: (targetId: string) => Promise<void>;
  acceptRequest: (matchId: string) => Promise<void>;
  rejectRequest: (matchId: string) => Promise<void>;
  removeMatch: (matchId: string) => Promise<void>;
}

function enrichUser(
  userId: string,
  profileMap: Map<string, BatchProfileResponse>,
  candidateMap: Map<string, UserMatchProfileDto>,
  matchPercent: number,
  matchId?: string,
  connectionStatus: 'none' | 'pending' | 'connected' = 'none'
): EnrichedMatchUser {
  const p = profileMap.get(userId);
  const c = candidateMap.get(userId);
  return {
    id: userId,
    name: p?.name ?? 'Usuario',
    bio: p?.biography,
    photoUrl: p?.photoUrl,
    career: c?.career,
    semester: c?.semester ?? 0,
    tags: c?.tags ?? [],
    active: c?.active ?? false,
    matchPercent,
    matchId,
    connectionStatus,
  };
}

export const useMatchingStore = create<MatchingState>((set, get) => ({
  explore: [],
  sent: [],
  received: [],
  friends: [],
  loading: { explore: false, sent: false, received: false, friends: false },
  error: null,

  async loadTab(tab) {
    const currentUserId = localStorage.getItem('patricia_user_id');
    if (!currentUserId) return;

    set(s => ({ loading: { ...s.loading, [tab]: true }, error: null }));

    try {
      if (tab === 'explore') {
        const [candidates, scores] = await Promise.all([
          profileService.getMatchingCandidates(currentUserId),
          matchingService.getRecommendationsWithScores(currentUserId),
        ]);
        const scoreMap = new Map(scores.map(s => [s.targetUserId, s.totalScore]));
        const allIds = candidates.map(c => c.id);
        const profiles = await profileService.getBatchProfiles(allIds);
        const profileMap = new Map(profiles.map(p => [p.id, p]));
        const candidateMap = new Map(candidates.map(c => [c.id, c]));

        set({
          explore: candidates.map(c =>
            enrichUser(c.id, profileMap, candidateMap, scoreMap.get(c.id) ?? 50)
          ),
        });
      } else if (tab === 'sent') {
        const sentMatches = await matchingService.getSentRequests(currentUserId);
        const targetIds = sentMatches.map(m => m.targetId);
        const profiles = await profileService.getBatchProfiles(targetIds);
        const profileMap = new Map(profiles.map(p => [p.id, p]));

        set({
          sent: sentMatches.map(m =>
            enrichUser(m.targetId, profileMap, new Map(), m.affinityScore?.score ?? 50, m.idMatch, 'pending')
          ),
        });
      } else if (tab === 'received') {
        const receivedMatches = await matchingService.getReceivedRequests(currentUserId);
        const requesterIds = receivedMatches.map(m => m.requesterId);
        const profiles = await profileService.getBatchProfiles(requesterIds);
        const profileMap = new Map(profiles.map(p => [p.id, p]));

        set({
          received: receivedMatches.map(m =>
            enrichUser(m.requesterId, profileMap, new Map(), m.affinityScore?.score ?? 50, m.idMatch, 'pending')
          ),
        });
      } else {
        const allMatches = await matchingService.getUserMatches(currentUserId);
        const accepted = allMatches.filter(m => m.status === 'ACCEPTED');
        const friendIds = accepted.map(m =>
          m.requesterId === currentUserId ? m.targetId : m.requesterId
        );
        const profiles = await profileService.getBatchProfiles(friendIds);
        const profileMap = new Map(profiles.map(p => [p.id, p]));

        set({
          friends: accepted.map(m => {
            const friendId = m.requesterId === currentUserId ? m.targetId : m.requesterId;
            return enrichUser(friendId, profileMap, new Map(), m.affinityScore?.score ?? 50, m.idMatch, 'connected');
          }),
        });
      }
    } catch {
      set({ error: 'Error cargando datos. Intenta de nuevo.' });
    } finally {
      set(s => ({ loading: { ...s.loading, [tab]: false } }));
    }
  },

  async sendRequest(targetId) {
    const currentUserId = localStorage.getItem('patricia_user_id');
    if (!currentUserId) return;

    const match = await matchingService.sendRequest(currentUserId, targetId);

    set(s => {
      const user = s.explore.find(u => u.id === targetId);
      if (!user) return s;
      return {
        explore: s.explore.filter(u => u.id !== targetId),
        sent: [...s.sent, { ...user, matchId: match.idMatch, connectionStatus: 'pending' as const }],
      };
    });
  },

  async acceptRequest(matchId) {
    await matchingService.updateMatchStatus(matchId, 'ACCEPTED');
    set(s => {
      const user = s.received.find(u => u.matchId === matchId);
      if (!user) return s;
      return {
        received: s.received.filter(u => u.matchId !== matchId),
        friends: [...s.friends, { ...user, connectionStatus: 'connected' as const }],
      };
    });
  },

  async rejectRequest(matchId) {
    await matchingService.updateMatchStatus(matchId, 'REJECTED');
    set(s => ({
      received: s.received.filter(u => u.matchId !== matchId),
    }));
  },

  async removeMatch(matchId) {
    await matchingService.deleteMatch(matchId);
    set(s => ({
      friends: s.friends.filter(u => u.matchId !== matchId),
      sent: s.sent.filter(u => u.matchId !== matchId),
    }));
  },
}));
