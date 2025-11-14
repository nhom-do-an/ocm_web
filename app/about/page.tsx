import { Metadata } from 'next';
import { AboutView } from '@/sections';
import { SITE_CONFIG } from '@/constants/site';

export const metadata: Metadata = {
  title: 'Về chúng tôi',
  description: 'Tìm hiểu về ' + SITE_CONFIG.name + ' - ' + SITE_CONFIG.description,
};

export default function AboutPage() {
  return <AboutView />;
}

