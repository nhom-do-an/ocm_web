import { apiClient } from './client';
import { API_ENDPOINTS } from '@/constants/api';
import { ProductDetail } from '@/types/product';

export interface AIRecommendation {
  item_id: number;
  variant_id: number;
  score: number;
  rank: number;
  product_name?: string;
  product_image?: string;
}

export interface NextItemPrediction {
  item_id: number;
  variant_id: number;
  probability: number;
  confidence: number;
  support: number;
  rank: number;
  product_name?: string;
  product_image?: string;
}

export interface TrendingResponse {
  store_id: number;
  products: ProductDetail[];
  trending: any[];
  count: number;
  strategy: 'ai_model' | 'cold_start';
}

export interface RecommendationsResponse {
  store_id: number;
  user_id?: number;
  recommendations: AIRecommendation[];
  products: ProductDetail[];
  count: number;
  strategy: 'ai_model' | 'cold_start';
  personalized?: boolean;
}

export interface NextItemsResponse {
  store_id: number;
  user_id: number;
  predictions: NextItemPrediction[];
  products: ProductDetail[];
  count: number;
  strategy: 'ai_model' | 'cold_start';
}

class AIService {
  /**
   * Get trending products using AI
   * @param n - Number of products to return (default: 10)
   */
  async getTrending(n: number = 10): Promise<TrendingResponse> {
    try {
      const response = await apiClient.get<TrendingResponse>(
        `${API_ENDPOINTS.AI.TRENDING}?n=${n}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching trending products:', error);
      throw error;
    }
  }

  /**
   * Get personalized recommendations for a user
   * @param n - Number of recommendations to return (default: 10)
   */
  async getRecommendations(n: number = 10): Promise<RecommendationsResponse> {
    try {
      const response = await apiClient.get<RecommendationsResponse>(
        `${API_ENDPOINTS.AI.RECOMMENDATIONS}?n=${n}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  /**
   * Get next item predictions based on purchase history
   * @param n - Number of predictions to return (default: 10)
   */
  async getNextItems(n: number = 10): Promise<NextItemsResponse> {
    try {
      const response = await apiClient.get<NextItemsResponse>(
        `${API_ENDPOINTS.AI.NEXT_ITEMS}?n=${n}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching next items:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
