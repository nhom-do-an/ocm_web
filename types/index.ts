// Re-export all types from this index file
export * from './product';
export * from './order';
export * from './api';
export * from './cart';

// Common utility types
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: MenuItem[];
  badge?: string | number;
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  isActive?: boolean;
}

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  placeholder?: string;
}

export interface SortOption {
  value: string;
  label: string;
  field: string;
  order: 'asc' | 'desc';
}
