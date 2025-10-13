import Link from 'next/link';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { SITE_CONFIG, CONTACT_INFO, POLICIES } from '@/constants/site';
import { Separator } from '@/components/ui/separator';
import { FooterCollections } from './footer-collections';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{SITE_CONFIG.name}</h3>
            <p className="text-sm text-gray-400">{SITE_CONFIG.description}</p>
            <div className="flex space-x-4">
              <Link href={SITE_CONFIG.links.facebook} className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href={SITE_CONFIG.links.instagram} className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href={SITE_CONFIG.links.youtube} className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1" />
                <span className="text-sm">{CONTACT_INFO.address}</span>
              </div>
              <div className="text-sm text-gray-400">{CONTACT_INFO.workingHours}</div>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Chính sách</h3>
            <ul className="space-y-2">
              {Object.values(POLICIES).map((policy) => (
                <li key={policy.title}>
                  <Link href={policy.href} className="text-sm text-gray-400 hover:text-white">
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Dynamic Collections */}
          <FooterCollections />
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2024 {SITE_CONFIG.name}. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex space-x-6">
            <img src="/images/payment/visa.png" alt="Visa" className="h-6" />
            <img src="/images/payment/mastercard.png" alt="Mastercard" className="h-6" />
            <img src="/images/payment/momo.png" alt="Momo" className="h-6" />
            <img src="/images/payment/zalopay.png" alt="ZaloPay" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
}
