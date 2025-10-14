'use client';

import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch } from '@/hooks/redux';
import { addToCart, setCartOpen } from '@/redux/slices/cartSlice';
import { formatPrice } from '@/utils';
import { ProductDetail } from '@/types/product';
import { getProductPrice, getProductComparePrice, getProductImageUrl, getProductStock } from '@/utils/product';

interface ProductCardProps {
  product: ProductDetail;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(setCartOpen(true));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle wishlist functionality
  };

  const price = getProductPrice(product);
  const comparePrice = getProductComparePrice(product);
  const imageUrl = getProductImageUrl(product);
  const stock = getProductStock(product);
  const isInStock = stock > 0;
  const discountPercentage = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/product/${product.alias}`} className="block">
        <div className="relative">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Discount Badge */}
            {discountPercentage && (
              <Badge className="absolute left-2 top-2 bg-red-500 text-white">
                -{discountPercentage}%
              </Badge>
            )}

            {/* Quick Actions */}
            <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0"
                onClick={handleWishlist}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Add to Cart Overlay */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
              <Button
                className="w-full rounded-none cursor-pointer"
                onClick={handleAddToCart}
                disabled={!isInStock}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isInStock ? 'Thêm vào giỏ' : 'Hết hàng'}
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <CardContent className="p-4">
            <div className="space-y-2">
              <h3 className="line-clamp-2 text-sm font-medium leading-tight text-gray-900 group-hover:text-primary">
                {product.name}
              </h3>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{formatPrice(price)}</span>

                {comparePrice && comparePrice > price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
                </span>

                {product.variants && product.variants.length > 1 && (
                  <span className="text-xs text-gray-500">{product.variants.length} phiên bản</span>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
