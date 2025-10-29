import { apiClient, AuthManager } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { 
  CustomerAuthResponse, 
  LoginCustomerRequest, 
  RegisterCustomerRequest, 
  ApiResponse 
} from '@/types/api';

export class AuthService {
  async login(credentials: LoginCustomerRequest): Promise<CustomerAuthResponse> {
    const response = await apiClient.post<CustomerAuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)

    if (!response || !response.success) {
      throw new Error(response?.message || 'Login failed')
    }

    const data = response.data
    if (data) {
      // Persist both access and refresh tokens when provided
      AuthManager.setTokens(data.access_token, data.refresh_token)
      apiClient.setAuthToken(data.access_token)
    }

    return data
  }

  async register(userData: RegisterCustomerRequest): Promise<CustomerAuthResponse> {
    const response = await apiClient.post<CustomerAuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData)

    if (!response || !response.success) {
      throw new Error(response?.message || 'Registration failed')
    }

    const data = response.data
    if (data) {
      AuthManager.setTokens(data.access_token, data.refresh_token)
      apiClient.setAuthToken(data.access_token)
    }

    return data
  }

  async logout(): Promise<void> {
    try {
      // Note: No logout endpoint in API doc, just clear local tokens
      console.info('Logging out user');
    } catch (error) {
      console.warn('Logout process failed:', error);
    } finally {
      // Always clear local tokens
      apiClient.clearAuthToken();
    }
  }

  async getProfile(): Promise<CustomerAuthResponse> {
    const response = await apiClient.get<CustomerAuthResponse>(API_ENDPOINTS.AUTH.ME)
    if (!response || !response.success) throw new Error(response?.message || 'Failed to fetch profile')
    return response.data
  }

  async updateProfile(userData: Partial<RegisterCustomerRequest>): Promise<CustomerAuthResponse> {
    const response = await apiClient.put<CustomerAuthResponse>(API_ENDPOINTS.AUTH.ME, userData)
    if (!response || !response.success) throw new Error(response?.message || 'Failed to update profile')
    return response.data
  }

  async loginWithGoogle(token: string): Promise<CustomerAuthResponse> {
    const response = await apiClient.post<CustomerAuthResponse>(API_ENDPOINTS.AUTH.LOGIN_WITH_GOOGLE, { id_token: token })
    if (!response || !response.success) throw new Error(response?.message || 'Google login failed')
    const data = response.data
    if (data) {
      AuthManager.setTokens(data.access_token, data.refresh_token)
      apiClient.setAuthToken(data.access_token)
    }
    return data
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authService = new AuthService();