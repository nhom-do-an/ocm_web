'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Clock, Mail, Store, Building2 } from 'lucide-react';
import { CONTACT_INFO } from '@/constants/site';
import { useAppSelector } from '@/hooks/redux';
import { LocationStatus } from '@/types/api';

export default function StoresView() {
  const [mounted, setMounted] = useState(false);
  const { store, locations, locationsLoading } = useAppSelector((state) => state.store);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use store data if available (only after mounting)
  const storePhone = mounted && store?.phone ? store.phone : CONTACT_INFO.phone;

  // Filter active locations only (only after mounting)
  const activeLocations = mounted
    ? locations.filter((loc) => loc.status === LocationStatus.Active)
    : [];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hệ thống cửa hàng</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tìm cửa hàng gần bạn nhất để trải nghiệm và mua sắm trực tiếp
        </p>
      </div>

      {/* Loading state */}
      {(!mounted || locationsLoading) && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-gray-600">Đang tải danh sách cửa hàng...</span>
        </div>
      )}

      {/* Stores Grid */}
      {!locationsLoading && activeLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Store className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{location.name}</h3>
                    {location.code && (
                      <span className="text-xs text-gray-500">Mã: {location.code}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{location.address}</p>
                  </div>

                  {location.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <a
                        href={`tel:${location.phone}`}
                        className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>
                  )}

                  {location.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <a
                        href={`mailto:${location.email}`}
                        className="text-sm text-gray-700 hover:text-red-600 transition-colors"
                      >
                        {location.email}
                      </a>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{CONTACT_INFO.workingHours}</p>
                  </div>
                </div>

                {location.default_location && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      <Building2 className="h-3 w-3" />
                      Chi nhánh chính
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !locationsLoading ? (
        <div className="text-center py-12 mb-12">
          <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Chưa có thông tin chi nhánh</p>
        </div>
      ) : null}

      {/* Online Store Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mua sắm trực tuyến</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Bạn có thể mua sắm mọi lúc, mọi nơi thông qua website của chúng tôi. Giao hàng toàn quốc, thanh toán
            an toàn và tiện lợi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              Đặt hàng online 24/7
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              Giao hàng toàn quốc
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              Thanh toán an toàn
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              Đổi trả dễ dàng
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-2">
          <strong>Hotline hỗ trợ:</strong>{' '}
          <a href={`tel:${storePhone}`} className="text-red-600 hover:text-red-700 font-semibold">
            {storePhone}
          </a>
        </p>
        <p className="text-sm text-gray-500">{CONTACT_INFO.workingHours}</p>
      </div>
    </div>
  );
}
