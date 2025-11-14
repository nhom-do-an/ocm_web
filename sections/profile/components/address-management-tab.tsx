'use client';

import { useState, useEffect } from 'react';
import { addressService } from '@/services/api';
import { AddressDetail } from '@/types/api';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import AddressFormDialog from './address-form-dialog';

export default function AddressManagementTab() {
  const [addresses, setAddresses] = useState<AddressDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDetail | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error?.message || 'Không thể tải danh sách địa chỉ');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (address: AddressDetail) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;

    try {
      await addressService.deleteAddress(id);
      toast.success('Xóa địa chỉ thành công');
      fetchAddresses();
    } catch (error: any) {
      toast.error(error?.message || 'Không thể xóa địa chỉ');
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý địa chỉ
          {!loading && addresses.length > 0 && (
            <span className="ml-2 text-lg font-normal text-gray-500">
              ({addresses.length})
            </span>
          )}
        </h2>
        <Button onClick={handleAdd} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa chỉ
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào</p>
            <Button onClick={handleAdd} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.default_address ? 'border-red-500 border-2' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.default_address && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Mặc định</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>{address.phone}</div>
                      <div>{address.email}</div>
                      <div className="mt-2">
                        {[
                          address.address,
                          address.ward_name,
                          address.district_name,
                          address.province_name,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(address)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Chỉnh sửa
                  </Button>
                  {!address.default_address && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="cursor-pointer text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddressFormDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        address={editingAddress}
      />
    </div>
  );
}



