'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import React, { useEffect, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { removeLineItemApi, updateLineItemApi, clearCartApi, fetchCart } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/navigation';
import { checkoutService } from '@/services/api';
import { toast } from 'react-toastify';

export default function CartView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, total, itemCount, status } = useAppSelector((state) => state.cart);
  const [mounted, setMounted] = React.useState(false);

  const handleQuantityChange = useCallback((itemId: number | string, newQuantity: number) => {
    dispatch(updateLineItemApi({ line_item_id: itemId, quantity: newQuantity }));
  }, [dispatch]);

  const handleRemoveItem = useCallback((itemId: number | string) => {
    dispatch(removeLineItemApi({ line_item_id: itemId }));
  }, [dispatch]);

  const handleClearCart = useCallback(() => {
    dispatch(clearCartApi());
  }, [dispatch]);

  const handleCheckout = useCallback(async () => {
    try {
      // Gọi API để lấy checkout token từ cart
      const checkout = await checkoutService.getCheckoutByCart({});
      // Chuyển đến trang checkout với token
      router.push(`/checkout?token=${checkout.token}`);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể tạo phiên thanh toán');
      console.error('Checkout error:', error);
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCart());
  }, [dispatch]);

  // Show loading state during initial load or if not mounted (SSR)
  if (!mounted || status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show empty cart only after cart has been loaded
  if (status === 'succeeded' && items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mb-6">Giỏ hàng của bạn đang trống</p>
          <Button onClick={() => router.push('/products')}>Tiếp tục mua sắm</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url || '/images/placeholder.jpg'}
                        alt={item.product_name || 'product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{item.product_name ?? 'Product'}</h3>

                      <div className="text-sm text-gray-600 mb-2">
                          {item.variant_title !== 'Default Title' ? <span>{item.variant_title}</span> : <span>-</span>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-red-600">{(item.price ?? 0).toLocaleString()}đ</span>
                            {((item.original_price ?? 0) > (item.price ?? 0)) && (
                              <span className="text-sm text-gray-400 line-through">
                                {(item.original_price ?? 0).toLocaleString()}đ
                              </span>
                            )}
                          </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, Math.max(1, (item.quantity ?? 0) - 1))}
                            disabled={(item.quantity ?? 0) <= 1}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity ?? 0}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, (item.quantity ?? 0) + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="ml-2 text-red-600 hover:text-red-700"
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right mt-2">
                        <span className="font-medium">
                          Tổng: {(((item.price ?? 0) * (item.quantity ?? 0))).toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Clear Cart */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700"
            >
              Xóa tất cả
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Số lượng sản phẩm:</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-red-600">{total.toLocaleString()}đ</span>
                </div>
              </div>

              <Button size="lg" className="w-full mb-3 cursor-pointer" onClick={handleCheckout}>
                Tiến hành thanh toán
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full cursor-pointer"
                onClick={() => router.push('/products')}
              >
                Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
