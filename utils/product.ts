import { ProductDetail } from '@/types/product';

export function getProductPrice(product: ProductDetail): number {
  return product.variants?.[0]?.price || 0;
}

export function getProductComparePrice(product: ProductDetail): number | null {
  return product.variants?.[0]?.compare_at_price || null;
}

export function getProductImageUrl(product: ProductDetail, index: number = 0): string {
  return product.images?.[index]?.url || '/images/placeholder.jpg';
}

export function getProductStock(product: ProductDetail): number {
  return product.variants?.[0]?.inventory_quantity || 0;
}
