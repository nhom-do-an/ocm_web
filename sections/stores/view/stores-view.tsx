'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { CONTACT_INFO } from '@/constants/site';

export default function StoresView() {
  const stores = [
    {
      id: 1,
      name: 'Cửa hàng Hà Nội',
      address: 'Tầng 17 toà nhà 319 Bộ Quốc Phòng, phường Yên Hòa, quận Cầu Giấy, Hà Nội',
      phone: '024 1234 5678',
      email: 'hanoi@ocmstore.vn',
      hours: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
      mapUrl: '#',
    },
    {
      id: 2,
      name: 'Cửa hàng TP. Hồ Chí Minh',
      address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      phone: '028 1234 5678',
      email: 'hcm@ocmstore.vn',
      hours: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
      mapUrl: '#',
    },
    {
      id: 3,
      name: 'Cửa hàng Đà Nẵng',
      address: '456 Đường Trần Phú, Quận Hải Châu, Đà Nẵng',
      phone: '0236 1234 5678',
      email: 'danang@ocmstore.vn',
      hours: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
      mapUrl: '#',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hệ thống cửa hàng</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tìm cửa hàng gần bạn nhất để trải nghiệm và mua sắm trực tiếp
        </p>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{store.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{store.address}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <a href={`tel:${store.phone}`} className="text-sm text-gray-700 hover:text-red-600">
                    {store.phone}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <a href={`mailto:${store.email}`} className="text-sm text-gray-700 hover:text-red-600">
                    {store.email}
                  </a>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{store.hours}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <a
                  href={store.mapUrl}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                >
                  <MapPin className="h-4 w-4" />
                  Xem trên bản đồ
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Online Store Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mua sắm trực tuyến</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bạn có thể mua sắm mọi lúc, mọi nơi thông qua website của chúng tôi. Giao hàng toàn quốc, thanh toán
            an toàn và tiện lợi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>🛒 Đặt hàng online 24/7</span>
            <span>🚚 Giao hàng toàn quốc</span>
            <span>💳 Thanh toán an toàn</span>
            <span>🔄 Đổi trả dễ dàng</span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-2">
          <strong>Hotline hỗ trợ:</strong>{' '}
          <a href={`tel:${CONTACT_INFO.phone}`} className="text-red-600 hover:text-red-700 font-semibold">
            {CONTACT_INFO.phone}
          </a>
        </p>
        <p className="text-sm text-gray-500">{CONTACT_INFO.workingHours}</p>
      </div>
    </div>
  );
}

