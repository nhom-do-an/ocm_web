import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { BeneficiaryAccountDetail, ApiResponse } from '@/types/api';

export class BeneficiaryAccountsService {
  async getBeneficiaryAccounts(): Promise<BeneficiaryAccountDetail[]> {
    const response = await apiClient.get<BeneficiaryAccountDetail[]>(
      API_ENDPOINTS.BENEFICIARY_ACCOUNTS.LIST
    );
    if (!response || !response.success) {
      throw new Error(
        response?.message || 'Failed to fetch beneficiary accounts'
      );
    }
    return response.data;
  }
}

export const beneficiaryAccountsService = new BeneficiaryAccountsService();


