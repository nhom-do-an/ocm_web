import dynamic from 'next/dynamic';

const CheckoutSuccessView = dynamic(
  () => import('@/sections').then((mod) => ({ default: mod.CheckoutSuccessView })),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    ),
    ssr: true,
  }
);

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessView />;
}


