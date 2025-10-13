import { CollectionView } from '@/sections';

interface CollectionPageProps {
  params: Promise<{
    alias: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { alias } = await params;
  return <CollectionView alias={alias} />;
}
