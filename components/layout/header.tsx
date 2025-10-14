'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, Phone, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { toggleCart } from '@/redux/slices/cartSlice';
import { NAVIGATION, CONTACT_INFO, SITE_CONFIG } from '@/constants/site';
import { cn } from '@/lib/utils';
import DynamicNavigation from '@/components/navigation/dynamic-navigation';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Close mobile menus when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setIsMobileMenuOpen(false);
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCartToggle = () => {
    dispatch(toggleCart());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-8 items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>Hotline: {CONTACT_INFO.phone}</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>Email: {CONTACT_INFO.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/account" className="flex items-center gap-1 hover:text-red-600 transition-colors">
                <User className="h-3 w-3" />
                <span>Đăng nhập</span>
              </Link>
              <span>|</span>
              <Link href="/register" className="hover:text-red-600 transition-colors">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-40 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">{SITE_CONFIG.name}</span>
            </div>
          </Link>


          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="search"
                  placeholder="Nhập tên hoặc mã sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 rounded-r-none border-gray-300 focus:border-red-500"
                />
                <Button type="submit" className="rounded-l-none bg-red-600 hover:bg-red-700 border-red-600">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Mobile search toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button 
              variant="outline" 
              className="relative border-red-600 text-red-600 hover:bg-red-50" 
              onClick={handleCartToggle}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span className="hidden lg:inline">Giỏ hàng</span>
              {cartItemsCount > 0 && (
                <Badge
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs bg-red-600"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {NAVIGATION.main.map((item) => (
                        <div key={item.name}>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                          {item.name === 'Sản phẩm' && (
                            <div className="ml-4 space-y-1">
                              <DynamicNavigation 
                                className="space-y-1" 
                                limit={6}
                                variant="mobile"
                                onItemClick={() => setIsMobileMenuOpen(false)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchOpen && (
          <div className="border-t py-4 md:hidden">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button type="submit" size="sm" className="rounded-l-none bg-red-600 hover:bg-red-700">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Red Navigation Bar */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12">
            <div className="hidden lg:flex items-center space-x-8">          
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger 
                    onClick={(e) => e.preventDefault()}
                    className="!text-white !bg-transparent hover:!bg-red-700 hover:!text-white data-[state=open]:!bg-red-700 data-[state=open]:!text-white focus:!text-white border-none"
                    >
                      <Menu className="h-4 w-4 mr-2" />
                      Tất cả sản phẩm
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-white">
                      <div className="w-[600px] p-4">
                        <DynamicNavigation 
                          className="grid gap-3 grid-cols-3" 
                          limit={9}
                        />
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {NAVIGATION.main.filter(item => item.name !== 'Sản phẩm' && item.name !== 'Trang chủ' && item.name !== 'Tất cả sản phẩm').map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium !text-white hover:!bg-red-700 hover:!text-white focus:!text-white transition-colors"
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Mobile menu for red nav */}
            <div className="lg:hidden w-full">
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-red-700">
                    <Menu className="h-5 w-5 mr-2" />
                    Menu
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Tất cả sản phẩm</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flow-root">
                    <div className="space-y-2 py-6">
                      {NAVIGATION.main.filter(item => item.name !== 'Sản phẩm').map((item) => (
                        <div key={item.name}>
                          <Link
                            href={item.href}
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            {item.name}
                          </Link>
                          {item.name === 'Tất cả sản phẩm' && (
                            <div className="ml-4 space-y-1">
                              <DynamicNavigation 
                                className="space-y-1" 
                                limit={6}
                                variant="mobile"
                                onItemClick={() => setIsMobileNavOpen(false)}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
