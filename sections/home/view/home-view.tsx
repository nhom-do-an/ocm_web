'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { CollectionGrid } from '@/components/home/collection-grid';
import { BannerSlider } from '@/components/home/banner-slider';
import { ServiceBenefits } from '@/components/home/service-benefits';
import { AIProductSection } from '@/components/home/ai-product-section';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/redux/slices/productsSlice';
import { ProductDetail } from '@/types/product';
import { CollectionDetail } from '@/types/collection';
import { collectionsService } from '@/services/api';
import { ProductGrid } from '@/components/product/product-grid';

export default function HomeView() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [collections, setCollections] = useState<CollectionDetail[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    try {
      setCollectionsLoading(true);
      const response = await collectionsService.getCollections({ page: 1, size: 100 });
      if (response.success) {
        setCollections(response.data.collections);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setCollectionsLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ size: 12, sort_field: 'created_at', sort_type: 'asc' }));
    fetchCollections();
  }, [dispatch, fetchCollections]);

  const featuredProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Banner Slider */}
      <section className="container mx-auto py-4">
        <BannerSlider />
      </section>

      {/* Service Benefits */}
      <ServiceBenefits />

      <div className="container mx-auto px-4 py-8">
        {/* AI Trending Products - HOT */}
        <AIProductSection 
          title="🔥 SẢN PHẨM HOT - ĐANG THỊNH HÀNH"
          type="trending"
          limit={8}
        />

        {/* AI Personalized Recommendations */}
        <AIProductSection 
          title="💡 CÓ THỂ BẠN QUAN TÂM"
          type="recommendations"
          limit={8}
        />

        {/* Featured Collections */}
        {!collectionsLoading && collections.length > 0 && (
          <section className="mb-12">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">DANH MỤC NỔI BẬT</h2>
              <CollectionGrid collections={collections} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
