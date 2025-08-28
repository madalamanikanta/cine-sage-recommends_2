import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { logger } from '@/lib/logger'

interface UseAsyncOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  errorMessage?: string
}

interface UseAsyncState<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export function useAsync<T = any>(options: UseAsyncOptions = {}) {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage,
    errorMessage
  } = options

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false
  })

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    setState({
      data: null,
      error: null,
      isLoading: true,
      isSuccess: false,
      isError: false
    })

    try {
      logger.debug('useAsync: Starting async operation')
      const data = await asyncFunction()
      
      setState({
        data,
        error: null,
        isLoading: false,
        isSuccess: true,
        isError: false
      })

      logger.info('useAsync: Operation completed successfully', data)
      
      if (showSuccessToast) {
        toast.success(successMessage || 'Operation completed successfully')
      }
      
      onSuccess?.(data)
      return data
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      setState({
        data: null,
        error: errorObj,
        isLoading: false,
        isSuccess: false,
        isError: true
      })

      logger.error('useAsync: Operation failed', errorObj)
      
      if (showErrorToast) {
        toast.error(errorMessage || errorObj.message || 'Something went wrong')
      }
      
      onError?.(errorObj)
      throw errorObj
    }
  }, [onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage])

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false
    })
  }, [])

  return {
    ...state,
    execute,
    reset
  }
}
