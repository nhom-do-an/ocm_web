import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Optimized selector hook with shallow equality check
export const useAppSelectorShallow = <T>(selector: (state: RootState) => T): T => {
  return useSelector(selector, shallowEqual);
};
