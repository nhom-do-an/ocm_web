import { Address, ProductDetail } from './product';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  product: ProductDetail; 
  quantity: number;
  price: number;
  selectedVariants?: Record<string, string>;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'credit_card' | 'momo' | 'zalopay' | 'vnpay';

export type ShippingMethod = 'standard' | 'express' | 'same_day';

export interface Checkout {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  notes?: string;
  couponCode?: string;
}
