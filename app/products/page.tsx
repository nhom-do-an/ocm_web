import dynamic from 'next/dynamic';

const ProductsView = dynamic(() => import('@/sections').then(mod => ({ default: mod.ProductsView })), {
  loading: () => <div className="container mx-auto px-4 py-8"><div className="text-center">Đang tải...</div></div>,
  ssr: true
});

export default function ProductsPage() {
  return <ProductsView />;
}
