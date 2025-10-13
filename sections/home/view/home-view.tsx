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

export default function HomeView() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState<ProductDetail[]>([]);
  const [collections, setCollections] = useState<CollectionDetail[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 12 }));
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
          {featuredProducts.map((product) => {
            const price = getProductPrice(product);
            const comparePrice = getProductComparePrice(product);
            const imageUrl = getProductImageUrl(product);
            const stock = getProductStock(product);
            const isInStock = stock > 0;
            const discountPercentage = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

            return (
              <Card key={product.id} className="group cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 font-bold">{price.toLocaleString()}đ</span>
                    {comparePrice && comparePrice > price && (
                      <span className="text-gray-400 line-through text-sm">
                        {comparePrice.toLocaleString()}đ
                      </span>
                    )}
                    {discountPercentage && (
                      <Badge variant="destructive" className="text-xs">
                        -{discountPercentage}%
                      </Badge>
                    )}
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full" 
                    onClick={() => handleAddToCart(product)}
                    disabled={!isInStock}
                  >
                    {isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
