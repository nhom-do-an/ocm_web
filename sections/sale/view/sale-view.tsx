'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Gift, Percent, Sparkles } from 'lucide-react';

export default function SaleView() {
  const promotions = [
    {
      id: 1,
      title: 'Giảm giá 50% cho tất cả sản phẩm nồi chảo',
      description: 'Áp dụng cho toàn bộ sản phẩm nồi chảo Elmich. Không áp dụng với các chương trình khuyến mãi khác.',
      discount: '50%',
      validUntil: '31/12/2024',
      icon: <Percent className="h-8 w-8" />,
    },
    {
      id: 2,
      title: 'Mua 2 tặng 1 - Bình giữ nhiệt',
      description: 'Mua 2 bình giữ nhiệt bất kỳ, tặng ngay 1 bình giữ nhiệt loại nhỏ. Áp dụng có hạn.',
      discount: 'Mua 2 tặng 1',
      validUntil: '30/11/2024',
      icon: <Gift className="h-8 w-8" />,
    },
    {
      id: 3,
      title: 'Miễn phí vận chuyển toàn quốc',
      description: 'Miễn phí vận chuyển cho mọi đơn hàng từ 500.000đ. Áp dụng cho tất cả sản phẩm.',
      discount: 'Miễn phí',
      validUntil: 'Thường xuyên',
      icon: <ShoppingBag className="h-8 w-8" />,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-red-600" />
          <h1 className="text-4xl font-bold text-gray-900">Khuyến mãi đặc biệt</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá các chương trình khuyến mãi hấp dẫn và ưu đãi độc quyền dành riêng cho bạn
        </p>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {promotions.map((promo) => (
          <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                  {promo.icon}
                </div>
                <div className="flex-1">
                  <Badge className="mb-2 bg-red-600 text-white">{promo.discount}</Badge>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{promo.description}</p>
                  <p className="text-xs text-gray-500">
                    Áp dụng đến: <span className="font-semibold">{promo.validUntil}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nhiều ưu đãi hấp dẫn đang đến</h2>
          <p className="text-gray-600 mb-6">
            Chúng tôi đang chuẩn bị nhiều chương trình khuyến mãi đặc biệt. Hãy theo dõi để không bỏ lỡ!
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>🎁 Flash Sale hàng tuần</span>
            <span>💝 Ưu đãi sinh nhật</span>
            <span>🎉 Sự kiện đặc biệt</span>
            <span>⭐ Giảm giá combo</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

