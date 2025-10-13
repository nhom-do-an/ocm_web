import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CollectionDetail } from '@/types/collection';


interface CollectionGridProps {
  collections: CollectionDetail[];
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 lg:text-3xl">Danh mục nổi bật</h2>
          <p className="mt-2 text-gray-600">Khám phá các sản phẩm gia dụng cao cấp</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collection/${collection.alias}`}>
              <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                  <div className="relative aspect-square">
                    <img
                      src={collection.attachments?.url || '/images/placeholder.jpg'}
                      alt={collection.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>                  <CardContent className="p-4">
                    <h3 className="text-center font-medium text-gray-900 group-hover:text-primary">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="mt-1 text-center text-xs text-gray-500 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
