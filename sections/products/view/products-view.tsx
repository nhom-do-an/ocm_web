'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchProducts, setFilters } from '@/redux/slices/productsSlice';
import { ProductGrid } from '@/components/product/product-grid';
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
} from '@/components/ui/pagination';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ProductsView() {
  const dispatch = useAppDispatch();
  const { products, loading, filters, totalPages, totalProducts } = useAppSelector(
    (state) => state.products as any
  );
  const searchParams = useSearchParams();
  const router = useRouter();

  // read query params
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');
  const size = Number(searchParams.get('size') || '12');
  const sort_field = searchParams.get('sort_field') || undefined;
  const sort_type = searchParams.get('sort_type') || undefined;

  useEffect(() => {
    const params: any = { page, size };
    if (q) params.key = [q];
    if (sort_field) params.sort_field = sort_field;
    if (sort_type) params.sort_type = sort_type;
    dispatch(fetchProducts(params));
    dispatch(setFilters({ page, size, sort_field, sort_type }));
  }, [dispatch, q, page, size, sort_field, sort_type]);

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

        {q && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Kết quả tìm kiếm cho "{q}"
              {totalProducts && totalProducts > 0 ? `: ${totalProducts} sản phẩm` : ''}
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
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => {
                  const prev = Math.max(1, page - 1);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(prev));
                  router.push(`/products?${params.toString()}`);
                }}
                className="mr-2"
              />

              <PaginationPages
                totalPages={totalPages}
                currentPage={page}
                onPageClick={(p) => {
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(p));
                  router.push(`/products?${params.toString()}`);
                }}
              />

              <PaginationNext
                onClick={() => {
                  const next = Math.min(totalPages, page + 1);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(next));
                  router.push(`/products?${params.toString()}`);
                }}
                className="ml-2"
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
