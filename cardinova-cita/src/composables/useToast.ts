// src/composables/useToast.ts
import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
  const addToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = idCounter++
    toasts.value.push({ id, message, type, duration })
    setTimeout(() => removeToast(id), duration)
  }

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  return {
    toasts,
    addToast,
    removeToast
  }
}