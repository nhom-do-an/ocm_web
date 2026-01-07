'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { orderService } from '@/services/api';
import { OrderDetail, OrderStatus } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Home, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function CheckoutSuccessView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        toast.error('Không tìm thấy thông tin đơn hàng');
        router.push('/');
        return;
      }

      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (error: any) {
        console.error('Failed to load order:', error);
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const lineItemsSubtotal = useMemo(() => {
    if (!order?.line_items) return 0;
    return order.line_items.reduce((sum: number, item: any) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      return sum + price * quantity;
    }, 0);
  }, [order]);

  const subtotalPrice =
    typeof order?.subtotal_price === 'number' ? order.subtotal_price : lineItemsSubtotal;

  const shippingPrice = useMemo(() => {
    if (typeof order?.total_shipping_price === 'number') {
      return order.total_shipping_price;
    }
    if (order?.shipping_lines?.length) {
      return order.shipping_lines.reduce((sum: number, line: any) => {
        const linePrice =
          typeof line.price === 'number'
            ? line.price
            : typeof line.total_price === 'number'
              ? line.total_price
              : 0;
        return sum + linePrice;
      }, 0);
    }
    return 0;
  }, [order]);

  const discountTotal =
    typeof order?.total_discount === 'number' ? order.total_discount : 0;

  const grandTotal =
    typeof order?.total_price === 'number'
      ? order.total_price
      : subtotalPrice + shippingPrice - discountTotal;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy thông tin đơn hàng</p>
          <Button onClick={() => router.push('/')}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>
        </div>

        {/* Order Info Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Thông tin đơn hàng</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold">#{order.order_number || order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt hàng:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {order.status === OrderStatus.Open ? 'Mở' :
                    order.status === OrderStatus.Confirmed ? 'Đã xác nhận' :
                      order.status === OrderStatus.Completed ? 'Hoàn thành' :
                        order.status === OrderStatus.Canceled ? 'Đã hủy' :
                          order.status === OrderStatus.Closed ? 'Đã đóng' : order.status}
                </span>
              </div>
              {order.shipping_address && (
                <div>
                  <span className="text-gray-600">Địa chỉ giao hàng:</span>
                  <p className="mt-1 text-gray-900">
                    {[
                      order.shipping_address.address,
                      order.shipping_address.ward_name,
                      order.shipping_address.district_name,
                      order.shipping_address.province_name,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sản phẩm đã đặt</h2>
            <div className="space-y-4">
              {order.line_items?.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-300">
                    <Image
                      src={item.image_url || '/images/placeholder.jpg'}
                      alt={item.product_name || 'product'}
                      className="w-full h-full object-cover"
                      width={80}
                      height={80}
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                      {item.quantity || 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.product_name || 'Sản phẩm'}
                    </h3>
                    {item.variant_title && (
                      <p className="text-sm text-gray-600 mb-1">{item.variant_title}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice((item.price || 0) * (item.quantity || 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{formatPrice(subtotalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(shippingPrice)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Tổng cộng:</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={() => router.push('/account?view=orders')}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Xem đơn hàng của tôi
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
            onClick={() => router.push('/products')}
          >
            <Home className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  );
}

