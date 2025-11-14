'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logoutUser } from '@/redux/slices/authSlice';
import { toast } from 'react-toastify';
import { User, MapPin, Lock, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AccountInfoTab from '../components/account-info-tab';
import AddressManagementTab from '../components/address-management-tab';
import ChangePasswordTab from '../components/change-password-tab';
import OrderHistoryTab from '../components/order-history-tab';

type TabType = 'account' | 'addresses' | 'password' | 'logout';

export default function ProfileView() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Đăng xuất thành công');
      router.push('/');
    } catch (error: any) {
      toast.error(error || 'Đăng xuất thất bại');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin tài khoản</p>
        </div>
      </div>
    );
  }

  const displayName = user.first_name && user.last_name 
    ? `${user.first_name} ${user.last_name}` 
    : user.first_name || user.email || user.phone || 'Người dùng';

  const tabs = [
    { id: 'account' as TabType, label: 'Thông tin tài khoản', icon: User },
    { id: 'addresses' as TabType, label: 'Quản lý địa chỉ', icon: MapPin },
    { id: 'password' as TabType, label: 'Đổi mật khẩu', icon: Lock },
    { id: 'logout' as TabType, label: 'Đăng xuất', icon: LogOut },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav className="space-y-1 p-4">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const isLogout = tab.id === 'logout';

                    if (isLogout) {
                      return (
                        <button
                          key={tab.id}
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors hover:bg-red-50 hover:text-red-600 text-gray-700 cursor-pointer"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-red-50 text-red-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {showOrderHistory ? (
              <OrderHistoryTab onBack={() => setShowOrderHistory(false)} />
            ) : (
              <Card>
                <CardContent className="p-6">
                  {/* Top Section - Order History & Welcome */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowOrderHistory(true)}
                      className="h-auto p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                    >
                      <Package className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Lịch sử đơn hàng</div>
                        <div className="text-sm text-gray-500">Xem các đơn hàng đã đặt</div>
                      </div>
                    </Button>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
                      <div className="text-sm text-gray-600 mb-1">Xin chào</div>
                      <div className="text-lg font-bold text-gray-900">{displayName}</div>
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6">
                    {activeTab === 'account' && <AccountInfoTab user={user} />}
                    {activeTab === 'addresses' && <AddressManagementTab />}
                    {activeTab === 'password' && <ChangePasswordTab />}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}







