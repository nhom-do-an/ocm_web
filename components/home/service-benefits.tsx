'use client';

import { Truck, Shield, Gift, Headphones } from 'lucide-react';

const benefits = [
  {
    icon: Truck,
    title: 'FREESHIP',
    subtitle: 'cho đơn hàng từ 1.000.000đ',
    color: 'text-green-600',
  },
  {
    icon: Truck,
    title: 'Giao hàng 4h nội thành HN/HCM',
    subtitle: 'theo nhu cầu',
    color: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Bảo hành chính hãng đến 24 tháng',
    subtitle: '1 đổi 1 tới 12 tháng',
    color: 'text-emerald-600',
  },
  {
    icon: Gift,
    title: 'Voucher giảm 💳 300K',
    subtitle: 'cho đơn hàng từ 2.799K',
    color: 'text-purple-600',
  },
];

export function ServiceBenefits() {
  return (
    <div className="bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className={`p-2 rounded-full bg-gray-100`}>
                  <Icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-600">{benefit.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}