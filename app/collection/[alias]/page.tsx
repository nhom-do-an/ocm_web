import dynamic from 'next/dynamic';

const CollectionView = dynamic(() => import('@/sections').then(mod => ({ default: mod.CollectionView })), {
  loading: () => <div className="container mx-auto px-4 py-8"><div className="text-center">Đang tải...</div></div>,
  ssr: true
});

interface CollectionPageProps {
  params: Promise<{
    alias: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { alias } = await params;
  return <CollectionView alias={alias} />;
}
