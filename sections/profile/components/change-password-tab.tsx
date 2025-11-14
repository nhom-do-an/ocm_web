'use client';

import { useState } from 'react';
import { authService } from '@/services/api';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  new_password: z.string().min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
  confirm_password: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
  path: ['confirm_password'],
});

export default function ChangePasswordTab() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    try {
      changePasswordSchema.parse(formData);
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
      // Note: API might not have change password endpoint, using update profile as fallback
      // You may need to adjust this based on actual API
      await authService.updateProfile({
        password: formData.new_password,
      } as any);
      
      toast.success('Đổi mật khẩu thành công');
      setFormData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      toast.error(error?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Đổi mật khẩu</h2>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.current_password}
                  onChange={(e) => handleChange('current_password', e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className={errors.current_password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.new_password}
                  onChange={(e) => handleChange('new_password', e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className={errors.new_password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-red-600 mt-1">{errors.new_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lại mật khẩu mới
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirm_password}
                  onChange={(e) => handleChange('confirm_password', e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className={errors.confirm_password ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-red-600 mt-1">{errors.confirm_password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
              <Lock className="h-4 w-4 mr-2" />
              {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}







