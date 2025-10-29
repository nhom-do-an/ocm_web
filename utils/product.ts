import { ProductDetail } from '@/types/product';

export function getProductPrice(product: ProductDetail, variantIndex: number = 0): number {
  return product.variants?.[variantIndex]?.price || 0;
}

export function getProductComparePrice(product: ProductDetail, variantIndex: number = 0): number | null {
  return product.variants?.[variantIndex]?.compare_at_price || null;
}

export function getProductImageUrl(product: ProductDetail, variantIndex: number = 0): string {
  return product.images?.[variantIndex]?.url || '/images/placeholder.jpg';
}

export function getProductStock(product: ProductDetail, variantIndex: number = 0): number {
  return product.variants?.[variantIndex]?.inventory_quantity || 0;
}

export function getProductVariantSKU(product: ProductDetail, variantIndex: number = 0): string {
  return product.variants?.[variantIndex]?.sku || '';
}
