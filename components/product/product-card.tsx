"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/hooks/redux";
import { addToCartApi } from "@/redux/slices/cartSlice";
import { formatPrice } from "@/utils";
import { ProductDetail } from "@/types/product";
import {
  getProductPrice,
  getProductComparePrice,
  getProductImageUrl,
  getProductStock,
} from "@/utils/product";
import { toast } from "react-toastify";

interface ProductCardProps {
  product: ProductDetail;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProductCard({ product, size = "md", className = "" }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [userSelectedVariant, setUserSelectedVariant] = useState<boolean>(false);
  const [isHover, setIsHover] = useState(false);

  const price = getProductPrice(product, selectedVariantIndex);
  const comparePrice = getProductComparePrice(product, selectedVariantIndex);
  const imageUrl = getProductImageUrl(product, selectedVariantIndex);
  const discountPercentage =
    comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;
  const stock = getProductStock(product, selectedVariantIndex);
  const isInStock = stock > 0;

  const productImages = product.images ?? [];

  const getVariantImageUrl = (variant: any) => {
    if (!variant) return undefined;
    if (variant.image?.url) return variant.image.url;
    if (typeof variant.image === "string") return variant.image;
    if (variant.image_id) {
      const found = productImages.find((img: any) => String(img.id) === String(variant.image_id));
      return found?.url;
    }
    return undefined;
  };

  const hasColorAttribute = product.attributes.some((attr) => attr.name === "Màu sắc");
  let variants: any[] = [];
  if (hasColorAttribute) {
    const colorAttribute = product.attributes.find((attr) => attr.name === "Màu sắc");
    colorAttribute?.values.forEach((colorValue: any) => {
      const variant = product.variants.find(
        (v: any) => v[`option${colorAttribute.position}`] === colorValue && v.inventory_quantity > 0
      );
      variants.push(
        variant || product.variants.find((v: any) => v[`option${colorAttribute.position}`] === colorValue)
      );
    });
  }

  const selectedVariantUrl =
    product.variants && product.variants[selectedVariantIndex]
      ? getVariantImageUrl(product.variants[selectedVariantIndex])
      : null;

  const findImageIndexById = (id?: string | number | null) => {
    if (id == null) return -1;
    return productImages.findIndex((img: any) => String(img.id) === String(id));
  };
  const currentVariant = product.variants && product.variants[selectedVariantIndex];
  let variantImageIndex = -1;
  if (hasColorAttribute && currentVariant) {
    if (currentVariant.image_id) {
      variantImageIndex = findImageIndexById(currentVariant.image_id);
    }
    if (variantImageIndex < 0) {
      const url = getVariantImageUrl(currentVariant as any);
      if (url) {
        variantImageIndex = productImages.findIndex((img: any) => String(img.url) === String(url));
      }
    }
  }

  const mainImage1 =
    variantImageIndex >= 0 ? productImages[variantImageIndex]?.url : productImages?.[0]?.url || imageUrl;
  const mainImage2 =
    variantImageIndex >= 0 ? productImages[variantImageIndex + 1]?.url || null : productImages?.[1]?.url || null;

  let displayedImage: string | null;
  if (userSelectedVariant && selectedVariantUrl) {
    displayedImage = selectedVariantUrl;
  } else {
    displayedImage = isHover && mainImage2 ? mainImage2 : mainImage1;
  }

  const cardSize = size as ("sm" | "md" | "lg") | undefined;

  const sizeClasses = {
    sm: {
      img: "aspect-square",
      title: "text-sm",
      price: "text-base",
      badge: "text-xs",
      card: "p-0",
    },
    md: {
      img: "aspect-square",
      title: "text-sm",
      price: "text-lg",
      badge: "text-sm",
      card: "p-0",
    },
    lg: {
      img: "aspect-square",
      title: "text-base",
      price: "text-2xl",
      badge: "text-sm",
      card: "p-0",
    },
  };

  const sz = cardSize || "md";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentVariant = product.variants && product.variants[selectedVariantIndex];
    dispatch(addToCartApi({ quantity: 1, variant_id: currentVariant?.id }));
    toast.success("Thêm vào giỏ hàng thành công!");
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${sizeClasses[sz].card} ${className}`}>
      <div className="relative">
        {/* Product Image*/}
        <div
          className={`relative ${sizeClasses[sz].img} overflow-hidden group`}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Link href={`/product/${product.alias}`} className="block">
            <img
              src={displayedImage || imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            />
          </Link>

          {/* Discount Badge */}
          {discountPercentage && (
            <Badge className="absolute left-2 top-2 bg-red-500 text-white">-{discountPercentage}%</Badge>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="min-h-[3rem] overflow-hidden">
              <Link href={`/product/${product.alias}`} className="block">
                <h3 className="line-clamp-2 text-sm font-medium leading-tight text-gray-900 hover:text-red-600 cursor-pointer break-words whitespace-normal">
                  {product.name}
                </h3>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-red-600 truncate">{formatPrice(price)}</span>
                {comparePrice && comparePrice > price && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(comparePrice)}</span>
                  )}
                </div>
              </div>

              {/* Add-to-cart (fixed to right) */}
              <div className="flex-none">
                <Button
                  aria-label="Thêm vào giỏ"
                  title={isInStock ? "Thêm vào giỏ" : "Hết hàng"}
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  size="icon"
                  variant="destructive"
                  className="p-2 rounded-full shadow cursor-pointer"
                >
                  <ShoppingCart className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center justify-between">
              <span className={`text-xs ${isInStock ? "text-green-600" : "text-red-600"}`}>
                {isInStock ? `Còn ${stock} sản phẩm` : "Hết hàng"}
              </span>

              {product.variants && product.variants.length > 1 && (
                <span className="text-xs text-gray-500">{product.variants.length} phiên bản</span>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              {hasColorAttribute ? (
                variants?.map((v) => {
                  const url = getVariantImageUrl(v);
                  const realIndex = product.variants.findIndex((pv) => pv.id === v.id);
                  const isSelected = selectedVariantIndex === realIndex;
                  if (!url) return null;
                  return (
                    <button
                      key={v.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedVariantIndex(realIndex);
                        setUserSelectedVariant(true);
                      }}
                      className={`w-6 h-6 rounded-full overflow-hidden border ${isSelected ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200'} p-0`}
                    >
                      <img src={url} className="w-full h-full object-cover" alt={`variant-${v.id}`} />
                    </button>
                  );
                })
              ) : (
                <div className="h-6"></div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
