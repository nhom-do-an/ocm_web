
import { ProductDetail } from '@/types/product';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: ProductDetail[];
  className?: string;
}

export function ProductGrid({ products, className = '' }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <h3 className="text-lg font-medium">Không tìm thấy sản phẩm</h3>
          <p className="mt-2">Hãy thử tìm kiếm với từ khóa khác</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
