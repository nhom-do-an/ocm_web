'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { fetchProduct } from '@/redux/slices/productsSlice';
import { getProductPrice, getProductComparePrice, getProductImageUrl, getProductStock } from '@/utils/product';

interface CollectionViewProps {
  alias: string;
}

export default function ProductDetailView({ alias }: CollectionViewProps) {
  const dispatch = useAppDispatch();
  const { currentProduct, loading } = useAppSelector((state) => state.products);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (alias) {
      dispatch(fetchProduct(alias));
    }
  }, [dispatch, alias]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(
        addToCart({
          product: currentProduct,
          quantity,
          selectedVariants,
        })
      );
    }
  };

  const handleVariantChange = (variantId: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: value,
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  const price = getProductPrice(currentProduct);
  const comparePrice = getProductComparePrice(currentProduct);
  const stock = getProductStock(currentProduct);
  const isInStock = stock > 0;
  const discountPercentage = comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img
              src={getProductImageUrl(currentProduct, selectedImageIndex)}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image Thumbnails */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="flex gap-2">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 border-2 rounded-lg overflow-hidden ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{currentProduct.name}</h1>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold text-red-600">
              {price.toLocaleString()}đ
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-xl text-gray-400 line-through">
                {comparePrice.toLocaleString()}đ
              </span>
            )}
            {discountPercentage && (
              <Badge variant="destructive" className="text-sm">
                -{discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {isInStock ? (
              <Badge variant="secondary" className="text-green-600">
                Còn {stock} sản phẩm
              </Badge>
            ) : (
              <Badge variant="destructive">Hết hàng</Badge>
            )}
          </div>

          {/* Variants */}
          {currentProduct.variants && currentProduct.variants.length > 0 && (
            <div className="mb-6">
              {currentProduct.variants.map((variant) => (
                <div key={variant.id} className="mb-4">
                  <label className="block text-sm font-medium mb-2">{variant.title}</label>
                  <select
                    value={selectedVariants[variant.id.toString()] || ''}
                    onChange={(e) => handleVariantChange(variant.id.toString(), e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Chọn {variant.title}</option>
                    <option value={variant.option1}>{variant.option1}</option>
                    {variant.option2 && <option value={variant.option2}>{variant.option2}</option>}
                    {variant.option3 && <option value={variant.option3}>{variant.option3}</option>}
                  </select>
                </div>
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Số lượng</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="text-lg font-medium w-12 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full mb-4"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            {isInStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>

          {/* Description */}
          {currentProduct.content && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Mô tả sản phẩm</h3>
                <div 
                  className="text-gray-700" 
                  dangerouslySetInnerHTML={{ __html: currentProduct.content }}
                />
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {currentProduct.summary && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">Tóm tắt</h3>
                <p dangerouslySetInnerHTML={{ __html: currentProduct.summary }} className="text-gray-700"></p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
