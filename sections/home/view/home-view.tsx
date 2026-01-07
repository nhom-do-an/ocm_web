'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { CollectionGrid } from '@/components/home/collection-grid';
import { BannerSlider } from '@/components/home/banner-slider';
import { ServiceBenefits } from '@/components/home/service-benefits';
import { AIProductSection } from '@/components/home/ai-product-section';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts } from '@/redux/slices/productsSlice';
import { CollectionDetail } from '@/types/collection';
import { ProductDetail } from '@/types/product';
import { Banner } from '@/types/banner';
import { collectionsService, bannersService, aiService } from '@/services/api';

// Global loading component
function HomeLoading() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Đang tải trang...</p>
      </div>
    </div>
  );
}

export default function HomeView() {
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading } = useAppSelector((state) => state.products);

  // All data states
  const [collections, setCollections] = useState<CollectionDetail[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<ProductDetail[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductDetail[]>([]);

  // Loading states
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    // Fetch collections
    const fetchCollections = async () => {
      try {
        const response = await collectionsService.getCollections({ page: 1, size: 100 });
        if (response.success) {
          setCollections(response.data.collections);
        }
      } catch (error) {
        console.error('Error fetching collections:', error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    // Fetch banners
    const fetchBanners = async () => {
      try {
        const response = await bannersService.getBanners();
        if (response.success && response.data && Array.isArray(response.data)) {
          const activeBanners = response.data
            .filter((b) => b.is_active)
            .sort((a, b) => a.position - b.position);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setBannersLoading(false);
      }
    };

    // Fetch trending products
    const fetchTrending = async () => {
      try {
        const response = await aiService.getTrending(8);
        if (response?.products) {
          setTrendingProducts(response.products);
        }
      } catch (error) {
        console.error('Error fetching trending:', error);
      } finally {
        setTrendingLoading(false);
      }
    };

    // Fetch recommended products
    const fetchRecommendations = async () => {
      try {
        const response = await aiService.getRecommendations(8);
        if (response?.products) {
          setRecommendedProducts(response.products);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    // Run all fetches in parallel
    await Promise.all([
      fetchCollections(),
      fetchBanners(),
      fetchTrending(),
      fetchRecommendations(),
    ]);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ size: 12, sort_field: 'created_at', sort_type: 'asc' }));
    fetchAllData();
  }, [dispatch, fetchAllData]);

  // Check if all data is loaded
  const isLoading = initialLoad && (
    productsLoading ||
    collectionsLoading ||
    bannersLoading ||
    trendingLoading ||
    recommendationsLoading
  );

  // Set initialLoad to false after first load completes
  useEffect(() => {
    if (!productsLoading && !collectionsLoading && !bannersLoading && !trendingLoading && !recommendationsLoading) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [productsLoading, collectionsLoading, bannersLoading, trendingLoading, recommendationsLoading]);

  const featuredProducts = useMemo(
    () => products.slice(0, 8),
    [products]
  );

  // Show global loading
  if (isLoading) {
    return <HomeLoading />;
  }

  return (
    <div className="bg-gray-50">
      {/* Banner Slider */}
      {banners.length > 0 && (
        <section className="container mx-auto py-4 w-screen">
          <BannerSlider banners={banners} />
        </section>
      )}

      {/* Service Benefits */}
      <ServiceBenefits />

      <div className="container mx-auto px-4 py-3 lg:px-[100px]">
        {/* AI Trending Products - HOT */}
        {trendingProducts.length > 0 && (
          <AIProductSection
            title="🔥 SẢN PHẨM HOT - ĐANG THỊNH HÀNH"
            products={trendingProducts}
          />
        )}

        {/* AI Personalized Recommendations */}
        {recommendedProducts.length > 0 && (
          <AIProductSection
            title="💡 CÓ THỂ BẠN QUAN TÂM"
            products={recommendedProducts}
          />
        )}

        {/* Featured Collections */}
        {collections.length > 0 && (
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
