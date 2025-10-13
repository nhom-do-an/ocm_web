'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import {
  fetchProducts,
  searchProducts,
  setFilters,
} from '@/redux/slices/productsSlice';
import { ProductDetail } from '@/types/product';
import { getProductPrice, getProductComparePrice, getProductImageUrl, getProductStock } from '@/utils/product';
import { useDebounce } from '@/hooks/useDebounce';

export default function ProductsView() {
  const dispatch = useAppDispatch();
  const { products, loading, filters, totalPages, totalProducts } = useAppSelector(
    (state) => state.products
  );
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(localSearchQuery, 500);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Auto search với debounce
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      dispatch(searchProducts({ query: debouncedSearchQuery }));
    } else if (debouncedSearchQuery === '') {
      dispatch(fetchProducts({}));
    }
  }, [debouncedSearchQuery, dispatch]);

  const handleSearch = () => {
    if (localSearchQuery.trim()) {
      dispatch(searchProducts({ query: localSearchQuery }));
    } else {
      dispatch(fetchProducts({}));
    }
  };

  const handleAddToCart = (product: ProductDetail) => {
    dispatch(
      addToCart({
        product: product,
        quantity: 1,
      })
    );
  };

  const handleSortChange = (sortBy: string) => {
    dispatch(setFilters({ sort_by: sortBy }));
    dispatch(fetchProducts({ sort_by: sortBy }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tất cả sản phẩm</h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>Tìm kiếm</Button>
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filters.sort_by || 'created_at'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="created_at">Mới nhất</option>
              <option value="price">Giá thấp đến cao</option>
              <option value="name">Tên A-Z</option>
            </select>
          </div>
        </div>

        {/* Search Results Info */}
                {localSearchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Kết quả tìm kiếm cho "{localSearchQuery}": {products.length} sản phẩm
            </h2>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const price = getProductPrice(product);
            const comparePrice = getProductComparePrice(product);
            const imageUrl = getProductImageUrl(product);
            const stock = getProductStock(product);
            const isInStock = stock > 0;
            const discountPercentage = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

            return (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>

                  <div className="flex items-center gap-2 mb-3">
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

                  <div className="mb-3">
                    <span className="text-xs text-gray-500">
                      {isInStock ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
                    </span>
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={filters.page === i + 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  dispatch(setFilters({ page: i + 1 }));
                  dispatch(fetchProducts({ ...filters, page: i + 1 }));
                }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
