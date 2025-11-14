"use client";

import { useState, useMemo, useCallback, memo } from "react";
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

const SIZE_CLASSES = {
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
} as const;

function ProductCardComponent({ product, size = "md", className = "" }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [userSelectedVariant, setUserSelectedVariant] = useState<boolean>(false);
  const [isHover, setIsHover] = useState(false);

  const productImages = useMemo(() => product.images ?? [], [product.images]);

  const getVariantImageUrl = useCallback((variant: any) => {
    if (!variant) return undefined;
    if (variant.image?.url) return variant.image.url;
    if (typeof variant.image === "string") return variant.image;
    if (variant.image_id) {
      const found = productImages.find((img: any) => String(img.id) === String(variant.image_id));
      return found?.url;
    }
    return undefined;
  }, [productImages]);

  const hasColorAttribute = useMemo(
    () => product.attributes.some((attr) => attr.name === "Màu sắc"),
    [product.attributes]
  );

  const variants = useMemo(() => {
    if (!hasColorAttribute) return [];
    const colorAttribute = product.attributes.find((attr) => attr.name === "Màu sắc");
    if (!colorAttribute) return [];
    
    const variantList: any[] = [];
    colorAttribute.values.forEach((colorValue: any) => {
      const variant = product.variants.find(
        (v: any) => v[`option${colorAttribute.position}`] === colorValue && v.inventory_quantity > 0
      );
      variantList.push(
        variant || product.variants.find((v: any) => v[`option${colorAttribute.position}`] === colorValue)
      );
    });
    return variantList;
  }, [hasColorAttribute, product.attributes, product.variants]);

  const currentVariant = useMemo(
    () => product.variants?.[selectedVariantIndex],
    [product.variants, selectedVariantIndex]
  );

  const variantImageIndex = useMemo(() => {
    if (!hasColorAttribute || !currentVariant) return -1;
    
    if (currentVariant.image_id) {
      const id = currentVariant.image_id;
      return productImages.findIndex((img: any) => String(img.id) === String(id));
    }
    
    const url = getVariantImageUrl(currentVariant);
    if (url) {
      return productImages.findIndex((img: any) => String(img.url) === String(url));
    }
    return -1;
  }, [hasColorAttribute, currentVariant, productImages, getVariantImageUrl]);

  const mainImage1 = useMemo(
    () => variantImageIndex >= 0 ? productImages[variantImageIndex]?.url : productImages?.[0]?.url || getProductImageUrl(product, selectedVariantIndex),
    [variantImageIndex, productImages, product, selectedVariantIndex]
  );

  const mainImage2 = useMemo(
    () => variantImageIndex >= 0 ? productImages[variantImageIndex + 1]?.url || null : productImages?.[1]?.url || null,
    [variantImageIndex, productImages]
  );

  const selectedVariantUrl = useMemo(
    () => currentVariant ? getVariantImageUrl(currentVariant) : null,
    [currentVariant, getVariantImageUrl]
  );

  const price = useMemo(
    () => getProductPrice(product, selectedVariantIndex),
    [product, selectedVariantIndex]
  );

  const comparePrice = useMemo(
    () => getProductComparePrice(product, selectedVariantIndex),
    [product, selectedVariantIndex]
  );

  const discountPercentage = useMemo(
    () => comparePrice && price ? Math.round(((comparePrice - price) / comparePrice) * 100) : null,
    [comparePrice, price]
  );

  const stock = useMemo(
    () => getProductStock(product, selectedVariantIndex),
    [product, selectedVariantIndex]
  );

  const isInStock = useMemo(() => stock > 0, [stock]);

  const sz = size || "md";
  const sizeClasses = SIZE_CLASSES[sz];

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentVariant = product.variants?.[selectedVariantIndex];
    dispatch(addToCartApi({ quantity: 1, variant_id: currentVariant?.id }));
    toast.success("Thêm vào giỏ hàng thành công!");
  }, [dispatch, product.variants, selectedVariantIndex]);

  const handleVariantSelect = useCallback((realIndex: number) => {
    setSelectedVariantIndex(realIndex);
    setUserSelectedVariant(true);
  }, []);

  const handleMouseEnter = useCallback(() => setIsHover(true), []);
  const handleMouseLeave = useCallback(() => setIsHover(false), []);

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${sizeClasses.card} ${className}`}>
      <div className="relative">
        {/* Product Image*/}
        <div
          className={`relative ${sizeClasses.img} overflow-hidden group`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/product/${product.alias}`} className="block relative w-full h-full overflow-hidden">
            {/* Main Image */}
            <img
              src={userSelectedVariant && selectedVariantUrl ? selectedVariantUrl : mainImage1}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-300 cursor-pointer ${
                isHover && mainImage2 && !userSelectedVariant ? 'opacity-0 absolute inset-0 scale-100' : 'opacity-100 group-hover:scale-105'
              }`}
              loading="lazy"
            />
            {/* Second Image on Hover - Preloaded (rendered in DOM to preload) */}
            {mainImage2 && !userSelectedVariant && (
              <img
                src={mainImage2}
                alt={product.name}
                className={`w-full h-full object-cover transition-all duration-300 cursor-pointer absolute inset-0 ${
                  isHover ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="eager"
              />
            )}
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
                        handleVariantSelect(realIndex);
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

export const ProductCard = memo(ProductCardComponent);
