import dynamic from 'next/dynamic';

const CheckoutView = dynamic(() => import('@/sections').then(mod => ({ default: mod.CheckoutView })), {
  loading: () => <div className="container mx-auto px-4 py-8"><div className="text-center">Đang tải...</div></div>,
  ssr: true
});

export default function CheckoutPage() {
  return <CheckoutView />;
}

