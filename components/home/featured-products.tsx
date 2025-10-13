import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-grid';
import { ProductDetail } from '@/types';

interface FeaturedProductsProps {
  products: ProductDetail[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">Sản phẩm nổi bật</h2>
            <p className="mt-2 text-gray-600">Các sản phẩm bán chạy và được yêu thích nhất</p>
          </div>

          <Button variant="outline" asChild>
            <Link href="/products">Xem tất cả</Link>
          </Button>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
