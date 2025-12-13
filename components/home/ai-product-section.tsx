'use client';

import { useEffect, useState } from 'react';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductDetail } from '@/types/product';
import { aiService } from '@/services/api';

interface AIProductSectionProps {
  title: string;
  type: 'trending' | 'recommendations' | 'next-items';
  limit?: number;
  className?: string;
}

export function AIProductSection({ 
  title, 
  type, 
  limit = 8,
  className = ''
}: AIProductSectionProps) {
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let response;

        switch (type) {
          case 'trending':
            response = await aiService.getTrending(limit);
            if (response?.products) {
              setProducts(response.products);
            }
            break;

          case 'recommendations':
            response = await aiService.getRecommendations(limit);
            if (response?.products) {
              setProducts(response.products);
            }
            break;

          case 'next-items':
            response = await aiService.getNextItems(limit);
            if (response?.products) {
              setProducts(response.products);
            }
            break;
        }
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, limit]);

  if (loading) {
    return (
      <section className={`mb-12 ${className}`}>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return null; // Don't show section if no products
  }

  return (
    <section className={`mb-12 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <ProductGrid products={products} className="gap-6" />
      </div>
    </section>
  );
}
