'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Filter, Grid, Home, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductGrid } from '@/components/product/product-grid';
import { productsService, collectionsService } from '@/services/api';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [products, setProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionAndProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch collection by alias
        const collectionsResponse = await collectionsService.getCollections({ 
          page: 1, 
          limit: 100 
        });
        
        if (collectionsResponse.success) {
          const foundCollection = collectionsResponse.data.collections.find(
            (c: CollectionDetail) => c.alias === alias
          );
          
          if (foundCollection) {
            setCollection(foundCollection);
            
            // Fetch products for this collection
            const productsResponse = await productsService.getProducts({
              page: 1,
              limit: 100,
              collection_ids: [foundCollection.id.toString()]
            });
            
            if (productsResponse.success) {
              setProducts(productsResponse.data.products);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching collection data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionAndProducts();
  }, [alias]);

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

      {/* Collection Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{collection.name}</h1>
        <p className="text-gray-600">Tìm thấy {products.length} sản phẩm</p>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Bộ lọc
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SortAsc className="mr-2 h-4 w-4" />
                {sortOptions.find((option) => option.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value as SortOption)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-medium">Bộ lọc</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Price Range */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Khoảng giá</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Dưới 500.000₫</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">500.000₫ - 1.000.000₫</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Trên 1.000.000₫</span>
                  </label>
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Thương hiệu</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Elmich</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Lock&Lock</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products */}
      <ProductGrid products={sortedProducts} />
    </div>
  );
}
