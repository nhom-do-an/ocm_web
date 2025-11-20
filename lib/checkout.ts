import { checkoutService } from '@/services/api';
import { toast } from 'react-toastify';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function startCheckoutFromCart(
  router: AppRouterInstance
) {
  try {
    const checkout = await checkoutService.getCheckoutByCart({});
    router.push(`/checkout?token=${checkout.token}`);
    return checkout;
  } catch (error: any) {
    toast.error(error?.message || 'Không thể tạo phiên thanh toán');
    throw error;
  }
}

