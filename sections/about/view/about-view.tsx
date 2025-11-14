'use client';

import { Card, CardContent } from '@/components/ui/card';
import { SITE_CONFIG, CONTACT_INFO } from '@/constants/site';
import { Award, Users, ShoppingBag, Heart, Target, Shield } from 'lucide-react';

export default function AboutView() {
  const values = [
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Chất lượng hàng đầu',
      description: 'Cam kết mang đến sản phẩm chính hãng, chất lượng cao từ các thương hiệu uy tín',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Phục vụ tận tâm',
      description: 'Đội ngũ nhân viên chuyên nghiệp, luôn sẵn sàng hỗ trợ khách hàng 24/7',
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: 'Giao hàng nhanh chóng',
      description: 'Hệ thống giao hàng toàn quốc, đảm bảo sản phẩm đến tay khách hàng nhanh nhất',
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Giá cả hợp lý',
      description: 'Cam kết giá tốt nhất thị trường, nhiều chương trình khuyến mãi hấp dẫn',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Mục tiêu rõ ràng',
      description: 'Mang đến trải nghiệm mua sắm tốt nhất cho mọi gia đình Việt Nam',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Bảo hành chính hãng',
      description: 'Chính sách bảo hành minh bạch, hỗ trợ đổi trả dễ dàng trong 30 ngày',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Về {SITE_CONFIG.name}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {SITE_CONFIG.description}. Chúng tôi tự hào là đối tác tin cậy của hàng ngàn gia đình Việt Nam,
          mang đến những sản phẩm chất lượng cao với giá cả hợp lý nhất.
        </p>
      </div>

      {/* Story Section */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
          <div className="prose max-w-none text-gray-700 space-y-4">
            <p>
              {SITE_CONFIG.name} được thành lập với sứ mệnh mang đến những sản phẩm thiết bị gia dụng chất lượng
              cao cho mọi gia đình Việt Nam. Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi đã và đang là đối
              tác tin cậy của hàng ngàn khách hàng trên toàn quốc.
            </p>
            <p>
              Chúng tôi chuyên cung cấp các sản phẩm từ thương hiệu Elmich - một trong những thương hiệu hàng đầu
              về thiết bị gia dụng tại châu Âu. Tất cả sản phẩm đều được nhập khẩu chính hãng, đảm bảo chất lượng và
              an toàn cho người sử dụng.
            </p>
            <p>
              Với phương châm "Khách hàng là trung tâm", chúng tôi luôn nỗ lực mang đến trải nghiệm mua sắm tốt nhất,
              từ việc tư vấn sản phẩm phù hợp đến dịch vụ hậu mãi chu đáo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Values Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600 flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Liên hệ với chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hotline</h3>
              <p className="text-red-600 font-medium">{CONTACT_INFO.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-red-600 font-medium">{CONTACT_INFO.email}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Giờ làm việc</h3>
              <p className="text-gray-600">{CONTACT_INFO.workingHours}</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-600">{CONTACT_INFO.address}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

