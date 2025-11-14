import { Metadata } from 'next';
import { SaleView } from '@/sections';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Khuyến mãi',
  description: 'Khám phá các chương trình khuyến mãi đặc biệt và ưu đãi độc quyền tại ' + SITE_CONFIG.name,
};

export default function SalePage() {
  return <SaleView />;
}

