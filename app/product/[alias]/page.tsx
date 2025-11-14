import dynamic from 'next/dynamic';

const ProductDetailView = dynamic(() => import('@/sections').then(mod => ({ default: mod.ProductDetailView })), {
  loading: () => <div className="container mx-auto px-4 py-8"><div className="text-center">Đang tải...</div></div>,
  ssr: true
});

interface ProductDetailPageProps {
  params: Promise<{
    alias: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { alias } = await params;
  return <ProductDetailView alias={alias} />;
}
