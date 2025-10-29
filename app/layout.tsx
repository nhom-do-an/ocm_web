import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import HeaderGuard from '@/components/layout/header-guard'
import FooterGuard from '@/components/layout/footer-guard'
import { ShoppingCart } from '@/components/cart/shopping-cart';
import { BackToTop } from '@/components/ui/back-to-top';
import { SITE_CONFIG } from '@/constants/site';
import ToastProvider from '@/components/ui/toast-provider';
import AuthRestoreGuard from '@/components/layout/auth-restore-guard';
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['gia dụng', 'nồi chảo', 'bình giữ nhiệt', 'điện gia dụng', 'elmich'],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  metadataBase: new URL(SITE_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${quicksand.variable} font-sans antialiased`}>
        <ReduxProvider>
          <AuthRestoreGuard />
          <div className="relative flex min-h-screen flex-col">
            <HeaderGuard />
            <main className="flex-1">{children}</main>
            <FooterGuard />
          </div>
          <ShoppingCart />
          <BackToTop />
          <ToastProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
