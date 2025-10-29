import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CollectionDetail } from '@/types/collection';

interface CollectionGridProps {
  collections: CollectionDetail[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  const collectionsWithImages = collections.filter(
    (collection) =>
      collection.image &&
      collection.image.url &&
      collection.image.url.trim() !== '' &&
      collection.image.url !== '/images/placeholder.jpg' &&
      !collection.image.url.includes('placeholder')
  );

  if (collectionsWithImages.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 lg:text-2xl">
            Danh mục nổi bật
          </h2>
          <p className="mt-1 text-gray-600">
            Khám phá các sản phẩm cao cấp
          </p>
        </div>

  <div className="flex gap-4 overflow-x-auto pb-4 md:scrollbar-hide justify-start md:justify-center pl-4 md:pl-0 sm:snap-x sm:snap-mandatory md:snap-none">
          {collectionsWithImages.map((collection) => (
            <Link
              key={collection.id}
              href={`/collection/${collection.alias}`}
              className="flex-shrink-0 sm:snap-start"
            >
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500 border-2 border-transparent w-48">
                <div className="relative aspect-[3/2] flex items-center justify-center bg-white">
                  <img
                    src={collection.image?.url}
                    alt={collection.name}
                    className="max-w-full max-h-full object-contain"
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
