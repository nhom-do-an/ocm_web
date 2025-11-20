'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Package, Eye, Loader2 } from 'lucide-react';
import { orderService } from '@/services/api';
import { Order, OrderStatus, FinancialStatus, FulfillmentStatus } from '@/types/api';
import { toast } from 'react-toastify';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
} from '@/components/ui/pagination';

interface OrderHistoryTabProps {
  onBack: () => void;
}

export default function OrderHistoryTab({ onBack }: OrderHistoryTabProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders({
        page,
        size: pageSize,
        sort_field: 'created_at',
        sort_type: 'desc',
      });
      setOrders(response.orders || []);
      setTotalCount(response.count || 0);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusLabel = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.Open]: 'Mở',
      [OrderStatus.Confirmed]: 'Đã xác nhận',
      [OrderStatus.Completed]: 'Hoàn thành',
      [OrderStatus.Canceled]: 'Đã hủy',
      [OrderStatus.Closed]: 'Đã đóng',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: OrderStatus) => {
    const colorMap: Record<OrderStatus, string> = {
      [OrderStatus.Open]: 'bg-blue-100 text-blue-800',
      [OrderStatus.Confirmed]: 'bg-green-100 text-green-800',
      [OrderStatus.Completed]: 'bg-purple-100 text-purple-800',
      [OrderStatus.Canceled]: 'bg-red-100 text-red-800',
      [OrderStatus.Closed]: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getFinancialStatusLabel = (status: FinancialStatus) => {
    const statusMap: Record<FinancialStatus, string> = {
      [FinancialStatus.Unpaid]: 'Chưa thanh toán',
      [FinancialStatus.PartialPaid]: 'Thanh toán một phần',
      [FinancialStatus.Paid]: 'Đã thanh toán',
    };
    return statusMap[status] || status;
  };

  const handleViewOrder = (orderId: number) => {
    router.push(`/checkout/success?orderId=${orderId}`);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Bạn chưa có đơn hàng nào</p>
            <p className="text-sm text-gray-500">Các đơn hàng của bạn sẽ hiển thị ở đây</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Đơn hàng #{order.order_number || order.id}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Ngày đặt: {formatDate(order.created_at)}</p>
                          <p>Trạng thái thanh toán: {getFinancialStatusLabel(order.financial_status)}</p>
                          {order.note && (
                            <p className="text-gray-500 italic">Ghi chú: {order.note}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrder(order.id)}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={page === 1 || loading}
                      onClick={(e) => {
                        e.preventDefault();
                        if (page > 1 && !loading) {
                          setPage((prev) => prev - 1);
                        }
                      }}
                    />
                  </PaginationItem>

                  <PaginationPages
                    totalPages={totalPages}
                    currentPage={page}
                    onPageClick={(newPage) => {
                      if (newPage !== page && !loading) {
                        setPage(newPage);
                      }
                    }}
                  />

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={page === totalPages || loading}
                      onClick={(e) => {
                        e.preventDefault();
                        if (page < totalPages && !loading) {
                          setPage((prev) => prev + 1);
                        }
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}






