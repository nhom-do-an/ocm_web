'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { removeFromCart, updateQuantity, setCartOpen } from '@/redux/slices/cartSlice';
import { formatPrice } from '@/utils';

export function ShoppingCart() {
  const dispatch = useAppDispatch();
  const { items, isOpen, total } = useAppSelector((state) => state.cart);

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Giỏ hàng ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4 px-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Giỏ hàng trống</h3>
              <p className="mt-1 text-sm text-gray-500">
                Thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm
              </p>
            </div>
            <Button onClick={handleClose} className="w-full" asChild>
              <Link href="/">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <img
                        src={
                          item.selectedVariant?.image?.url ||
                          item.product.images?.[0]?.url ||
                          '/images/placeholder.jpg'
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium leading-tight line-clamp-2">
                        {item.product.name}
                      </h3>

                      <div className="text-xs text-gray-500">
                          {item.selectedVariant.title !== "Default Title" ? <span> {item.selectedVariant.title}</span> : <span>-</span>}
                      </div>
                      

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-red-500">
                          {formatPrice(
                            (item.unitPrice ?? item.selectedVariant?.price ?? item.product.variants?.[0]?.price) || 0
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Tổng cộng:</span>
                  <span className="text-red-500 text-2xl font-bold">{formatPrice(total)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Thanh toán</Link>
                  </Button>

                  <Button variant="outline" className="w-full" onClick={handleClose} asChild>
                    <Link href="/cart">Xem giỏ hàng</Link>
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="link" onClick={handleClose} asChild>
                    <Link href="/" className="text-sm text-gray-500">
                      Tiếp tục mua sắm
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
