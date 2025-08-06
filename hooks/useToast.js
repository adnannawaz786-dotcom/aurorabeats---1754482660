import { useState, useCallback } from 'react'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toastData) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      ...toastData,
    }

    setToasts((currentToasts) => {
      const newToasts = [toast, ...currentToasts].slice(0, TOAST_LIMIT)
      return newToasts
    })

    // Auto remove toast after delay
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter(t => t.id !== id))
    }, TOAST_REMOVE_DELAY)

    return id
  }, [])

  const removeToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter(t => t.id !== toastId))
  }, [])

  const toast = useCallback((toastData) => {
    return addToast(toastData)
  }, [addToast])

  return {
    toasts,
    toast,
    addToast,
    removeToast,
  }
}