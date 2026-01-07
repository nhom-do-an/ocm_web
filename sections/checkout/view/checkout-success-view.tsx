'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { orderService, paymentMethodsService } from '@/services/api';
import { OrderDetail, OrderStatus, FinancialStatus, OrderQRPaymentResponse, PaymentMethodDetail } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Package, Home, ShoppingBag, CreditCard, Copy, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import Image from 'next/image';

// Global loading component
function CheckoutSuccessLoading() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Đang tải thông tin đơn hàng...</p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [qrPayment, setQrPayment] = useState<OrderQRPaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDetail | null>(null);

  useEffect(() => {
    const loadOrderAndQR = async () => {
      if (!orderId) {
        toast.error('Không tìm thấy thông tin đơn hàng');
        router.push('/');
        return;
      }

      try {
        // First, fetch order details
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);

        // Check if order needs QR payment:
        // - Financial status is unpaid or partial_paid
        // - Has payment method lines with payment_method_id
        const needsPaymentCheck =
          orderData.financial_status !== FinancialStatus.Paid &&
          orderData.payment_method_lines && orderData.payment_method_lines.length > 0;

        if (needsPaymentCheck) {
          // Get first payment method line's payment_method_id
          const firstPaymentLine = orderData.payment_method_lines?.[0];
          const paymentMethodId = firstPaymentLine?.payment_method_id;

          if (paymentMethodId) {
            try {
              // Fetch payment method detail to check if it has beneficiary_account_id
              const paymentMethod = await paymentMethodsService.getPaymentMethod(paymentMethodId);

              if (paymentMethod?.beneficiary_account_id) {
                // Fetch QR payment with beneficiary_account_id from payment method
                const qrData = await orderService.getOrderQRPayment(orderId, {
                  beneficiary_account_id: paymentMethod.beneficiary_account_id,
                });
                setQrPayment(qrData);
                setPaymentMethod(paymentMethod);
              }
            } catch (qrError) {
              console.error('Failed to load QR payment:', qrError);
              // Don't show error toast - QR is optional enhancement
            }
          }
        }
      } catch (error: any) {
        console.error('Failed to load order:', error);
        toast.error('Không thể tải thông tin đơn hàng');
      } finally {
        setLoading(false);
      }
    };

    loadOrderAndQR();
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

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Đã sao chép!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Không thể sao chép');
    }
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

  // Show global loading
  if (loading) {
    return <CheckoutSuccessLoading />;
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
      <div className="max-w-6xl mx-auto">
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

        {/* Two-column layout */}
        <div className={`grid gap-6 ${qrPayment ? 'lg:grid-cols-3' : 'lg:grid-cols-1 max-w-3xl mx-auto'}`}>
          {/* Left Column - Order Info */}
          <div className="space-y-6 lg:col-span-2 col-span-1">
            {/* Order Info Card */}
            <Card>
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
            <Card>
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
          </div>

          {/* Right Column - Payment Info (only shown if QR available) */}
          {qrPayment && (
            <div className="space-y-6 col-span-1">
              <Card className="border-2 border-blue-200 bg-blue-50/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-blue-900">Thông tin thanh toán</h2>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                      <Image
                        src={qrPayment.qr_url}
                        alt="QR Code thanh toán"
                        width={200}
                        height={200}
                        className="w-[200px] h-[200px]"
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Quét mã QR bằng ứng dụng ngân hàng để thanh toán
                    </p>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-1">
                    {/* Amount */}
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className=''>
                          <p className="text-sm text-gray-500">Số tiền cần thanh toán</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {formatPrice(qrPayment.amount)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => copyToClipboard(qrPayment.amount.toString(), 'amount')}
                        >
                          {copiedField === 'amount' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Bank Name */}
                    {paymentMethod && paymentMethod.beneficiary_account && paymentMethod.beneficiary_account.bank_name && <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className='flex gap-2 items-center'>
                          <p className="text-sm text-gray-500">Ngân hàng: </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {paymentMethod.beneficiary_account.bank_short_name}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => copyToClipboard(paymentMethod?.beneficiary_account?.bank_short_name || '', 'bank')}
                        >
                          {copiedField === 'bank' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    }


                    {/* Account Number */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className='flex gap-2 items-center'>
                          <p className="text-sm text-gray-500">Số tài khoản: </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {qrPayment.account_number}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => copyToClipboard(qrPayment.account_number, 'account')}
                        >
                          {copiedField === 'account' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Account Name */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className='flex gap-2 items-center'>
                          <p className="text-sm text-gray-500">Tên tài khoản: </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {qrPayment.account_name}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9"
                          onClick={() => copyToClipboard(qrPayment.account_name, 'name')}
                        >
                          {copiedField === 'name' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Transfer Description */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-2">
                          <p className="text-sm text-gray-500">Nội dung chuyển khoản</p>
                          <p className="text-lg font-semibold text-gray-900 break-all">
                            {qrPayment.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 flex-shrink-0"
                          onClick={() => copyToClipboard(qrPayment.description, 'description')}
                        >
                          {copiedField === 'description' ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Vui lòng nhập đúng nội dung chuyển khoản để đơn hàng được xác nhận nhanh chóng.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-3xl mx-auto">
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
    </div >
  );
}
