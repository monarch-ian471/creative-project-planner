declare module 'vue-sonner' {
    import { App } from 'vue'
  
    export interface ToasterProps {
      position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
      hotkey?: string[]
      duration?: number
      richColors?: boolean
      visibleToasts?: number
      closeButton?: boolean
    }
  
    export interface ToastOptions {
      id?: string | number
      duration?: number
      dismissable?: boolean
    }
  
    export interface Toast {
      id?: string | number
      title?: string
      description?: string
      action?: {
        label: string
        onClick: () => void
      }
      cancel?: {
        label: string
        onClick?: () => void
      }
    }
  
    export const toast: {
      success: (message: string, options?: ToastOptions) => void
      error: (message: string, options?: ToastOptions) => void
      info: (message: string, options?: ToastOptions) => void
      warning: (message: string, options?: ToastOptions) => void
      default: (message: string, options?: ToastOptions) => void
    }
  
    export class Toaster {
      static error(arg0: string) {
        throw new Error('Method not implemented.')
      }
      static install(app: App, options?: ToasterProps): void
    }
  
    export default Toaster
  }