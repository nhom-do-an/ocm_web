import dynamic from 'next/dynamic';

const CartView = dynamic(() => import('@/sections').then(mod => ({ default: mod.CartView })), {
  loading: () => <div className="container mx-auto px-4 py-8"><div className="text-center">Đang tải...</div></div>,
  ssr: true
});

export default function CartPage() {
  return <CartView />;
}
