export const SITE_CONFIG = {
  name: 'OCM Store',
  description: 'Cửa hàng thiết bị gia dụng cao cấp',
  url: 'https://ocm-store.com',
  ogImage: '/og-image.jpg',
  keywords: 'thiết bị gia dụng, nồi chảo, bình giữ nhiệt, điện gia dụng',
  author: 'OCM Store',
  links: {
    facebook: 'https://facebook.com/ocmstore',
    instagram: 'https://instagram.com/ocmstore',
    youtube: 'https://youtube.com/ocmstore',
    zalo: 'https://zalo.me/ocmstore',
  },
};

export const NAVIGATION = {
  main: [
    {
      name: 'Trang chủ',
      href: '/',
    },
    {
      name: 'Sản phẩm',
      href: '/products',
      // children sẽ được load dynamic từ API
    },
    {
      name: 'Khuyến mãi',
      href: '/sale',
    },
    {
      name: 'Về chúng tôi',
      href: '/about',
    },
    {
      name: 'Liên hệ',
      href: '/contact',
    },
  ],
  footer: {
    company: [
      { name: 'Giới thiệu', href: '/about' },
      { name: 'Tuyển dụng', href: '/careers' },
      { name: 'Tin tức', href: '/news' },
      { name: 'Liên hệ', href: '/contact' },
    ],
    support: [
      { name: 'Hướng dẫn mua hàng', href: '/huong-dan-mua-hang' },
      { name: 'Chính sách bảo hành', href: '/chinh-sach-bao-hanh' },
      { name: 'Chính sách đổi trả', href: '/chinh-sach-doi-tra' },
      { name: 'Chính sách giao hàng', href: '/chinh-sach-giao-hang' },
      { name: 'Chính sách thanh toán', href: '/chinh-sach-thanh-toan' },
    ],
    categories: [
      { name: 'Nồi - Chảo', href: '/collection/noi-chao' },
      { name: 'Bình Giữ Nhiệt', href: '/collection/binh-giu-nhiet' },
      { name: 'Điện Gia Dụng', href: '/collection/dien-gia-dung' },
      { name: 'Máy Xay Sinh Tố', href: '/collection/may-xay-sinh-to' },
    ],
  },
};

export const CONTACT_INFO = {
  phone: '1900 6369 25',
  email: 'cskh@ocmstore.vn',
  address: 'Tầng 17 toà nhà 319 Bộ Quốc Phòng, phường Yên Hòa, thành phố Hà Nội',
  workingHours: 'Thứ 2 - Chủ nhật: 8:00 - 22:00',
  socialMedia: {
    facebook: 'https://facebook.com/ocmstore',
    instagram: 'https://instagram.com/ocmstore',
    youtube: 'https://youtube.com/ocmstore',
    zalo: 'https://zalo.me/ocmstore',
  },
};

export const SEO_CONFIG = {
  defaultTitle: 'OCM Store - Thiết bị gia dụng cao cấp',
  titleTemplate: '%s | OCM Store',
  defaultDescription:
    'Cửa hàng thiết bị gia dụng cao cấp với các sản phẩm chất lượng từ thương hiệu Elmich',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://ocm-store.com',
    siteName: 'OCM Store',
  },
  twitter: {
    handle: '@ocmstore',
    site: '@ocmstore',
    cardType: 'summary_large_image',
  },
};

export const POLICIES = {
  warranty: {
    title: 'Chính sách bảo hành',
    content: 'Bảo hành chính hãng từ 12-120 tháng tùy theo sản phẩm',
    href: '/chinh-sach-bao-hanh',
  },
  shipping: {
    title: 'Chính sách giao hàng',
    content: 'Giao hàng miễn phí toàn quốc cho đơn hàng từ 500.000đ',
    href: '/chinh-sach-giao-hang',
  },
  return: {
    title: 'Chính sách đổi trả',
    content: 'Đổi trả miễn phí trong vòng 30 ngày',
    href: '/chinh-sach-doi-tra',
  },
  payment: {
    title: 'Chính sách thanh toán',
    content: 'Hỗ trợ thanh toán COD, chuyển khoản, ví điện tử',
    href: '/chinh-sach-thanh-toan',
  },
};
