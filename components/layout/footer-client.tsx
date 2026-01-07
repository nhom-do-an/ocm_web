'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { SITE_CONFIG, CONTACT_INFO, POLICIES } from '@/constants/site';
import { Separator } from '@/components/ui/separator';
import { FooterCollections } from './footer-collections';
import { useAppSelector } from '@/hooks/redux';

export function FooterClient() {
  const [mounted, setMounted] = useState(false);
  const { store, locations } = useAppSelector((state) => state.store);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only use store data after mounting to prevent hydration mismatch
  const storeName = mounted && store?.name ? store.name : SITE_CONFIG.name;
  const storePhone = mounted && store?.phone ? store.phone : CONTACT_INFO.phone;
  const storeEmail = mounted && store?.email ? store.email : CONTACT_INFO.email;
  const storeAddress = CONTACT_INFO.address;
  const storeLogo = mounted ? store?.logo_url : undefined;

  // Build full address from store data (only after mounting)
  const fullAddress = mounted && store
    ? [store.address, store.ward_name, store.district_name, store.province_name]
        .filter(Boolean)
        .join(', ')
    : storeAddress;

  // Only show locations after mounting
  const displayLocations = mounted ? locations : [];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {storeLogo ? (
                <Image
                  src={storeLogo}
                  alt={storeName}
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain bg-white rounded p-1"
                />
              ) : null}
              <h3 className="text-lg font-semibold text-white">{storeName}</h3>
            </div>
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
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href={`tel:${storePhone}`} className="text-sm hover:text-white transition-colors">
                  {storePhone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${storeEmail}`} className="text-sm hover:text-white transition-colors">
                  {storeEmail}
                </a>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{fullAddress}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{CONTACT_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Chính sách</h3>
            <ul className="space-y-2">
              {Object.values(POLICIES).map((policy) => (
                <li key={policy.title}>
                  <Link href={policy.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Locations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Hệ thống cửa hàng</h3>
            {displayLocations && displayLocations.length > 0 ? (
              <ul className="space-y-3">
                {displayLocations.slice(0, 4).map((location) => (
                  <li key={location.id} className="text-sm">
                    <div className="font-medium text-gray-300">{location.name}</div>
                    <div className="text-gray-400 text-xs mt-1">{location.address}</div>
                    {location.phone && (
                      <a
                        href={`tel:${location.phone}`}
                        className="text-gray-400 text-xs hover:text-white transition-colors"
                      >
                        {location.phone}
                      </a>
                    )}
                  </li>
                ))}
                {displayLocations.length > 4 && (
                  <li>
                    <Link href="/stores" className="text-sm text-red-400 hover:text-red-300 transition-colors">
                      Xem tất cả {displayLocations.length} chi nhánh →
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <FooterCollections />
            )}
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} {storeName}. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </div>
    </footer>
  );
}
