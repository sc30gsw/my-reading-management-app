import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ANIMATION_CONFIG, MOTION_VARIANTS, PERFORMANCE_CONFIG } from '~/features/landing/constants'
import type { AnimationConfig, AnimationVariant } from '~/features/landing/types'

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Number formatting utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`
  }
  return num.toString()
}

export function formatCount(count: number, unit?: string): string {
  const formattedNumber = formatNumber(count)
  return unit ? `${formattedNumber}${unit}` : formattedNumber
}

// Animation utilities
export function getAnimationVariant(variant: AnimationVariant) {
  return MOTION_VARIANTS[variant] || MOTION_VARIANTS.fadeIn
}

export function createAnimationConfig(
  variant: AnimationVariant,
  options: Partial<AnimationConfig> = {},
): AnimationConfig {
  return {
    variant,
    delay: options.delay ?? 0,
    duration: options.duration ?? ANIMATION_CONFIG.durations.normal,
    stagger: options.stagger ?? ANIMATION_CONFIG.delays.stagger,
  }
}

export function getStaggeredDelay(
  index: number,
  baseDelay: number = 0,
  stagger: number = ANIMATION_CONFIG.delays.stagger,
): number {
  return baseDelay + index * stagger
}

// Performance utilities
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia(PERFORMANCE_CONFIG.animation.reducedMotion).matches
}

export function getOptimizedImageSizes(type: 'hero' | 'feature' | 'avatar'): string {
  return PERFORMANCE_CONFIG.images.sizes[type]
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Easing functions for animations
export const easing = {
  linear: (t: number): number => t,
  easeOut: (t: number): number => 1 - (1 - t) ** 3,
  easeIn: (t: number): number => t ** 3,
  easeInOut: (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  bounce: (t: number): number => {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      const adjusted = t - 1.5 / d1
      return n1 * adjusted * adjusted + 0.75
    } else if (t < 2.5 / d1) {
      const adjusted = t - 2.25 / d1
      return n1 * adjusted * adjusted + 0.9375
    } else {
      const adjusted = t - 2.625 / d1
      return n1 * adjusted * adjusted + 0.984375
    }
  },
}

// Count animation utility
export function animateCount(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void,
  easingFunction: (t: number) => number = easing.easeOut,
): () => void {
  const startTime = Date.now()
  const difference = end - start

  function updateCount() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easingFunction(progress)
    const current = Math.floor(start + difference * easedProgress)

    callback(current)

    if (progress < 1) {
      requestAnimationFrame(updateCount)
    }
  }

  const animationId = requestAnimationFrame(updateCount)

  // Return cleanup function
  return () => cancelAnimationFrame(animationId)
}

// Intersection Observer utility
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {},
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null

  const defaultOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px',
    ...options,
  }

  return new IntersectionObserver(callback, defaultOptions)
}

// Scroll utilities
export function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight

  return documentHeight > 0 ? scrollTop / documentHeight : 0
}

export function getElementScrollProgress(element: Element): number {
  if (typeof window === 'undefined') return 0

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // Element is completely above viewport
  if (rect.bottom <= 0) return 1

  // Element is completely below viewport
  if (rect.top >= windowHeight) return 0

  // Element is partially or completely in viewport
  const elementHeight = rect.height
  const visibleTop = Math.max(0, -rect.top)
  const visibleBottom = Math.min(elementHeight, windowHeight - rect.top)
  const visibleHeight = visibleBottom - visibleTop

  return visibleHeight / elementHeight
}

// Accessibility utilities
export function announceToScreenReader(message: string): void {
  if (typeof window === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Focus management
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
  )

  const firstElement = focusableElements[0] as HTMLElement
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

// URL utilities
export function createSafeUrl(url: string, fallback = '/'): string {
  try {
    // Check if it's a relative URL
    if (url.startsWith('/') || url.startsWith('#')) {
      return url
    }

    // Check if it's a valid absolute URL
    new URL(url)
    return url
  } catch {
    return fallback
  }
}

// Device detection utilities
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false

  return window.innerWidth < 768
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false

  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false

  return window.innerWidth >= 1024
}

// Local storage utilities with error handling
export function getStorageItem(key: string, defaultValue: any = null): any {
  if (typeof window === 'undefined') return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setStorageItem(key: string, value: any): boolean {
  if (typeof window === 'undefined') return false

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Performance monitoring utilities
export function measurePerformance(name: string): () => void {
  if (typeof window === 'undefined') return () => {}

  const startTime = performance.now()

  return () => {
    const endTime = performance.now()
    const duration = endTime - startTime

    // Log performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`)
    }

    // Send to analytics in production (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('event', 'timing_complete', {
        name,
        value: Math.round(duration),
      })
    }
  }
}

// Error boundary utility
export function captureError(error: Error, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error)
  }

  // Send to error tracking service in production
  // This would integrate with services like Sentry, LogRocket, etc.
}

// Safe JSON parsing
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}
