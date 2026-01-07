'use client';

import { ProductGrid } from '@/components/product/product-grid';
import { ProductDetail } from '@/types/product';

interface AIProductSectionProps {
  title: string;
  products: ProductDetail[];
  className?: string;
}

export function AIProductSection({
  title,
  products,
  className = ''
}: AIProductSectionProps) {
  // Don't show section if no products
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`mb-12 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <ProductGrid products={products} className="gap-6" />
      </div>
    </section>
  );
}
