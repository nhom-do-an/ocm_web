'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { collectionsService } from '@/services/api';
import { CollectionDetail } from '@/types/collection';
import { cn } from '@/lib/utils';

interface DynamicNavigationProps {
  className?: string;
  limit?: number;
  onItemClick?: () => void;
  variant?: 'dropdown' | 'mobile';
}

export default function DynamicNavigation({ 
  className, 
  limit = 6,
  onItemClick,
  variant = 'dropdown'
}: DynamicNavigationProps) {
  const [collections, setCollections] = useState<CollectionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        const response = await collectionsService.getCollections({
          page: 1,
          size: limit
        });
        
        if (response.data?.collections) {
          setCollections(response.data.collections);
        }
      } catch (err) {
        console.error('Error loading collections for navigation:', err);
        setError('Không thể tải danh mục');
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
  }, [limit]);

  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-sm text-gray-500", className)}>
        {error}
      </div>
    );
  }

  const linkClassName = variant === 'mobile' 
    ? "block rounded-lg px-3 py-2 text-sm leading-7 text-gray-700 hover:bg-gray-50"
    : "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground";

  const contentClassName = variant === 'mobile' 
    ? ""
    : "text-sm font-medium leading-none";

  return (
    <div className={cn("", className)}>
      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={`/collection/${collection.alias}`}
          className={linkClassName}
          onClick={onItemClick}
        >
          {variant === 'mobile' ? (
            collection.name
          ) : (
            <div className={contentClassName}>
              {collection.name}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}