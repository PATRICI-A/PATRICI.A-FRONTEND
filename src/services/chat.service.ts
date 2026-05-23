import axios from 'axios';

// Dedicated axios instance for the chat microservice
const chatApi = axios.create({
  baseURL: import.meta.env.VITE_CHAT_API_URL ?? 'https://patricia-chat-service-prod.ambitiousocean-47ea546c.eastus.azurecontainerapps.io',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patricia-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Some backend services authorize chat actions using the current user id header.
  try {
    const storedUser = localStorage.getItem('patricia-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as { studentId?: string; id?: string };
      const headerUserId = parsedUser.studentId || parsedUser.id;
      if (headerUserId) {
        config.headers['X-User-Id'] = headerUserId;
      }
    }
  } catch {
    // ignore malformed local user cache
  }

  if (!config.headers['X-User-Id']) {
    const fallbackUserId = localStorage.getItem('patricia_user_id');
    if (fallbackUserId) {
      config.headers['X-User-Id'] = fallbackUserId;
    }
  }

  return config;
});

chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('patricia-token');
      localStorage.removeItem('patricia-refresh-token');
      localStorage.removeItem('patricia-logged-in');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function normalizeMessageResponse(data: unknown): MessageResponse | null {
  if (!data || typeof data !== 'object') return null;

  const candidate = data as Partial<MessageResponse> & {
    message?: Partial<MessageResponse>;
    data?: Partial<MessageResponse>;
  };

  if (candidate.id && candidate.content !== undefined) {
    return candidate as MessageResponse;
  }

  if (candidate.message?.id && candidate.message.content !== undefined) {
    return candidate.message as MessageResponse;
  }

  if (candidate.data?.id && candidate.data.content !== undefined) {
    return candidate.data as MessageResponse;
  }

  return null;
}

// ─── OpenAPI Types ─────────────────────────────────────────────────────────────

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
export type MessageType = 'TEXT' | 'IMAGE';

export interface ConnectionResponse {
  id: string; // uuid
  requesterId: string; // uuid
  addresseeId: string; // uuid
  status: ConnectionStatus;
  createdAt: string; // date-time
  updatedAt: string; // date-time
}

export interface MessageResponse {
  id: string; // uuid
  parcheId: string | null; // uuid
  senderId: string; // uuid
  receiverId: string | null; // uuid
  senderName: string;
  content: string;
  type: MessageType;
  imageUrl: string | null;
  sentAt: string; // date-time
}

export interface PageableObject {
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  offset: number;
  sort: Array<{
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
  }>;
}

export interface PageMessageResponse {
  totalPages: number;
  totalElements: number;
  pageable: PageableObject;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: MessageResponse[];
  number: number;
  sort: Array<{
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
  }>;
  empty: boolean;
}

// ─── API endpoints ─────────────────────────────────────────────────────────────

export const chatService = {
  /**
   * GET /api/parches/{parcheId}/messages
   * Retrieves a paginated list of chat messages for a specific Parche.
   */
  async fetchParcheMessages(parcheId: string, page = 0, size = 20): Promise<PageMessageResponse> {
    const { data } = await chatApi.get<PageMessageResponse>(`/api/parches/${parcheId}/messages`, {
      params: { page, size }
    });
    return data;
  },

  /**
   * GET /api/friends/{friendId}/messages
   * Retrieves a paginated list of chat messages for a private chat with a friend.
   */
  async fetchFriendMessages(friendId: string, page = 0, size = 20): Promise<PageMessageResponse> {
    const { data } = await chatApi.get<PageMessageResponse>(`/api/friends/${friendId}/messages`, {
      params: { page, size }
    });
    return data;
  },

  /**
   * POST /api/parches/{parcheId}/messages
   * Sends a new chat message to a specific Parche group.
   */
  async sendParcheMessage(parcheId: string, content: string, imageUrl?: string): Promise<MessageResponse | null> {
    const { data } = await chatApi.post(`/api/parches/${parcheId}/messages`, {
      content,
      type: imageUrl ? 'IMAGE' : 'TEXT',
      imageUrl: imageUrl || null
    });
    return normalizeMessageResponse(data);
  },

  /**
   * POST /api/friends/{friendId}/messages
   * Sends a new private message to a specific friend.
   */
  async sendFriendMessage(friendId: string, content: string, imageUrl?: string): Promise<MessageResponse | null> {
    const { data } = await chatApi.post(`/api/friends/${friendId}/messages`, {
      content,
      type: imageUrl ? 'IMAGE' : 'TEXT',
      imageUrl: imageUrl || null
    });
    return normalizeMessageResponse(data);
  },

  /**
   * POST /api/connections/request
   * Sends a new friend request to a specified user.
   */
  async sendConnectionRequest(addresseeId: string): Promise<ConnectionResponse> {
    const { data } = await chatApi.post<ConnectionResponse>('/api/connections/request', {
      addresseeId
    });
    return data;
  },

  /**
   * PATCH /api/connections/{connectionId}
   * Respond to a friend/connection request (ACCEPTED, REJECTED, BLOCKED).
   */
  async respondToConnection(connectionId: string, status: ConnectionStatus): Promise<ConnectionResponse> {
    const { data } = await chatApi.patch<ConnectionResponse>(`/api/connections/${connectionId}`, {
      status
    });
    return data;
  },

  /**
   * GET /api/connections
   * Lists all accepted friend connections for the current user.
   */
  async getActiveConnections(): Promise<ConnectionResponse[]> {
    const { data } = await chatApi.get<ConnectionResponse[]>('/api/connections');
    return data;
  },

  /**
   * GET /api/connections/pending
   * Lists all friend requests awaiting the user's response.
   */
  async getPendingConnections(): Promise<ConnectionResponse[]> {
    const { data } = await chatApi.get<ConnectionResponse[]>('/api/connections/pending');
    return data;
  },
};
