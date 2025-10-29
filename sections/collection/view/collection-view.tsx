'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Home, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductGrid } from '@/components/product/product-grid';
import { productsService, collectionsService } from '@/services/api';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
} from '@/components/ui/pagination';
import { CollectionDetail } from '@/types/collection';
import { ProductDetail } from '@/types/product';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

const sortOptions = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá: Thấp đến cao' },
  { value: 'price-desc', label: 'Giá: Cao đến thấp' },
  { value: 'name-asc', label: 'Tên: A-Z' },
  { value: 'name-desc', label: 'Tên: Z-A' },
  { value: 'newest', label: 'Mới nhất' },
];

interface CollectionViewProps {
  alias: string;
}

export default function CollectionView({ alias }: CollectionViewProps) {
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const size = 12;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [minPriceInput, setMinPriceInput] = useState<string>('');
  const [maxPriceInput, setMaxPriceInput] = useState<string>('');
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const p = Number(searchParams.get('page') || '1');
    const s = searchParams.get('sort') || 'default';
    setPage(p);
    setSortBy(s as SortOption);

    const minP = searchParams.get('min_price');
    const maxP = searchParams.get('max_price');
    const types = searchParams.getAll('product_types');
    setSelectedProductTypes(types || []);
    setAppliedMinPrice(minP ? Number(minP) : null);
    setAppliedMaxPrice(maxP ? Number(maxP) : null);
    setMinPriceInput(minP ?? '');
    setMaxPriceInput(maxP ?? '');
  }, [searchParams]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);

        const collectionResponse = await collectionsService.getCollectionByAlias(alias);
        if (collectionResponse.success && collectionResponse.data) {
          const foundCollection = collectionResponse.data as CollectionDetail;
          setCollection(foundCollection);

          try {
            const ptResp = await collectionsService.getCollectionProductTypes(foundCollection.id);
            if (ptResp.success && Array.isArray(ptResp.data)) {
              setProductTypes(ptResp.data);
            } else {
              setProductTypes([]);
            }
          } catch (err) {
            console.error('Error fetching product types:', err);
            setProductTypes([]);
          }
        } else {
          setCollection(null);
        }
      } catch (error) {
        console.error('Error fetching collection:', error);
        setCollection(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [alias]);

  useEffect(() => {
    const fetchProductsForCollection = async () => {
      if (!collection) return;
      try {
        setProductsLoading(true);
        const params: any = { page, size, collection_ids: [collection.id.toString()] };
        if (appliedMinPrice !== null) params.min_price = appliedMinPrice;
        if (appliedMaxPrice !== null) params.max_price = appliedMaxPrice;
        if (selectedProductTypes.length) params.product_types = selectedProductTypes;

        const productsResponse = await productsService.getProducts(params);
        if (productsResponse.success) {
          setProducts(productsResponse.data.products);
          if (productsResponse.data.count !== undefined) {
            setTotalPages(Math.ceil(productsResponse.data.count / size));
          }
        }
      } catch (err) {
        console.error('Error fetching products for collection:', err);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProductsForCollection();
  }, [collection, page, appliedMinPrice, appliedMaxPrice, selectedProductTypes]);

  const toggleProductType = (ptId: string) => {
    const next = selectedProductTypes.includes(ptId)
      ? selectedProductTypes.filter((p) => p !== ptId)
      : [...selectedProductTypes, ptId];

    setSelectedProductTypes(next);
    setPage(1);

    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page', '1');
    params.delete('product_types');
    next.forEach((v) => params.append('product_types', v));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const applyPrice = () => {
    const min = minPriceInput ? Number(minPriceInput) : null;
    const max = maxPriceInput ? Number(maxPriceInput) : null;
    setAppliedMinPrice(min);
    setAppliedMaxPrice(max);

    setPage(1);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('page', '1');
    if (min !== null) params.set('min_price', String(min)); else params.delete('min_price');
    if (max !== null) params.set('max_price', String(max)); else params.delete('max_price');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const removeProductType = (ptId: string) => {
    const next = selectedProductTypes.filter((p) => p !== ptId);
    setSelectedProductTypes(next);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('product_types');
    next.forEach((v) => params.append('product_types', v));
    setPage(1);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const removePriceFilter = () => {
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setMinPriceInput('');
    setMaxPriceInput('');
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('min_price');
    params.delete('max_price');
    setPage(1);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const clearAllFilters = () => {
    setSelectedProductTypes([]);
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setMinPriceInput('');
    setMaxPriceInput('');
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.delete('min_price');
    params.delete('max_price');
    params.delete('product_types');
    params.set('page', '1');
    setPage(1);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  const onSortClick = (value: SortOption) => {
    setSortBy(value);
    setPage(1);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('sort', value);
    params.set('page', '1');
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!collection) {
    notFound();
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        const priceA = a.variants?.[0]?.price || 0;
        const priceB = b.variants?.[0]?.price || 0;
        return priceA - priceB;
      case 'price-desc':
        const priceA2 = a.variants?.[0]?.price || 0;
        const priceB2 = b.variants?.[0]?.price || 0;
        return priceB2 - priceA2;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <a href="/" className="text-gray-900 hover:text-red-500 flex items-center gap-1">
              <Home className="h-4 w-4 text-red-500" />
              Trang chủ
            </a>
          </li>
          <li>
            <span className="text-gray-400">/</span>
          </li>
          <li>
            <span className="text-gray-500">{collection.name}</span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          {/* Active filters container */}
          {((appliedMinPrice !== null && appliedMaxPrice !== null) || selectedProductTypes.length > 0) && (
            <div className="mb-4 p-3 rounded border bg-orange-50 border-orange-300">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-orange-600">Lọc theo</h4>
                <button className="text-sm text-orange-700 cursor-pointer hover:underline" onClick={clearAllFilters}>Xóa hết</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProductTypes.map((ptName) => (
                  <div
                    key={ptName}
                    className="inline-flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    <button
                      onClick={() => removeProductType(ptName)}
                      className="text-sm text-white cursor-pointer"
                      aria-label={`Xóa filter ${ptName}`}
                    >
                      {ptName}
                    </button>
                    <button
                      onClick={() => removeProductType(ptName)}
                      className="p-0.5 text-white hover:text-gray-100 cursor-pointer"
                      aria-label={`Xóa ${ptName}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
                  <div className="inline-flex items-center gap-2 bg-red-500 text-white px-2 py-1 rounded">
                    <span className="text-sm">Giá: {appliedMinPrice ?? '-'} - {appliedMaxPrice ?? '-'}</span>
                    <button onClick={removePriceFilter} className="p-0.5 text-white hover:text-gray-100 cursor-pointer" aria-label="Xóa filter giá">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price filter inputs */}
          <div className="mb-6 p-4 bg-white rounded border">
            <h4 className="mb-3 font-medium text-red-500">Khoảng giá</h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Từ (₫)"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Đến (₫)"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>
            <div className="mt-3">
              <Button onClick={applyPrice} size="sm" className="bg-red-500 text-white hover:bg-red-600 cursor-pointer">Áp dụng</Button>
            </div>
          </div>

          {/* Product types chips */}
          <div className="p-4 bg-white rounded border">
            <h4 className="mb-3 font-medium text-red-500">Loại sản phẩm</h4>
            <div className="flex flex-wrap gap-2">
              {productTypes.length === 0 ? (
                <div className="text-sm text-gray-500">Không có loại sản phẩm</div>
              ) : (
                productTypes.map((ptName: string) => {
                  const id = String(ptName);
                  const active = selectedProductTypes.includes(id);
                  return (
                    <Button
                      key={id}
                      size="sm"
                      variant="outline"
                      className={`${active ? 'text-red-500 border-red-500' : ''} cursor-pointer`}
                      onClick={() => toggleProductType(id)}
                    >
                      {ptName}
                    </Button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="mr-2 text-sm font-bold">Sắp xếp:</span>
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant="outline"
                className={`${sortBy === (option.value as SortOption) ? 'text-red-500 border-red-500' : ''} cursor-pointer`}
                onClick={() => onSortClick(option.value as SortOption)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {productsLoading ? (
            <div className="text-center py-12">Đang tải sản phẩm...</div>
          ) : (
            <ProductGrid products={sortedProducts} />
          )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => {
                  const prev = Math.max(1, page - 1);
                  setPage(prev);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(prev));
                  const newUrl = `${window.location.pathname}?${params.toString()}`;
                  window.history.replaceState(null, '', newUrl);
                }}
                className="mr-2"
              />

              <PaginationPages
                totalPages={totalPages}
                currentPage={page}
                onPageClick={(p) => {
                  setPage(p);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(p));
                  const newUrl = `${window.location.pathname}?${params.toString()}`;
                  window.history.replaceState(null, '', newUrl);
                }}
              />

              <PaginationNext
                onClick={() => {
                  const next = Math.min(totalPages, page + 1);
                  setPage(next);
                  const params = new URLSearchParams(Array.from(searchParams.entries()));
                  params.set('page', String(next));
                  const newUrl = `${window.location.pathname}?${params.toString()}`;
                  window.history.replaceState(null, '', newUrl);
                }}
                className="ml-2"
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
          </main>
        </div>
      </div>
  );
}
