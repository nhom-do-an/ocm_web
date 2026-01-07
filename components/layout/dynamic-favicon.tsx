'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/hooks/redux';
import { SITE_CONFIG } from '@/constants/site';

export default function DynamicFavicon() {
  const { store, loading } = useAppSelector((state) => state.store);
  const originalTitle = useRef<string | null>(null);

  // Update page title with store name
  useEffect(() => {
    if (loading) return;

    if (store?.name) {
      // Save original title on first run
      if (originalTitle.current === null) {
        originalTitle.current = document.title;
      }

      const currentTitle = document.title;

      // Replace SITE_CONFIG.name with store name in title
      if (currentTitle.includes(SITE_CONFIG.name)) {
        document.title = currentTitle.replace(SITE_CONFIG.name, store.name);
      } else if (!currentTitle || currentTitle === 'Next.js' || currentTitle === '') {
        document.title = store.name;
      }
    }
  }, [store?.name, loading]);

  // Update favicon with store logo
  useEffect(() => {
    if (loading) return;

    if (store?.logo_url) {
      // Remove any existing favicons first
      const existingIcons = document.querySelectorAll("link[rel*='icon']");
      existingIcons.forEach(icon => icon.remove());

      // Create new favicon link
      const link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/x-icon';
      link.href = store.logo_url;
      document.head.appendChild(link);

      // Create shortcut icon for compatibility
      const shortcutLink = document.createElement('link');
      shortcutLink.rel = 'shortcut icon';
      shortcutLink.href = store.logo_url;
      document.head.appendChild(shortcutLink);

      // Create apple-touch-icon
      const appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      appleLink.href = store.logo_url;
      document.head.appendChild(appleLink);
    }
  }, [store?.logo_url, loading]);

  return null;
}
