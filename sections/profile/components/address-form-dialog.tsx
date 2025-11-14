'use client';

import { useState, useEffect } from 'react';
import { addressService, regionsService } from '@/services/api';
import { AddressDetail, CreateCustomerAddressRequest, UpdateCustomerAddressRequest } from '@/types/api';
import { Region, RegionType } from '@/types/region';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

const addressSchema = z.object({
  first_name: z.string().min(1, 'Họ là bắt buộc').min(2, 'Họ phải có ít nhất 2 ký tự'),
  last_name: z.string().min(1, 'Tên là bắt buộc').min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(1, 'Số điện thoại là bắt buộc').regex(/^0[35789][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  email: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
  province_code: z.string().min(1, 'Tỉnh/Thành phố là bắt buộc'),
  district_code: z.string().min(1, 'Quận/Huyện là bắt buộc'),
  ward_code: z.string().min(1, 'Phường/Xã là bắt buộc'),
});

interface AddressFormDialogProps {
  open: boolean;
  onClose: () => void;
  address?: AddressDetail | null;
}

export default function AddressFormDialog({ open, onClose, address }: AddressFormDialogProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    zip: '',
    province_code: '',
    district_code: '',
    ward_code: '',
    is_default: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Regions data
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [wards, setWards] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);

  useEffect(() => {
    if (open) {
      if (address) {
        setFormData({
          first_name: address.first_name || '',
          last_name: address.last_name || '',
          phone: address.phone || '',
          email: address.email || '',
          address: address.address || '',
          zip: address.zip || '',
          province_code: address.province_code || '',
          district_code: address.district_code || '',
          ward_code: address.ward_code || '',
          is_default: address.default_address || false,
        });
        // Load regions if editing
        if (address.province_code) {
          loadDistricts(address.province_code);
          if (address.district_code) {
            loadWards(address.district_code);
          }
        }
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          phone: '',
          email: '',
          address: '',
          zip: '',
          province_code: '',
          district_code: '',
          ward_code: '',
          is_default: false,
        });
      }
      loadProvinces();
      setErrors({});
    }
  }, [open, address]);

  const loadProvinces = async () => {
    try {
      setLoadingRegions(true);
      const response = await regionsService.getOldRegions('VN', 2);
      if (response && response.success) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error('Failed to load provinces:', error);
      toast.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadDistricts = async (provinceCode: string) => {
    try {
      setLoadingRegions(true);
      const response = await regionsService.getOldRegions(provinceCode, 3);
      if (response && response.success) {
        setDistricts(response.data);
        setWards([]);
        if (!address || address.province_code !== provinceCode) {
          setFormData((prev) => ({ ...prev, district_code: '', ward_code: '' }));
        }
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
      toast.error('Không thể tải danh sách quận/huyện');
    } finally {
      setLoadingRegions(false);
    }
  };

  const loadWards = async (districtCode: string) => {
    try {
      setLoadingRegions(true);
      const response = await regionsService.getOldRegions(districtCode, 4);
      if (response && response.success) {
        setWards(response.data);
        if (!address || address.district_code !== districtCode) {
          setFormData((prev) => ({ ...prev, ward_code: '' }));
        }
      }
    } catch (error) {
      console.error('Failed to load wards:', error);
      toast.error('Không thể tải danh sách phường/xã');
    } finally {
      setLoadingRegions(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    // Auto-load districts when province changes
    if (field === 'province_code' && typeof value === 'string') {
      loadDistricts(value);
    }
    // Auto-load wards when district changes
    if (field === 'district_code' && typeof value === 'string') {
      loadWards(value);
    }
  };

  const validateForm = () => {
    try {
      addressSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      if (address) {
        const updateData: UpdateCustomerAddressRequest = {
          id: address.id,
          ...formData,
          is_province_changed: address.province_code !== formData.province_code,
          is_district_changed: address.district_code !== formData.district_code,
          is_ward_changed: address.ward_code !== formData.ward_code,
          is_new_address: false,
        };
        await addressService.updateAddress(updateData);
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        const createData: CreateCustomerAddressRequest = {
          ...formData,
          is_new_address: true,
        };
        await addressService.createAddress(createData);
        toast.success('Thêm địa chỉ thành công');
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Họ *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                placeholder="Nhập họ"
                className={errors.first_name ? 'border-red-500' : ''}
              />
              {errors.first_name && (
                <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">Tên *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                placeholder="Nhập tên"
                className={errors.last_name ? 'border-red-500' : ''}
              />
              {errors.last_name && (
                <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, '');
                if (value && !value.startsWith('0')) {
                  value = '0' + value.replace(/^0+/, '');
                }
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }
                handleChange('phone', value);
              }}
              placeholder="0987654321"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="email@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Số nhà, tên đường"
            />
          </div>

          <div>
            <Label htmlFor="province_code">Tỉnh/Thành phố *</Label>
            <Select
              value={formData.province_code}
              onValueChange={(value) => handleChange('province_code', value)}
              disabled={loadingRegions}
            >
              <SelectTrigger className={errors.province_code ? 'border-red-500' : ''}>
                <SelectValue placeholder="Chọn tỉnh/thành phố" />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province.code} value={province.code}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.province_code && (
              <p className="text-sm text-red-600 mt-1">{errors.province_code}</p>
            )}
          </div>

          <div>
            <Label htmlFor="district_code">Quận/Huyện *</Label>
            <Select
              value={formData.district_code}
              onValueChange={(value) => handleChange('district_code', value)}
              disabled={loadingRegions || !formData.province_code}
            >
              <SelectTrigger className={errors.district_code ? 'border-red-500' : ''}>
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.code} value={district.code}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district_code && (
              <p className="text-sm text-red-600 mt-1">{errors.district_code}</p>
            )}
          </div>

          <div>
            <Label htmlFor="ward_code">Phường/Xã *</Label>
            <Select
              value={formData.ward_code}
              onValueChange={(value) => handleChange('ward_code', value)}
              disabled={loadingRegions || !formData.district_code}
            >
              <SelectTrigger className={errors.ward_code ? 'border-red-500' : ''}>
                <SelectValue placeholder="Chọn phường/xã" />
              </SelectTrigger>
              <SelectContent>
                {wards.map((ward) => (
                  <SelectItem key={ward.code} value={ward.code}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ward_code && (
              <p className="text-sm text-red-600 mt-1">{errors.ward_code}</p>
            )}
          </div>

          <div>
            <Label htmlFor="zip">Mã bưu điện</Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              placeholder="Mã bưu điện (tùy chọn)"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) => handleChange('is_default', checked as boolean)}
            />
            <Label htmlFor="is_default" className="cursor-pointer">
              Đặt làm địa chỉ mặc định
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? 'Đang xử lý...' : address ? 'Cập nhật' : 'Thêm địa chỉ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

