import api from './http';
import type { ChatMessage, DirectChat, Parche } from '../types/mockData';

export interface SendMessagePayload {
  content: string;
  type: 'text' | 'image' | 'system';
  imageUrl?: string;
}

export interface ReportMessagePayload {
  reason: string;
  description: string;
}

export const chatService = {
  /**
   * Obtiene la lista de chats directos activos del usuario
   */
  async fetchDirectChats(): Promise<DirectChat[]> {
    const { data } = await api.get<DirectChat[]>('/chats/direct');
    return data;
  },

  /**
   * Obtiene la lista de parches (grupos) a los que se ha unido el usuario
   */
  async fetchJoinedParches(): Promise<Parche[]> {
    const { data } = await api.get<Parche[]>('/parches/joined');
    return data;
  },

  /**
   * Obtiene el historial de mensajes de un chat específico (sea directo o grupal)
   * @param chatId ID del chat/parche
   */
  async fetchMessages(chatId: string): Promise<ChatMessage[]> {
    const { data } = await api.get<ChatMessage[]>(`/chats/${chatId}/messages`);
    return data;
  },

  /**
   * Envía un mensaje nuevo a un chat específico
   * @param chatId ID del chat/parche
   * @param payload Datos del mensaje (contenido, tipo, url opcional de imagen)
   */
  async sendMessage(chatId: string, payload: SendMessagePayload): Promise<ChatMessage> {
    const { data } = await api.post<ChatMessage>(`/chats/${chatId}/messages`, payload);
    return data;
  },

  /**
   * Silencia o activa las notificaciones de un chat específico
   * @param chatId ID del chat
   * @param mute boolean indicando si se silencia o no
   */
  async toggleMute(chatId: string, mute: boolean): Promise<{ muted: boolean }> {
    const { data } = await api.post<{ muted: boolean }>(`/chats/${chatId}/mute`, { mute });
    return data;
  },

  /**
   * Vacía el historial de mensajes de un chat para el usuario actual
   * @param chatId ID del chat
   */
  async clearChatHistory(chatId: string): Promise<void> {
    await api.delete(`/chats/${chatId}/messages`);
  },

  /**
   * Envía un reporte sobre un mensaje inapropiado o problemático
   * @param messageId ID del mensaje a reportar
   * @param payload Información del reporte (motivo y descripción adicional)
   */
  async reportMessage(messageId: string, payload: ReportMessagePayload): Promise<void> {
    await api.post(`/messages/${messageId}/report`, payload);
  },

  /**
   * Envía un reporte sobre un parche o grupo completo
   * @param parcheId ID del parche
   * @param payload Información del reporte
   */
  async reportParche(parcheId: string, payload: ReportMessagePayload): Promise<void> {
    await api.post(`/parches/${parcheId}/report`, payload);
  }
};
