'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { fetchCart } from '@/redux/slices/cartSlice';
import { logoutUser } from '@/redux/slices/authSlice';
import { 
  addressService, 
  regionsService, 
  checkoutService,
  paymentMethodsService,
} from '@/services/api';
import { 
  AddressDetail, 
  CheckoutDetail, 
  ShippingRate, 
  PaymentMethodDetail,
  UpdateCheckoutInfoRequest,
} from '@/types/api';
import { Region, RegionType } from '@/types/region';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SITE_CONFIG, CONTACT_INFO, POLICIES } from '@/constants/site';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { items, total, itemCount } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Checkout token from URL
  const checkoutToken = searchParams?.get('token') || '';

  // Checkout data
  const [checkout, setCheckout] = useState<CheckoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [isLoadingShippingRates, setIsLoadingShippingRates] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDetail[]>([]);
  const [selectedShippingRateId, setSelectedShippingRateId] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    province_code: '',
    district_code: '',
    ward_code: '',
    notes: '',
  });
  const notesRef = useRef(formData.notes);

  // Address and regions
  const [addresses, setAddresses] = useState<AddressDetail[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [defaultAddress, setDefaultAddress] = useState<AddressDetail | null>(null);
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [wards, setWards] = useState<Region[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [hasInitializedAddress, setHasInitializedAddress] = useState(false);
  const [isCheckoutAddressDetached, setIsCheckoutAddressDetached] = useState(false);

  // Shipping and payment
  const [shippingMethod, setShippingMethod] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Discount code
  const [discountCode, setDiscountCode] = useState('');

  // Policy dialog
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false);
  const [policyContent, setPolicyContent] = useState<{ title: string; content: string } | null>(null);

  // Load checkout data on mount
  useEffect(() => {
    const loadCheckout = async () => {
      if (!checkoutToken) {
        // Nếu không có token, quay về cart
        router.push('/cart');
        return;
      }

      try {
        setLoading(true);
        // Load checkout detail
        const checkoutData = await checkoutService.getCheckout(checkoutToken);
        setCheckout(checkoutData);
        setIsCheckoutAddressDetached(!checkoutData.shipping_address_id);

        setShippingRates([]);
        setSelectedShippingRateId(null);

        // Load payment methods (chỉ lấy active)
        const methods = await paymentMethodsService.getPaymentMethods({ status: 'active' });
        setPaymentMethods(methods);
        if (checkoutData.payment_method_id) {
          setPaymentMethod(checkoutData.payment_method_id.toString());
        }

        if (user) {
          setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            phone: user.phone || '',
            email: user.email || '',
            address: '',
            province_code: '',
            district_code: '',
            ward_code: '',
            notes: checkoutData.note || '',
          });
        } else {
          setFormData({
            first_name: '',
            last_name: '',
            phone: '',
            email: '',
            address: '',
            province_code: '',
            district_code: '',
            ward_code: '',
            notes: checkoutData.note || '',
          });
        }
      } catch (error: any) {
        console.error('Failed to load checkout:', error);
        toast.error(error?.message || 'Không thể tải thông tin thanh toán');
        router.push('/cart');
      } finally {
        setLoading(false);
      }
    };

    if (checkoutToken) {
      loadCheckout();
    }
  }, [checkoutToken]);

  useEffect(() => {
    notesRef.current = formData.notes;
  }, [formData.notes]);

  // Load cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Region loading functions
  const loadProvinces = useCallback(async () => {
    try {
      setLoadingRegions(true);
      const response = await regionsService.getOldRegions('VN', RegionType.Province);
      if (response && response.success) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error('Failed to load provinces:', error);
    } finally {
      setLoadingRegions(false);
    }
  }, []);

  const loadDistricts = useCallback(async (provinceCode: string) => {
    try {
      setLoadingRegions(true);
      const response = await regionsService.getOldRegions(provinceCode, RegionType.District);
      if (response && response.success) {
        setDistricts(response.data);
        setWards([]);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
    } finally {
      setLoadingRegions(false);
    }
    return [];
  }, []);

  const loadWards = useCallback(async (districtCode: string) => {
    try {
      setLoadingRegions(true);
      const response = await regionsService.getOldRegions(districtCode, RegionType.Ward);
      if (response && response.success) {
        setWards(response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to load wards:', error);
    } finally {
      setLoadingRegions(false);
    }
    return [];
  }, []);

  const hasCompleteAddressInfo = (data: typeof formData) => {
    return Boolean(
      data.province_code &&
      data.district_code &&
      data.ward_code
    );
  };

  const buildCheckoutUpdatePayload = (
    data: typeof formData,
    overrides: Partial<typeof formData> = {},
    options?: { shippingAddressId?: number | null; billingAddressId?: number | null }
  ): UpdateCheckoutInfoRequest => {
    const source = { ...data, ...overrides };
    const payload: UpdateCheckoutInfoRequest = {
      first_name: source.first_name || undefined,
      last_name: source.last_name || undefined,
      email: source.email || undefined,
      phone: source.phone || undefined,
      address: source.address || undefined,
      province_code: source.province_code || undefined,
      district_code: source.district_code || undefined,
      ward_code: source.ward_code || undefined,
      note: source.notes || undefined,
    };

    if (options) {
      if (options.shippingAddressId !== undefined) {
        payload.shipping_address_id = options.shippingAddressId;
      }
      if (options.billingAddressId !== undefined) {
        payload.billing_address_id = options.billingAddressId;
      }
    }

    return payload;
  };

  const refreshShippingRates = useCallback(
    async (data: typeof formData) => {
      if (!checkoutToken) {
        return;
      }

      if (!hasCompleteAddressInfo(data)) {
        setShippingRates([]);
        setSelectedShippingRateId(null);
        return;
      }

      try {
        setIsLoadingShippingRates(true);
        const rates = await checkoutService.getShippingRates(checkoutToken);
        setShippingRates(rates);
        const updatedCheckout = await checkoutService.getCheckout(checkoutToken);
        setCheckout(updatedCheckout);
        if (rates.length > 0) {
          setSelectedShippingRateId(updatedCheckout.shipping_rate_id ?? rates[0].id);
        } else {
          setSelectedShippingRateId(null);
        }
      } catch (error) {
        console.error('Failed to load shipping rates:', error);
        toast.error('Không thể tải phí vận chuyển');
      } finally {
        setIsLoadingShippingRates(false);
      }
    },
    [checkoutToken]
  );

  const applySavedAddress = useCallback(
    async (addr: AddressDetail) => {
      // Deep copy để tránh mutate object gốc
      const addressCopy = JSON.parse(JSON.stringify(addr));
      
      const updatedForm = {
        first_name: addressCopy.first_name || '',
        last_name: addressCopy.last_name || '',
        phone: addressCopy.phone || '',
        email: addressCopy.email || '',
        address: addressCopy.address || '',
        province_code: addressCopy.province_code || '',
        district_code: addressCopy.district_code || '',
        ward_code: addressCopy.ward_code || '',
        notes: notesRef.current || '',
      };

      setFormData(updatedForm);

      if (addressCopy.province_code) {
        await loadDistricts(addressCopy.province_code);
        if (addressCopy.district_code) {
          await loadWards(addressCopy.district_code);
        } else {
          setWards([]);
        }
      } else {
        setDistricts([]);
        setWards([]);
      }

      // KHÔNG gửi API update khi chọn địa chỉ từ sổ
      // Chỉ hiển thị thông tin địa chỉ trong form
      // API chỉ được gọi khi user bấm "Đặt hàng"
      setIsCheckoutAddressDetached(false);
      await refreshShippingRates(updatedForm);
    },
    [loadDistricts, loadWards, refreshShippingRates]
  );

  const detachCheckoutAddress = useCallback(async () => {
    if (!checkoutToken) {
      return;
    }
    try {
      await checkoutService.updateCheckout(checkoutToken, { shipping_address_id: null });
      setIsCheckoutAddressDetached(true);
    } catch (error) {
      console.error('Failed to detach checkout address:', error);
    }
  }, [checkoutToken]);

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  useEffect(() => {
    if (checkout) {
      setIsCheckoutAddressDetached(!checkout.shipping_address_id);
    }
  }, [checkout?.shipping_address_id]);

  // Load user's addresses - KHÔNG tự động chọn địa chễ mặc định
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setAddresses([]);
      setDefaultAddress(null);
      setHasInitializedAddress(false);
      setSelectedAddressId(null);
      return;
    }

    const loadAddresses = async () => {
      try {
        const addressList = await addressService.getAddresses();
        setAddresses(addressList);
        const defaultAddr = addressList.find((addr) => addr.default_address) || addressList[0] || null;
        setDefaultAddress(defaultAddr || null);

        if (!hasInitializedAddress && checkout) {
          // Nếu checkout có shipping_address_id và địa chỉ tồn tại trong danh sách
          if (checkout.shipping_address_id && addressList.some((addr) => addr.id === checkout.shipping_address_id)) {
            const existingAddr = addressList.find((addr) => addr.id === checkout.shipping_address_id);
            if (existingAddr) {
              const existingAddrCopy = JSON.parse(JSON.stringify(existingAddr));
              setSelectedAddressId(existingAddrCopy.id);
              
              // Apply address inline để tránh dependency issue
              const updatedForm = {
                first_name: existingAddrCopy.first_name || '',
                last_name: existingAddrCopy.last_name || '',
                phone: existingAddrCopy.phone || '',
                email: existingAddrCopy.email || '',
                address: existingAddrCopy.address || '',
                province_code: existingAddrCopy.province_code || '',
                district_code: existingAddrCopy.district_code || '',
                ward_code: existingAddrCopy.ward_code || '',
                notes: notesRef.current || '',
              };
              setFormData(updatedForm);
              
              if (existingAddrCopy.province_code) {
                await loadDistricts(existingAddrCopy.province_code);
                if (existingAddrCopy.district_code) {
                  await loadWards(existingAddrCopy.district_code);
                }
              }
              
              setIsCheckoutAddressDetached(false);
              await refreshShippingRates(updatedForm);
            }
          }
          // KHÔNG tự động apply địa chỉ mặc định - để mặc định là "Địa chỉ khác"
          // User sẽ tự chọn địa chỉ từ dropdown
          else {
            // Đặt mặc định là không chọn địa chỉ nào
            setSelectedAddressId(null);
            setIsCheckoutAddressDetached(true);
            
            // Nếu có thông tin user, pre-fill email và tên
            if (user) {
              setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                email: user.email || '',
                address: '',
                province_code: '',
                district_code: '',
                ward_code: '',
                notes: '',
              });
            }
          }
          
          setHasInitializedAddress(true);
        }
      } catch (error) {
        console.error('Failed to load address:', error);
      }
    };

    loadAddresses();
  }, [isAuthenticated, user, checkout?.shipping_address_id, hasInitializedAddress, checkoutToken, loadDistricts, loadWards, refreshShippingRates]);

  const handleChange = async (field: string, value: string) => {
    let updatedFormData = { ...formData, [field]: value };
    let overrides: Partial<typeof formData> = {};
    let shouldReloadShippingRates = false;

    // Nếu user thay đổi bất kỳ field nào (trừ notes), detach khỏi địa chỉ đã lưu
    if (field !== 'notes' && selectedAddressId !== null) {
      setSelectedAddressId(null);
      setIsCheckoutAddressDetached(true); // Set state ngay lập tức
    }

    if (field === 'province_code') {
      overrides = { district_code: '', ward_code: '' };
      updatedFormData = { ...updatedFormData, ...overrides };
      setDistricts([]);
      setWards([]);
      setSelectedAddressId(null);
      shouldReloadShippingRates = true;
    } else if (field === 'district_code') {
      overrides = { ward_code: '' };
      updatedFormData = { ...updatedFormData, ...overrides };
      setWards([]);
      setSelectedAddressId(null);
      shouldReloadShippingRates = true;
    } else if (field === 'ward_code') {
      setSelectedAddressId(null);
      shouldReloadShippingRates = true;
    }

    setFormData(updatedFormData);

    if (field === 'province_code') {
      await loadDistricts(value);
    } else if (field === 'district_code') {
      await loadWards(value);
    }

    if (!checkoutToken) {
      return;
    }

    // CHỈ gửi API update khi user đang ở mode "Địa chỉ khác" (selectedAddressId = null)
    // Nếu user đang chọn địa chỉ từ sổ, KHÔNG gửi API để tránh ghi đè
    if (selectedAddressId === null) {
      try {
        // Khi user thay đổi thông tin, phải gửi shipping_address_id = null 
        // để API biết đây là địa chỉ mới, KHÔNG ghi đè vào địa chỉ đã lưu
        const payload = buildCheckoutUpdatePayload(updatedFormData, overrides);
        
        // QUAN TRỌNG: Luôn gửi shipping_address_id = null
        if (field !== 'notes') {
          payload.shipping_address_id = null;
        }
        
        await checkoutService.updateCheckout(checkoutToken, payload);
        
        if (shouldReloadShippingRates) {
          await refreshShippingRates(updatedFormData);
        } else {
          const updatedCheckout = await checkoutService.getCheckout(checkoutToken);
          setCheckout(updatedCheckout);
        }
      } catch (error: any) {
        console.error('Failed to update checkout:', error);
        toast.error('Không thể cập nhật thông tin');
      }
    } else {
      // User đang ở mode chọn địa chỉ từ sổ, chỉ reload shipping rates
      if (shouldReloadShippingRates) {
        await refreshShippingRates(updatedFormData);
      }
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser() as any);
      toast.info('Đã đăng xuất');
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, router]);

  const handlePlaceOrder = async () => {
    if (!checkoutToken) {
      toast.error('Không tìm thấy phiên thanh toán');
      return;
    }

    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    if (!selectedShippingRateId) {
      toast.error('Vui lòng chọn phương thức vận chuyển');
      return;
    }

    try {
      setIsCompleting(true);

      // Update checkout với thông tin cuối cùng trước khi complete
      const updateData: UpdateCheckoutInfoRequest = {
        payment_method_id: parseInt(paymentMethod),
        shipping_rate_id: selectedShippingRateId,
        note: formData.notes,
      };
      
      // Nếu user đã chọn địa chỉ từ sổ địa chỉ
      if (selectedAddressId !== null) {
        updateData.shipping_address_id = selectedAddressId;
      } else {
        // Nếu user nhập địa chỉ mới (mode "Địa chỉ khác")
        updateData.first_name = formData.first_name;
        updateData.last_name = formData.last_name;
        updateData.email = formData.email;
        updateData.phone = formData.phone;
        updateData.address = formData.address;
        updateData.province_code = formData.province_code;
        updateData.district_code = formData.district_code;
        updateData.ward_code = formData.ward_code;
        updateData.shipping_address_id = null;
      }

      await checkoutService.updateCheckout(checkoutToken, updateData);

      // Complete checkout
      const order = await checkoutService.completeCheckout(checkoutToken);
      
      toast.success('Đặt hàng thành công!');
      
      // Clear cart after successful checkout
      dispatch(fetchCart());
      
      // Redirect đến trang đặt hàng thành công
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleApplyDiscount = () => {
    // TODO: Implement discount code validation
    toast.info('Chức năng mã giảm giá đang được phát triển');
  };

  const policyContents = {
    return: {
      title: 'CHÍNH SÁCH ĐỔI TRẢ HÀNG',
      content: `1. Đổi trả theo nhu cầu khách hàng (đổi trả hàng vì không ưng ý)

Tất cả mặt hàng đã mua đều có thể đổi trả trong vòng 30 ngày kể từ ngày nhận hàng (trừ khi có quy định gì khác). Chúng tôi chỉ chấp nhận đổi trả cho các sản phẩm còn nguyên điều kiện ban đầu, còn hóa đơn mua hàng & sản phẩm chưa qua sử dụng, bao gồm:

- Còn nguyên đóng gói và bao bì không bị móp rách.

- Đầy đủ các chi tiết, phụ kiện.

- Tem/ phiếu bảo hành, tem thương hiệu, hướng dẫn kỹ thuật  và các quà tặng kèm theo (nếu có) v.v… phải còn đầy đủ và nguyên vẹn

- Không bị dơ bẩn, trầy xước, hư hỏng, có mùi lạ hoặc có dấu hiệu đã qua qua sử dụng

2. Đổi trả không vì lý do chủ quan từ khách hàng

2.1. Hàng giao không mới, không nguyên vẹn, sai nội dung hoặc bị thiếu:

Chúng tôi khuyến khích quý khách hàng phải kiểm tra tình trạng bên ngoài của thùng hàng và sản phẩm trước khi thanh toán để đảm bảo rằng hàng hóa được giao đúng chủng loại, số lượng, màu sắc theo đơn đặt hàng và tình trạng bên ngoài không bị tác động.

Nếu gặp trường hợp này, Quý khách vui lòng từ chối nhận hàng và/hoặc báo ngay cho bộ phận hỗ trợ khách hàng để chúng tôi có phương án xử lí kịp thời. (Xin lưu ý những bước kiểm tra sâu hơn như dùng thử sản phẩm chỉ có thể được chấp nhận sau khi đơn hàng được thanh toán đầy đủ).

Trong trường hợp khách hàng đã thanh toán, nhận hàng và sau đó phát hiện hàng hóa không còn mới nguyên vẹn, sai nội dung hoặc thiếu hàng, xin vui lòng chụp ảnh sản phẩm gửi về hộp thư của chúng tôi để được chúng tôi hỗ trợ các bước tiếp theo như đổi/trả hàng hoặc gửi sản phẩm còn thiếu đến quý khách…

Sau 48h kể từ ngày quý khách nhận hàng, chúng tôi có quyền từ chối hỗ trợ cho những khiếu nại theo nội dung như trên.

2.2. Hàng giao bị lỗi

Khi quý khách gặp trục trặc với sản phẩm đặt mua của chúng tôi, vui lòng thực hiện các bước sau đây:

- Bước 1: Kiểm tra lại sự nguyên vẹn của sản phẩm, chụp lại ảnh sản phẩm xuất hiện lỗi.

- Bước 2: Quý khách liên hệ với trung tâm chăm sóc khách hàng của chúng tôi để được xác nhận.

- Bước 3:Trong vòng 30 ngày kể từ ngày nhận hàng, nếu quý khách được xác nhận từ trung tâm chăm sóc khách hàng rằng sản phẩm bị lỗi kỹ thuật, quý khách vui lòng truy cập ngay Hướng dẫn đổi trả hàng để bắt đầu quy trình đổi trả hàng.

3. Phương thức hoàn tiền

Tùy theo lí do hoàn trả sản phẩm kết quả đánh giá chất lượng tại kho, chúng tôi sẽ có những phương thức hoàn tiền với chi tiết như sau:

- Hoàn tiền bằng mã tiền điện tử dùng để mua sản phẩm mới

- Đổi sản phẩm mới cùng loại

- Chuyển khoản qua ngân hàng theo thông tin của quý khách cung cấp

- Riêng đối với các đơn hàng thanh toán qua thẻ tín dụng quốc tế, chúng tôi sẽ áp dụng hình thức hoàn tiền vào tài khoản thanh toán của chủ thẻ.

- Hoàn tiền mặt trực tiếp tại văn phòng

Mọi chi tiết hoặc thắc mắc quý khách vui lòng liên hệ với chúng tôi qua số điện thoại hỗ trợ hoặc để lại lời nhắn tại website. Xin chân thành cảm ơn.`
    },
    privacy: {
      title: 'CHÍNH SÁCH BẢO MẬT',
      content: `Cám ơn quý khách đã quan tâm và truy cập vào website. Chúng tôi tôn trọng và cam kết sẽ bảo mật những thông tin mang tính riêng tư của Quý khách.

Chính sách bảo mật sẽ giải thích cách chúng tôi tiếp nhận, sử dụng và (trong trường hợp nào đó) tiết lộ thông tin cá nhân của Quý khách.

Bảo vệ dữ liệu cá nhân và gây dựng được niềm tin cho quý khách là vấn đề rất quan trọng với chúng tôi. Vì vậy, chúng tôi sẽ dùng tên và các thông tin khác liên quan đến quý khách tuân thủ theo nội dung của Chính sách bảo mật. Chúng tôi chỉ thu thập những thông tin cần thiết liên quan đến giao dịch mua bán.

Chúng tôi sẽ giữ thông tin của khách hàng trong thời gian luật pháp quy định hoặc cho mục đích nào đó. Quý khách có thể truy cập vào website và trình duyệt mà không cần phải cung cấp chi tiết cá nhân. Lúc đó, Quý khách đang ẩn danh và chúng tôi không thể biết bạn là ai nếu Quý khách không đăng nhập vào tài khoản của mình.

1. Thu thập thông tin cá nhân

- Chúng tôi thu thập, lưu trữ và xử lý thông tin của bạn cho quá trình mua hàng và cho những thông báo sau này liên quan đến đơn hàng, và để cung cấp dịch vụ, bao gồm một số thông tin cá nhân: danh hiệu, tên, giới tính, ngày sinh, email, địa chỉ, địa chỉ giao hàng, số điện thoại, fax, chi tiết thanh toán, chi tiết thanh toán bằng thẻ hoặc chi tiết tài khoản ngân hàng.

- Chúng tôi sẽ dùng thông tin quý khách đã cung cấp để xử lý đơn đặt hàng, cung cấp các dịch vụ và thông tin yêu cầu thông qua website và theo yêu cầu của bạn.

- Hơn nữa, chúng tôi sẽ sử dụng các thông tin đó để quản lý tài khoản của bạn; xác minh và thực hiện giao dịch trực tuyến, nhận diện khách vào web, nghiên cứu nhân khẩu học, gửi thông tin bao gồm thông tin sản phẩm và dịch vụ. Nếu quý khách không muốn nhận bất cứ thông tin tiếp thị của chúng tôi thì có thể từ chối bất cứ lúc nào.

- Chúng tôi có thể chuyển tên và địa chỉ cho bên thứ ba để họ giao hàng cho bạn (ví dụ cho bên chuyển phát nhanh hoặc nhà cung cấp).

- Chi tiết đơn đặt hàng của bạn được chúng tôi lưu giữ nhưng vì lí do bảo mật nên chúng tôi không công khai trực tiếp được. Tuy nhiên, quý khách có thể tiếp cận thông tin bằng cách đăng nhập tài khoản trên web. Tại đây, quý khách sẽ thấy chi tiết đơn đặt hàng của mình, những sản phẩm đã nhận và những sản phẩm đã gửi và chi tiết email, ngân hàng và bản tin mà bạn đặt theo dõi dài hạn.

- Quý khách cam kết bảo mật dữ liệu cá nhân và không được phép tiết lộ cho bên thứ ba. Chúng tôi không chịu bất kỳ trách nhiệm nào cho việc dùng sai mật khẩu nếu đây không phải lỗi của chúng tôi.

- Chúng tôi có thể dùng thông tin cá nhân của bạn để nghiên cứu thị trường. mọi thông tin chi tiết sẽ được ẩn và chỉ được dùng để thống kê. Quý khách có thể từ chối không tham gia bất cứ lúc nào.

2. Bảo mật

- Chúng tôi có biện pháp thích hợp về kỹ thuật và an ninh để ngăn chặn truy cập trái phép hoặc trái pháp luật hoặc mất mát hoặc tiêu hủy hoặc thiệt hại cho thông tin của bạn.

- Chúng tôi khuyên quý khách không nên đưa thông tin chi tiết về việc thanh toán với bất kỳ ai bằng e-mail, chúng tôi không chịu trách nhiệm về những mất mát quý khách có thể gánh chịu trong việc trao đổi thông tin của quý khách qua internet hoặc email.

- Quý khách tuyệt đối không sử dụng bất kỳ chương trình, công cụ hay hình thức nào khác để can thiệp vào hệ thống hay làm thay đổi cấu trúc dữ liệu. Nghiêm cấm việc phát tán, truyền bá hay cổ vũ cho bất kỳ hoạt động nào nhằm can thiệp, phá hoại hay xâm nhập vào dữ liệu của hệ thống website. Mọi vi phạm sẽ bị tước bỏ mọi quyền lợi cũng như sẽ bị truy tố trước pháp luật nếu cần thiết.

- Mọi thông tin giao dịch sẽ được bảo mật nhưng trong trường hợp cơ quan pháp luật yêu cầu, chúng tôi sẽ buộc phải cung cấp những thông tin này cho các cơ quan pháp luật.

Các điều kiện, điều khoản và nội dung của trang web này được điều chỉnh bởi luật pháp Việt Nam và tòa án Việt Nam có thẩm quyền xem xét.

3. Quyền lợi khách hàng

- Quý khách có quyền yêu cầu truy cập vào dữ liệu cá nhân của mình, có quyền yêu cầu chúng tôi sửa lại những sai sót trong dữ liệu của bạn mà không mất phí. Bất cứ lúc nào bạn cũng có quyền yêu cầu chúng tôi ngưng sử dụng dữ liệu cá nhân của bạn cho mục đích tiếp thị.`
    },
    terms: {
      title: 'HƯỚNG DẪN MUA HÀNG',
      content: `Bước 1: Truy cập website và lựa chọn sản phẩm cần mua để mua hàng

Bước 2:  Click và sản phẩm muốn mua, màn hình hiển thị ra pop up với các lựa chọn sau:

Nếu bạn muốn tiếp tục mua hàng: Bấm vào phần tiếp tục mua hàng để lựa chọn thêm sản phẩm vào giỏ hàng

Nếu bạn muốn xem giỏ hàng để cập nhật sản phẩm: Bấm vào xem giỏ hàng

Nếu bạn muốn đặt hàng và thanh toán cho sản phẩm này vui lòng bấm vào: Đặt hàng và thanh toán

Bước 3: Lựa chọn thông tin tài khoản thanh toán

Nếu bạn đã có tài khoản vui lòng nhập thông tin tên đăng nhập là email và mật khẩu vào mục đã có tài khoản trên hệ thống

Nếu bạn chưa có tài khoản và muốn đăng ký tài khoản vui lòng điền các thông tin cá nhân để tiếp tục đăng ký tài khoản. Khi có tài khoản bạn sẽ dễ dàng theo dõi được đơn hàng của mình

Nếu bạn muốn mua hàng mà không cần tài khoản vui lòng nhấp chuột vào mục đặt hàng không cần tài khoản

Bước 4: Điền các thông tin của bạn để nhận đơn hàng, lựa chọn hình thức thanh toán và vận chuyển cho đơn hàng của mình

Bước 5: Xem lại thông tin đặt hàng, điền chú thích và gửi đơn hàng

Sau khi nhận được đơn hàng bạn gửi chúng tôi sẽ liên hệ bằng cách gọi điện lại để xác nhận lại đơn hàng và địa chỉ của bạn.

Trân trọng cảm ơn.`
    }
  };

  const openPolicyDialog = (type: 'return' | 'privacy' | 'terms') => {
    setPolicyContent(policyContents[type]);
    setPolicyDialogOpen(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  // Redirect if no token or checkout data
  if (!checkoutToken || !checkout) {
    return null;
  }

  // Use checkout data for display
  const displayItems = checkout.line_items || items;
  const displayTotal = checkout.total_price || total;
  const displayItemCount = checkout.item_count || itemCount;
  const isShippingAddressComplete = hasCompleteAddressInfo(formData);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Column - 70% */}
          <div className="w-[70%] space-y-6">
            {/* Row 1: Logo */}
            <div className="flex items-center justify-center relative">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-40 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{SITE_CONFIG.name}</span>
                </div>
              </Link>
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="absolute right-0 flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Đăng xuất
                </button>
              )}
            </div>

            {/* Row 2: Shipping Info and Shipping/Payment */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left: Shipping Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
                
                {addresses.length > 0 && (
                  <div>
                    <Label htmlFor="address_select">Số địa chỉ</Label>
                    <Select
                      value={selectedAddressId ? selectedAddressId.toString() : addresses.length > 0 ? 'other' : ''}
                      onValueChange={async (value) => {
                        if (value === 'other') {
                          setSelectedAddressId(null);
                          setIsCheckoutAddressDetached(true);
                          
                          const newFormData = {
                            first_name: user?.first_name || '',
                            last_name: user?.last_name || '',
                            phone: user?.phone || '',
                            email: user?.email || '',
                            address: '',
                            province_code: '',
                            district_code: '',
                            ward_code: '',
                            notes: notesRef.current || '',
                          };
                          setFormData(newFormData);
                          setDistricts([]);
                          setWards([]);
                          
                          if (checkoutToken) {
                            try {
                              // CHỈ gửi shipping_address_id = null, KHÔNG gửi các field khác
                              // để tránh lỗi validate (ví dụ: phone rỗng)
                              await checkoutService.updateCheckout(checkoutToken, {
                                shipping_address_id: null,
                              });
                              
                              // Clear shipping rates vì chưa có địa chỉ đầy đủ
                              setShippingRates([]);
                              setSelectedShippingRateId(null);
                            } catch (error: any) {
                              console.error('Failed to update checkout:', error);
                              toast.error('Không thể cập nhật địa chỉ');
                            }
                          }
                          return;
                        }

                        const addrId = parseInt(value);
                        const addr = addresses.find((a) => a.id === addrId);
                        if (addr) {
                          // Deep copy để tránh thay đổi địa chỉ gốc
                          const addressCopy = JSON.parse(JSON.stringify(addr));
                          setSelectedAddressId(addressCopy.id);
                          setIsCheckoutAddressDetached(false);
                          await applySavedAddress(addressCopy);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn địa chỉ" />
                      </SelectTrigger>
                      <SelectContent>
                        {addresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id.toString()}>
                            {[addr.address, addr.ward_name, addr.district_name, addr.province_name]
                              .filter(Boolean)
                              .join(', ')}
                            {addr.default_address && ' (Mặc định)'}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Địa chỉ khác...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="full_name">Họ và tên</Label>
                  <Input
                    id="full_name"
                    value={`${formData.first_name} ${formData.last_name}`.trim()}
                    onChange={(e) => {
                      const parts = e.target.value.split(' ');
                      const lastName = parts.pop() || '';
                      const firstName = parts.join(' ') || '';
                      setFormData((prev) => ({
                        ...prev,
                        first_name: firstName,
                        last_name: lastName,
                      }));
                    }}
                    placeholder="Họ và tên"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="flex gap-2">
                    <Select defaultValue="84">
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="84">🇻🇳 +84</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '');
                        if (value && !value.startsWith('0')) {
                          value = '0' + value.replace(/^0+/, '');
                        }
                        if (value.length > 10) {
                          value = value.slice(0, 10);
                        }
                        handleChange('phone', value);
                      }}
                      placeholder="0987654321"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Địa chỉ</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Số nhà, tên đường"
                  />
                </div>

                <div>
                  <Label htmlFor="province">Tỉnh thành</Label>
                  <Select
                    value={formData.province_code}
                    onValueChange={(value) => handleChange('province_code', value)}
                    disabled={loadingRegions}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tỉnh/thành phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="district">Quận huyện</Label>
                  <Select
                    value={formData.district_code}
                    onValueChange={(value) => handleChange('district_code', value)}
                    disabled={loadingRegions || !formData.province_code}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn quận/huyện" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ward">Phường xã</Label>
                  <Select
                    value={formData.ward_code}
                    onValueChange={(value) => handleChange('ward_code', value)}
                    disabled={loadingRegions || !formData.district_code}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phường/xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.code} value={ward.code}>
                          {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Ghi chú cho đơn hàng"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Quý khách có nhu cầu xuất hóa đơn vui lòng để lại thông tin xuất hóa đơn tại phần ghi chú (Tên xuất hóa đơn, Mã số thuế, Địa chỉ, Email nhận hóa đơn)
                  </p>
                </div>
              </div>

              {/* Right: Shipping and Payment */}
              <div className="space-y-6">
                {/* Shipping Method */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Vận chuyển</h2>
                  <div className="space-y-2">
                    {shippingRates.length > 0 ? (
                      shippingRates.map((rate) => (
                        <label
                          key={rate.id}
                          className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={rate.id.toString()}
                            checked={selectedShippingRateId === rate.id}
                            onChange={async (e) => {
                              setSelectedShippingRateId(rate.id);
                              if (checkoutToken) {
                                try {
                                  await checkoutService.updateCheckout(checkoutToken, {
                                    shipping_rate_id: rate.id,
                                  });
                                  const updatedCheckout = await checkoutService.getCheckout(checkoutToken);
                                  setCheckout(updatedCheckout);
                                } catch (error: any) {
                                  console.error('Failed to update shipping rate:', error);
                                  toast.error('Không thể cập nhật phí vận chuyển');
                                }
                              }
                            }}
                            className="w-4 h-4 text-red-600"
                          />
                          <span className="flex-1">{rate.name}</span>
                          <span className={rate.price === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                            {rate.price === 0 ? 'Miễn phí' : `${rate.price.toLocaleString()}đ`}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        {!isShippingAddressComplete
                          ? 'Vui lòng chọn tỉnh/thành phố, quận/huyện và phường/xã để xem phí vận chuyển'
                          : isLoadingShippingRates
                            ? 'Đang tải phí vận chuyển...'
                            : 'Không tìm thấy phí vận chuyển phù hợp cho địa chỉ này'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Thanh toán</h2>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id.toString()}
                          checked={paymentMethod === method.id.toString()}
                          onChange={async (e) => {
                            setPaymentMethod(e.target.value);
                            if (checkoutToken) {
                              try {
                                await checkoutService.updateCheckout(checkoutToken, {
                                  payment_method_id: parseInt(e.target.value),
                                });
                                const updatedCheckout = await checkoutService.getCheckout(checkoutToken);
                                setCheckout(updatedCheckout);
                              } catch (error: any) {
                                console.error('Failed to update payment method:', error);
                                toast.error('Không thể cập nhật phương thức thanh toán');
                              }
                            }
                          }}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="flex-1">{method.name}</span>
                        {method.description && (
                          <span className="text-sm text-gray-500">{method.description}</span>
                        )}
                        {method.beneficiary_account && (
                          <div className="text-xs text-gray-600 mt-1">
                            <div>{method.beneficiary_account.bank_name}</div>
                            <div>{method.beneficiary_account.account_number}</div>
                            <div>{method.beneficiary_account.account_name}</div>
                          </div>
                        )}
                      </label>
                    ))}
                    {paymentMethods.length === 0 && (
                      <p className="text-gray-500 text-sm">Đang tải phương thức thanh toán...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Policies, Terms, Contact */}
            <div className="pt-6 border-t">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <button
                  onClick={() => openPolicyDialog('return')}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Chính sách đổi trả và hoàn tiền
                </button>
                <button
                  onClick={() => openPolicyDialog('privacy')}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Chính sách bảo mật
                </button>
                <button
                  onClick={() => openPolicyDialog('terms')}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  Điều khoản sử dụng
                </button>
                <div className="ml-auto text-gray-600">
                  Liên hệ hỗ trợ đặt hàng:{' '}
                  <a href={`tel:${CONTACT_INFO.phone}`} className="text-red-600 font-medium">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 30% */}
          <div className="w-[30%]">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Đơn hàng ({displayItemCount} sản phẩm)
                </h3>

                {/* Product List */}
                <div className="space-y-4 mb-6">
                  {displayItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-visible flex-shrink-0 border border-gray-300">
                        <img
                          src={item.image_url || '/images/placeholder.jpg'}
                          alt={item.product_name || 'product'}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                          {item.quantity ?? 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {(item.price ?? 0).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập mã giảm giá"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleApplyDiscount}
                      variant="outline"
                      className="cursor-pointer"
                    >
                      Áp dụng
                    </Button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{displayTotal.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Phí vận chuyển:</span>
                    <span className={checkout.shipping_rate?.price === 0 ? 'text-green-600' : ''}>
                      {checkout.shipping_rate 
                        ? (checkout.shipping_rate.price === 0 
                            ? 'Miễn phí' 
                            : `${checkout.shipping_rate.price.toLocaleString()}đ`)
                        : 'Chưa chọn'}
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {((displayTotal || 0) + (checkout.shipping_rate?.price || 0)).toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => router.push('/cart')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay về giỏ hàng
                  </Button>
                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    onClick={handlePlaceOrder}
                    disabled={isCompleting || !paymentMethod || !selectedShippingRateId}
                  >
                    {isCompleting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Policy Dialog */}
      <Dialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {policyContent?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-line text-sm leading-relaxed">
            {policyContent?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


