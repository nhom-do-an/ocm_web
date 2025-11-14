'use client';

import { useEffect, useState } from 'react';
import { CustomerAuthResponse } from '@/types/api';
import { addressService } from '@/services/api';
import { AddressDetail } from '@/types/api';
import { Card, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface AccountInfoTabProps {
  user: CustomerAuthResponse;
}

export default function AccountInfoTab({ user }: AccountInfoTabProps) {
  const [defaultAddress, setDefaultAddress] = useState<AddressDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const addresses = await addressService.getAddresses();
        if (addresses && Array.isArray(addresses)) {
          const defaultAddr = addresses.find((addr) => addr.default_address);
          setDefaultAddress(defaultAddr || null);
        } else {
          setDefaultAddress(null);
        }
      } catch (error) {
        console.error('Failed to fetch default address:', error);
        setDefaultAddress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultAddress();
  }, []);

  const displayName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user.first_name || 'Chưa cập nhật';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Thông tin tài khoản</h2>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <User className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Họ và tên</div>
                <div className="text-lg font-semibold text-gray-900">{displayName}</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Email</div>
                <div className="text-lg font-semibold text-gray-900">{user.email || 'Chưa cập nhật'}</div>
                {user.verified_email && (
                  <span className="text-xs text-green-600 mt-1 inline-block">✓ Đã xác thực</span>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Số điện thoại</div>
                <div className="text-lg font-semibold text-gray-900">
                  {defaultAddress?.phone || user.phone || 'Chưa cập nhật'}
                </div>
              </div>
            </div>

            {defaultAddress && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">Địa chỉ</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {[
                      defaultAddress.address,
                      defaultAddress.ward_name,
                      defaultAddress.district_name,
                      defaultAddress.province_name,
                    ]
                      .filter(Boolean)
                      .join(', ') || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

