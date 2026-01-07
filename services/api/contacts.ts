import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types/api';
import { Contact } from '@/types/contact';

export const contactsService = {
  getContacts: async (): Promise<ApiResponse<Contact[]>> => {
    return apiClient.get<Contact[]>(API_ENDPOINTS.CONTACTS.LIST);
  },
};
