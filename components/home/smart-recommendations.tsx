'use client';

import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductDetail } from '@/types/product';
import { aiService } from '@/services/api';

interface SmartRecommendationsProps {
  title?: string;
  nextItemsLimit?: number;
  recommendationsLimit?: number;
  className?: string;
}

/**
 * Smart Recommendations Component
 * Combines Next Item predictions with Recommendations
 * Shows next items first, then fills remaining slots with recommendations
 */
export function SmartRecommendations({ 
  title = "💡 CÓ THỂ BẠN QUAN TÂM",
  nextItemsLimit = 4,
  recommendationsLimit = 8,
  className = ''
}: SmartRecommendationsProps) {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNextItems, setHasNextItems] = useState(false);

  useEffect(() => {
    const fetchSmartRecommendations = async () => {
      try {
        setLoading(true);
        
        // Try to get next item predictions first
        let nextItemProducts: ProductDetail[] = [];
        let nextItemIds: Set<number> = new Set();
        
        try {
          const nextItemsResponse = await aiService.getNextItems(nextItemsLimit);
          if (nextItemsResponse.products && nextItemsResponse.products.length > 0) {
            nextItemProducts = nextItemsResponse.products;
            nextItemProducts.forEach(p => nextItemIds.add(p.id));
            setHasNextItems(true);
          }
        } catch (error) {
          console.log('No next items available (user may not have purchase history)');
        }

        // Get recommendations to fill remaining slots
        const remainingSlots = recommendationsLimit - nextItemProducts.length;
        let recommendationProducts: ProductDetail[] = [];
        
        if (remainingSlots > 0) {
          try {
            const recsResponse = await aiService.getRecommendations(recommendationsLimit);
            if (recsResponse.products) {
              // Filter out products already in next items
              recommendationProducts = recsResponse.products
                .filter(p => !nextItemIds.has(p.id))
                .slice(0, remainingSlots);
            }
          } catch (error) {
            console.error('Error fetching recommendations:', error);
          }
        }

        // Combine: next items first, then recommendations
        const combinedProducts = [...nextItemProducts, ...recommendationProducts];
        setProducts(combinedProducts);
        
      } catch (error) {
        console.error('Error fetching smart recommendations:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSmartRecommendations();
  }, [nextItemsLimit, recommendationsLimit]);

  if (loading) {
    return (
      <section className={`mb-12 ${className}`}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải gợi ý sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`mb-12 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <div className="flex items-center gap-2">
            {hasNextItems && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Dành cho bạn
              </span>
            )}
          </div>
        </div>
        <ProductGrid products={products} className="gap-6" />
      </div>
    </section>
  );
}
