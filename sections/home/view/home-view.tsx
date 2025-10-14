'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollectionGrid } from '@/components/home/collection-grid';
import { BannerSlider } from '@/components/home/banner-slider';
import { ServiceBenefits } from '@/components/home/service-benefits';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { fetchProducts } from '@/redux/slices/productsSlice';
import { ProductDetail } from '@/types/product';
import { CollectionDetail } from '@/types/collection';
import { collectionsService } from '@/services/api';
import { getProductPrice, getProductComparePrice, getProductImageUrl, getProductStock } from '@/utils/product';
import { ProductCard } from '@/components/product/product-card';

export default function HomeView() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState<ProductDetail[]>([]);
  const [collections, setCollections] = useState<CollectionDetail[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 12, sort_field: 'created_at', sort_type: 'asc' }));
    fetchCollections();
  }, [dispatch]);

  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);
      const response = await collectionsService.getCollections({ page: 1, limit: 8 });
      if (response.success) {
        setCollections(response.data.collections);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setCollectionsLoading(false);
    }
  };

  useEffect(() => {
    // Take first 8 products as featured (since we don't have isFeatured property)
    const featured = products.slice(0, 8);
    setFeaturedProducts(featured);
  }, [products]);

  const handleAddToCart = (product: ProductDetail) => {
    dispatch(
      addToCart({
        product: product,
        quantity: 1,
      })
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner Slider */}
      <section className="container mx-auto px-4 py-4">
        <BannerSlider />
      </section>

      {/* Service Benefits */}
      <ServiceBenefits />

      <div className="container mx-auto px-4 py-8">
        {/* Featured Products */}
        <section className="mb-12">
          <div className="bg-red-600 text-white p-4 mb-6">
            <h2 className="text-2xl font-bold text-center">SẢN PHẨM BÁN CHẠY</h2>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        </section>

        {/* Featured Collections */}
        {!collectionsLoading && collections.length > 0 && (
          <section className="mb-12">
            <div className="bg-red-600 text-white p-4 mb-6">
              <h2 className="text-2xl font-bold text-center">DANH MỤC NỔI BẬT</h2>
            </div>
            <CollectionGrid collections={collections} />
          </section>
        )}
      </div>
    </div>
  );
}
