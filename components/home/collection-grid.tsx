import { memo, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CollectionDetail } from '@/types/collection';
import Image from 'next/image';

interface CollectionGridProps {
  collections: CollectionDetail[];
}

function CollectionGridComponent({ collections }: CollectionGridProps) {
  const collectionsWithImages = useMemo(
    () =>
      collections.filter(
        (collection) =>
          collection.image &&
          collection.image.url &&
          collection.image.url.trim() !== '' &&
          collection.image.url !== '/images/placeholder.jpg' &&
          !collection.image.url.includes('placeholder')
      ),
    [collections]
  );

  if (collectionsWithImages.length === 0) return null;

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 overflow-x-auto pb-4 md:scrollbar-hide justify-start md:justify-center pl-4 md:pl-0 sm:snap-x sm:snap-mandatory md:snap-none">
          {collectionsWithImages.map((collection) => (
            <Link
              key={collection.id}
              href={`/collection/${collection.alias}`}
              className="flex-shrink-0 sm:snap-start"
            >
              <Card className="gap-2 group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500 border-2 border-gray-200 w-48">
                <div className="relative flex items-center justify-center bg-white">
                  <Image
                    src={collection.image?.url || '/images/placeholder.jpg'}
                    alt={collection.name}
                    className="w-[60px] h-[60px] object-contain"
                    width={60}
                    height={60}
                  />
                </div>

                <CardContent>
                  <h3 className="text-center font-medium text-sm text-gray-900 group-hover:text-red-600 line-clamp-2 transition-colors duration-300">
                    {collection.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export const CollectionGrid = memo(CollectionGridComponent);
