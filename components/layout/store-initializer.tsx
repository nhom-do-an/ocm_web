'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchStoreDetail, fetchLocations } from '@/redux/slices/storeSlice';

export default function StoreInitializer() {
  const dispatch = useAppDispatch();
  const { initialized, locationsInitialized } = useAppSelector((state) => state.store);
  const hasDispatched = useRef(false);

  useEffect(() => {
    // Only fetch once when component mounts and data hasn't been initialized
    if (hasDispatched.current) return;

    if (!initialized) {
      dispatch(fetchStoreDetail());
    }
    if (!locationsInitialized) {
      dispatch(fetchLocations());
    }

    hasDispatched.current = true;
  }, [dispatch, initialized, locationsInitialized]);

  return null;
}
