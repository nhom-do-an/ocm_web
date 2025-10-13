'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collectionsService } from '@/services/api';
import { CollectionDetail } from '@/types/collection';

export function FooterCollections() {
  const [collections, setCollections] = useState<CollectionDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await collectionsService.getCollections({ 
          page: 1, 
          limit: 6 // Chỉ lấy 6 collection cho footer
        });
        
        if (response.success) {
          setCollections(response.data.collections);
        }
      } catch (error) {
        console.error('Error fetching collections for footer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Danh mục sản phẩm</h3>
        <ul className="space-y-2">
          {Array(4).fill(0).map((_, i) => (
            <li key={i}>
              <div className="h-4 bg-gray-700 rounded animate-pulse w-32"></div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Danh mục sản phẩm</h3>
      <ul className="space-y-2">
        {collections.map((collection) => (
          <li key={collection.id}>
            <Link 
              href={`/collection/${collection.alias}`} 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {collection.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}