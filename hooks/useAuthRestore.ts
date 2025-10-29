'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUserProfile, initializeAuth, setRestored } from '@/redux/slices/authSlice'
import { apiClient, AuthManager } from '@/services/api/client'

export function useAuthRestore() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = AuthManager.getAccessToken()

    if (token) {
      apiClient.setAuthToken(token)
      dispatch(initializeAuth())
      dispatch(getUserProfile() as any)
        .finally(() => {
          dispatch(setRestored(true))
        })
    } else {
      dispatch(setRestored(true))
    }
  }, [dispatch])
}
