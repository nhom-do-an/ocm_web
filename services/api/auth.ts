import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { 
  UserAuthResponse, 
  UserLoginRequest, 
  UserRegisterRequest, 
  ApiResponse 
} from '@/types/api';

export class AuthService {
  async login(credentials: UserLoginRequest): Promise<UserAuthResponse> {
    const response = await apiClient.post<UserAuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    
    if (response.success && response.data) {
      // Store tokens if login successful
      if (response.data.access_token) {
        apiClient.setAuthToken(response.data.access_token);
      }
    }
    
    return response.data!;
  }

  async register(userData: UserRegisterRequest): Promise<UserAuthResponse> {
    const response = await apiClient.post<UserAuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER, 
      userData
    );
    
    if (response.success && response.data) {
      // Store tokens if registration successful
      if (response.data.access_token) {
        apiClient.setAuthToken(response.data.access_token);
      }
    }
    
    return response.data!;
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

  async getProfile(): Promise<UserAuthResponse> {
    const response = await apiClient.get<UserAuthResponse>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data!;
  }

  async updateProfile(userData: Partial<UserRegisterRequest>): Promise<UserAuthResponse> {
    const response = await apiClient.put<UserAuthResponse>(
      API_ENDPOINTS.AUTH.ME, 
      userData
    );
    return response.data!;
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authService = new AuthService();