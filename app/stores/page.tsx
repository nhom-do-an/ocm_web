import { Metadata } from 'next';
import { StoresView } from '@/sections';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Hệ thống cửa hàng',
  description: 'Tìm cửa hàng ' + SITE_CONFIG.name + ' gần bạn nhất',
};

export default function StoresPage() {
  return <StoresView />;
}

