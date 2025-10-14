import { ProductDetailView } from '@/sections';

interface ProductDetailPageProps {
  params: Promise<{
    alias: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { alias } = await params;
  return <ProductDetailView alias={alias} />;
}
