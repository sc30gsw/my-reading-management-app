import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  animateCount,
  announceToScreenReader,
  captureError,
  cn,
  createAnimationConfig,
  createIntersectionObserver,
  createSafeUrl,
  debounce,
  easing,
  formatCount,
  formatNumber,
  getAnimationVariant,
  getElementScrollProgress,
  getOptimizedImageSizes,
  getScrollProgress,
  getStaggeredDelay,
  getStorageItem,
  isDesktop,
  isMobile,
  isTablet,
  measurePerformance,
  safeJsonParse,
  setStorageItem,
  shouldReduceMotion,
  throttle,
  trapFocus,
} from '~/features/landing/utils'

// Mock window object for SSR tests
const mockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  pageYOffset: 0,
  matchMedia: vi.fn().mockReturnValue({
    matches: false,
  }),
  requestAnimationFrame: vi.fn((cb) => setTimeout(cb, 16)),
  cancelAnimationFrame: vi.fn(),
  localStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
  gtag: vi.fn(),
}

const mockDocument = {
  documentElement: {
    scrollTop: 0,
    scrollHeight: 2000,
  },
  createElement: vi.fn().mockReturnValue({
    setAttribute: vi.fn(),
    textContent: '',
    className: '',
  }),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
  },
  activeElement: null,
  querySelectorAll: vi.fn().mockReturnValue([]),
}

const mockPerformance = {
  now: vi.fn(() => Date.now()),
}

// Global mocks
Object.defineProperty(global, 'window', {
  value: mockWindow,
  writable: true,
})

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true,
})

Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true,
})

describe('landing/utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWindow.innerWidth = 1024
    mockWindow.innerHeight = 768
    mockWindow.pageYOffset = 0
    mockDocument.documentElement.scrollTop = 0
    mockDocument.documentElement.scrollHeight = 2000
    mockPerformance.now.mockReturnValue(1000)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('cn', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('should merge Tailwind classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers under 1000 as is', () => {
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(42)).toBe('42')
    })

    it('should format thousands with K suffix', () => {
      expect(formatNumber(1000)).toBe('1K')
      expect(formatNumber(1500)).toBe('1.5K')
      expect(formatNumber(10000)).toBe('10K')
      expect(formatNumber(999999)).toBe('1000K')
    })

    it('should format millions with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1M')
      expect(formatNumber(1500000)).toBe('1.5M')
      expect(formatNumber(10000000)).toBe('10M')
    })

    it('should remove trailing .0', () => {
      expect(formatNumber(1000)).toBe('1K')
      expect(formatNumber(2000000)).toBe('2M')
    })
  })

  describe('formatCount', () => {
    it('should format count without unit', () => {
      expect(formatCount(1234)).toBe('1.2K')
    })

    it('should format count with unit', () => {
      expect(formatCount(1234, '+')).toBe('1.2K+')
      expect(formatCount(5000000, ' users')).toBe('5M users')
    })
  })

  describe('getAnimationVariant', () => {
    it('should return specified variant from MOTION_VARIANTS', () => {
      const result = getAnimationVariant('fadeIn')
      expect(result).toBeDefined()
    })

    it('should return fadeIn variant for unknown variants', () => {
      const result = getAnimationVariant('unknown' as any)
      expect(result).toBeDefined()
    })
  })

  describe('createAnimationConfig', () => {
    it('should create animation config with defaults', () => {
      const config = createAnimationConfig('fadeIn')
      expect(config).toMatchObject({
        variant: 'fadeIn',
        delay: 0,
        duration: expect.any(Number),
        stagger: expect.any(Number),
      })
    })

    it('should create animation config with custom options', () => {
      const config = createAnimationConfig('slideUp', {
        delay: 100,
        duration: 500,
        stagger: 50,
      })
      expect(config).toMatchObject({
        variant: 'slideUp',
        delay: 100,
        duration: 500,
        stagger: 50,
      })
    })
  })

  describe('getStaggeredDelay', () => {
    it('should calculate staggered delay correctly', () => {
      expect(getStaggeredDelay(0)).toBe(0)
      expect(getStaggeredDelay(1, 0, 100)).toBe(100)
      expect(getStaggeredDelay(2, 50, 100)).toBe(250)
    })
  })

  describe('shouldReduceMotion', () => {
    it('should return false in SSR environment', () => {
      delete (global as any).window
      expect(shouldReduceMotion()).toBe(false)
      global.window = mockWindow as any
    })

    it('should return matchMedia result', () => {
      mockWindow.matchMedia.mockReturnValue({ matches: true })
      expect(shouldReduceMotion()).toBe(true)

      mockWindow.matchMedia.mockReturnValue({ matches: false })
      expect(shouldReduceMotion()).toBe(false)
    })
  })

  describe('getOptimizedImageSizes', () => {
    it('should return size string for different image types', () => {
      expect(getOptimizedImageSizes('hero')).toBeDefined()
      expect(getOptimizedImageSizes('feature')).toBeDefined()
      expect(getOptimizedImageSizes('avatar')).toBeDefined()
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      debouncedFn('arg2')
      debouncedFn('arg3')

      expect(mockFn).not.toHaveBeenCalled()

      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenLastCalledWith('arg3')
    })

    it('should clear timeout on subsequent calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1')
      await new Promise((resolve) => setTimeout(resolve, 50))
      debouncedFn('arg2')
      await new Promise((resolve) => setTimeout(resolve, 150))

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenLastCalledWith('arg2')
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('arg1')
      throttledFn('arg2')
      throttledFn('arg3')

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('arg1')

      await new Promise((resolve) => setTimeout(resolve, 150))
      throttledFn('arg4')
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenLastCalledWith('arg4')
    })
  })

  describe('easing functions', () => {
    describe('linear', () => {
      it('should return linear progression', () => {
        expect(easing.linear(0)).toBe(0)
        expect(easing.linear(0.5)).toBe(0.5)
        expect(easing.linear(1)).toBe(1)
      })
    })

    describe('easeOut', () => {
      it('should provide easeOut curve', () => {
        expect(easing.easeOut(0)).toBe(0)
        expect(easing.easeOut(1)).toBe(1)
        expect(easing.easeOut(0.5)).toBeGreaterThan(0.5)
      })
    })

    describe('easeIn', () => {
      it('should provide easeIn curve', () => {
        expect(easing.easeIn(0)).toBe(0)
        expect(easing.easeIn(1)).toBe(1)
        expect(easing.easeIn(0.5)).toBeLessThan(0.5)
      })
    })

    describe('easeInOut', () => {
      it('should provide easeInOut curve', () => {
        expect(easing.easeInOut(0)).toBe(0)
        expect(easing.easeInOut(1)).toBe(1)
        expect(easing.easeInOut(0.5)).toBe(0.5)
      })
    })

    describe('bounce', () => {
      it('should provide bounce effect', () => {
        expect(easing.bounce(0)).toBe(0)
        expect(easing.bounce(1)).toBeCloseTo(1, 5)
        expect(easing.bounce(0.5)).toBeGreaterThan(0)
      })
    })
  })

  describe('animateCount', () => {
    it('should animate count from start to end', async () => {
      const callback = vi.fn()
      const cleanup = animateCount(0, 100, 1000, callback)

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(callback).toHaveBeenCalled()
      expect(callback.mock.calls[0][0]).toBeGreaterThanOrEqual(0)
      cleanup()
    })

    it('should use custom easing function', async () => {
      const callback = vi.fn()
      const customEasing = vi.fn().mockReturnValue(0.5)
      const cleanup = animateCount(0, 100, 1000, callback, customEasing)

      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(customEasing).toHaveBeenCalled()
      cleanup()
    })

    it('should return cleanup function', () => {
      const callback = vi.fn()
      const cleanup = animateCount(0, 100, 1000, callback)
      expect(typeof cleanup).toBe('function')
      cleanup()
    })
  })

  describe('createIntersectionObserver', () => {
    it('should return null in SSR environment', () => {
      delete (global as any).window
      const observer = createIntersectionObserver(() => {})
      expect(observer).toBeNull()
      global.window = mockWindow as any
    })

    it('should create IntersectionObserver with default options', () => {
      const mockIntersectionObserver = vi.fn()
      global.IntersectionObserver = mockIntersectionObserver

      const callback = vi.fn()
      createIntersectionObserver(callback)

      expect(mockIntersectionObserver).toHaveBeenCalledWith(callback, {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px',
      })
    })

    it('should merge custom options', () => {
      const mockIntersectionObserver = vi.fn()
      global.IntersectionObserver = mockIntersectionObserver

      const callback = vi.fn()
      const customOptions = { threshold: 0.5, rootMargin: '10px' }
      createIntersectionObserver(callback, customOptions)

      expect(mockIntersectionObserver).toHaveBeenCalledWith(callback, {
        threshold: 0.5,
        rootMargin: '10px',
      })
    })
  })

  describe('getScrollProgress', () => {
    it('should return 0 in SSR environment', () => {
      delete (global as any).window
      expect(getScrollProgress()).toBe(0)
      global.window = mockWindow as any
    })

    it('should calculate scroll progress correctly', () => {
      mockWindow.pageYOffset = 500
      mockDocument.documentElement.scrollTop = 500
      mockDocument.documentElement.scrollHeight = 2000
      mockWindow.innerHeight = 768

      const progress = getScrollProgress()
      expect(progress).toBeCloseTo(500 / (2000 - 768))
    })

    it('should return 0 when document height is not greater than window height', () => {
      mockWindow.pageYOffset = 0
      mockDocument.documentElement.scrollHeight = 500
      mockWindow.innerHeight = 768

      expect(getScrollProgress()).toBe(0)
    })
  })

  describe('getElementScrollProgress', () => {
    const mockElement = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        top: 100,
        bottom: 300,
        height: 200,
      }),
    }

    beforeEach(() => {
      mockWindow.innerHeight = 768
    })

    it('should return 0 in SSR environment', () => {
      delete (global as any).window
      expect(getElementScrollProgress(mockElement as any)).toBe(0)
      global.window = mockWindow as any
    })

    it('should return 1 when element is completely above viewport', () => {
      mockElement.getBoundingClientRect.mockReturnValue({
        top: -300,
        bottom: -100,
        height: 200,
      })

      expect(getElementScrollProgress(mockElement as any)).toBe(1)
    })

    it('should return 0 when element is completely below viewport', () => {
      mockElement.getBoundingClientRect.mockReturnValue({
        top: 800,
        bottom: 1000,
        height: 200,
      })

      expect(getElementScrollProgress(mockElement as any)).toBe(0)
    })

    it('should calculate progress for partially visible element', () => {
      mockElement.getBoundingClientRect.mockReturnValue({
        top: -50,
        bottom: 150,
        height: 200,
      })

      // Element height: 200, visible top: 50, visible bottom: 150, visible height: 100
      // Progress should be 100/200 = 0.5
      expect(getElementScrollProgress(mockElement as any)).toBe(0.75)
    })
  })

  describe('announceToScreenReader', () => {
    it('should do nothing in SSR environment', () => {
      delete (global as any).window
      announceToScreenReader('test message')
      expect(mockDocument.createElement).not.toHaveBeenCalled()
      global.window = mockWindow as any
    })

    it('should create announcement element', () => {
      const mockElement = {
        setAttribute: vi.fn(),
        textContent: '',
        className: '',
      }
      mockDocument.createElement.mockReturnValue(mockElement)

      announceToScreenReader('test message')

      expect(mockDocument.createElement).toHaveBeenCalledWith('div')
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-live', 'polite')
      expect(mockElement.setAttribute).toHaveBeenCalledWith('aria-atomic', 'true')
      expect(mockElement.className).toBe('sr-only')
      expect(mockElement.textContent).toBe('test message')
      expect(mockDocument.body.appendChild).toHaveBeenCalledWith(mockElement)
    })

    it('should remove announcement element after timeout', async () => {
      const mockElement = {
        setAttribute: vi.fn(),
        textContent: '',
        className: '',
      }
      mockDocument.createElement.mockReturnValue(mockElement)

      announceToScreenReader('test message')

      await new Promise((resolve) => setTimeout(resolve, 1100))
      expect(mockDocument.body.removeChild).toHaveBeenCalledWith(mockElement)
    })
  })

  describe('trapFocus', () => {
    const mockElement = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      querySelectorAll: vi.fn(),
    }

    const mockFocusableElements = [{ focus: vi.fn() }, { focus: vi.fn() }, { focus: vi.fn() }]

    beforeEach(() => {
      mockElement.querySelectorAll.mockReturnValue(mockFocusableElements)
    })

    it('should add keydown event listener', () => {
      trapFocus(mockElement as any)
      expect(mockElement.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should return cleanup function', () => {
      const cleanup = trapFocus(mockElement as any)
      expect(typeof cleanup).toBe('function')

      cleanup()
      expect(mockElement.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    })

    it('should handle Tab key navigation', () => {
      trapFocus(mockElement as any)
      const keydownHandler = mockElement.addEventListener.mock.calls[0][1]

      // Mock active element as last element
      Object.defineProperty(document, 'activeElement', {
        value: mockFocusableElements[2],
        writable: true,
      })

      const mockEvent = {
        key: 'Tab',
        shiftKey: false,
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)
      expect(mockFocusableElements[0].focus).toHaveBeenCalled()
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })

    it('should handle Shift+Tab key navigation', () => {
      trapFocus(mockElement as any)
      const keydownHandler = mockElement.addEventListener.mock.calls[0][1]

      // Mock active element as first element
      Object.defineProperty(document, 'activeElement', {
        value: mockFocusableElements[0],
        writable: true,
      })

      const mockEvent = {
        key: 'Tab',
        shiftKey: true,
        preventDefault: vi.fn(),
      }

      keydownHandler(mockEvent)
      expect(mockFocusableElements[2].focus).toHaveBeenCalled()
      expect(mockEvent.preventDefault).toHaveBeenCalled()
    })
  })

  describe('createSafeUrl', () => {
    it('should return relative URLs as is', () => {
      expect(createSafeUrl('/path')).toBe('/path')
      expect(createSafeUrl('#anchor')).toBe('#anchor')
    })

    it('should return valid absolute URLs as is', () => {
      expect(createSafeUrl('https://example.com')).toBe('https://example.com')
      expect(createSafeUrl('http://localhost:3000')).toBe('http://localhost:3000')
    })

    it('should return fallback for invalid URLs', () => {
      expect(createSafeUrl('invalid-url')).toBe('/')
      expect(createSafeUrl('invalid-url', '/fallback')).toBe('/fallback')
    })
  })

  describe('device detection', () => {
    describe('isMobile', () => {
      it('should return false in SSR environment', () => {
        delete (global as any).window
        expect(isMobile()).toBe(false)
        global.window = mockWindow as any
      })

      it('should detect mobile screens', () => {
        mockWindow.innerWidth = 600
        expect(isMobile()).toBe(true)

        mockWindow.innerWidth = 800
        expect(isMobile()).toBe(false)
      })
    })

    describe('isTablet', () => {
      it('should return false in SSR environment', () => {
        delete (global as any).window
        expect(isTablet()).toBe(false)
        global.window = mockWindow as any
      })

      it('should detect tablet screens', () => {
        mockWindow.innerWidth = 800
        expect(isTablet()).toBe(true)

        mockWindow.innerWidth = 600
        expect(isTablet()).toBe(false)

        mockWindow.innerWidth = 1200
        expect(isTablet()).toBe(false)
      })
    })

    describe('isDesktop', () => {
      it('should return false in SSR environment', () => {
        delete (global as any).window
        expect(isDesktop()).toBe(false)
        global.window = mockWindow as any
      })

      it('should detect desktop screens', () => {
        mockWindow.innerWidth = 1200
        expect(isDesktop()).toBe(true)

        mockWindow.innerWidth = 800
        expect(isDesktop()).toBe(false)
      })
    })
  })

  describe('localStorage utilities', () => {
    describe('getStorageItem', () => {
      it('should return default value in SSR environment', () => {
        delete (global as any).window
        expect(getStorageItem('key', 'default')).toBe('default')
        global.window = mockWindow as any
      })

      it('should get and parse item from localStorage', () => {
        const mockStorage = {
          getItem: vi.fn().mockReturnValue('{"test": "value"}'),
        }
        Object.defineProperty(global, 'localStorage', {
          value: mockStorage,
          writable: true,
        })
        expect(getStorageItem('key')).toEqual({ test: 'value' })
      })

      it('should return default value when item is null', () => {
        mockWindow.localStorage.getItem.mockReturnValue(null)
        expect(getStorageItem('key', 'default')).toBe('default')
      })

      it('should return default value on JSON parse error', () => {
        mockWindow.localStorage.getItem.mockReturnValue('invalid-json')
        expect(getStorageItem('key', 'default')).toBe('default')
      })
    })

    describe('setStorageItem', () => {
      it('should return false in SSR environment', () => {
        delete (global as any).window
        expect(setStorageItem('key', 'value')).toBe(false)
        global.window = mockWindow as any
      })

      it('should set item in localStorage', () => {
        const mockStorage = {
          setItem: vi.fn(),
        }
        Object.defineProperty(global, 'localStorage', {
          value: mockStorage,
          writable: true,
        })
        expect(setStorageItem('key', { test: 'value' })).toBe(true)
        expect(mockStorage.setItem).toHaveBeenCalledWith('key', '{"test":"value"}')
      })

      it('should return false on storage error', () => {
        const mockStorage = {
          setItem: vi.fn().mockImplementation(() => {
            throw new Error('Storage error')
          }),
        }
        Object.defineProperty(global, 'localStorage', {
          value: mockStorage,
          writable: true,
        })
        expect(setStorageItem('key', 'value')).toBe(false)
      })
    })
  })

  describe('measurePerformance', () => {
    it('should return noop function in SSR environment', () => {
      delete (global as any).window
      const endMeasurement = measurePerformance('test')
      expect(typeof endMeasurement).toBe('function')
      global.window = mockWindow as any
    })

    it('should measure performance duration', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      ;(process.env as any).NODE_ENV = 'development'

      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1050)

      const endMeasurement = measurePerformance('test-operation')
      endMeasurement()

      expect(consoleSpy).toHaveBeenCalledWith('Performance: test-operation took 50.00ms')
      consoleSpy.mockRestore()
    })

    it('should send to gtag in production', () => {
      ;(process.env as any).NODE_ENV = 'production'
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1050)

      const endMeasurement = measurePerformance('test-operation')
      endMeasurement()

      expect(mockWindow.gtag).toHaveBeenCalledWith('event', 'timing_complete', {
        name: 'test-operation',
        value: 50,
      })
    })
  })

  describe('captureError', () => {
    it('should log error in development', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(process.env as any).NODE_ENV = 'development'

      const error = new Error('Test error')
      captureError(error, 'test context')

      expect(consoleSpy).toHaveBeenCalledWith('Error in test context:', error)
      consoleSpy.mockRestore()
    })

    it('should log error without context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      ;(process.env as any).NODE_ENV = 'development'

      const error = new Error('Test error')
      captureError(error)

      expect(consoleSpy).toHaveBeenCalledWith('Error:', error)
      consoleSpy.mockRestore()
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      expect(safeJsonParse('{"test": "value"}', null)).toEqual({ test: 'value' })
    })

    it('should return fallback for invalid JSON', () => {
      expect(safeJsonParse('invalid-json', { default: true })).toEqual({ default: true })
    })

    it('should handle primitive fallback values', () => {
      expect(safeJsonParse('invalid-json', 'fallback')).toBe('fallback')
      expect(safeJsonParse('invalid-json', 42)).toBe(42)
      expect(safeJsonParse('invalid-json', true)).toBe(true)
    })
  })
})
