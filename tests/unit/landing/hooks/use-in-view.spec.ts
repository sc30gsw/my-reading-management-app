import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useInView } from '~/features/landing/hooks/use-in-view'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

mockIntersectionObserver.mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
}))

vi.mock('~/features/landing/utils', () => ({
  createIntersectionObserver: vi.fn((callback, options) => {
    return new mockIntersectionObserver(callback, options)
  }),
}))

// Setup global IntersectionObserver mock
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})

describe('useInView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
  })

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useInView())

      expect(result.current.isInView).toBe(false)
      expect(result.current.hasBeenInView).toBe(false)
      expect(result.current.ref).toBeDefined()
      expect(result.current.ref.current).toBeNull()
    })

    it('should accept custom options', () => {
      const options = {
        threshold: 0.5,
        rootMargin: '20px',
        triggerOnce: false,
      }

      const { result } = renderHook(() => useInView(options))

      expect(result.current.isInView).toBe(false)
      expect(result.current.hasBeenInView).toBe(false)
    })
  })

  describe('intersection observer setup', () => {
    it('should create intersection observer when element is set', async () => {
      const { result, rerender } = renderHook(() => useInView())

      // Create a mock element
      const mockElement = document.createElement('div')

      // Set the ref and trigger re-render
      act(() => {
        result.current.ref.current = mockElement
      })
      rerender()

      const { createIntersectionObserver } = await import('~/features/landing/utils')
      expect(createIntersectionObserver).toHaveBeenCalled()
    })

    it('should not observe if element is null', () => {
      renderHook(() => useInView())

      expect(mockObserve).not.toHaveBeenCalled()
    })

    it('should pass correct options to intersection observer', async () => {
      const options = {
        threshold: 0.3,
        rootMargin: '10px 20px',
        triggerOnce: true,
      }

      const { result } = renderHook(() => useInView(options))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView(options))
      rerender()

      // Check if createIntersectionObserver was called with correct options
      const { createIntersectionObserver } = await import('~/features/landing/utils')
      expect(createIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.3,
          rootMargin: '10px 20px',
        },
      )
    })
  })

  describe('intersection handling', () => {
    it('should update isInView when element enters viewport', () => {
      const { result } = renderHook(() => useInView())

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView())
      rerender()

      // Get the callback that was passed to the intersection observer
      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate intersection
      const entries = [
        {
          isIntersecting: true,
          target: mockElement,
        },
      ]

      observerCallback(entries)

      expect(result.current.isInView).toBe(true)
      expect(result.current.hasBeenInView).toBe(true)
    })

    it('should update isInView when element leaves viewport', () => {
      const { result } = renderHook(() => useInView({ triggerOnce: false }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ triggerOnce: false }))
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate entering viewport
      observerCallback([{ isIntersecting: true, target: mockElement }])
      expect(result.current.isInView).toBe(true)

      // Simulate leaving viewport
      observerCallback([{ isIntersecting: false, target: mockElement }])
      expect(result.current.isInView).toBe(false)
      expect(result.current.hasBeenInView).toBe(true)
    })

    it('should stop observing after first intersection when triggerOnce is true', () => {
      const { result } = renderHook(() => useInView({ triggerOnce: true }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ triggerOnce: true }))
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate intersection
      observerCallback([{ isIntersecting: true, target: mockElement }])

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement)
    })

    it('should not stop observing when triggerOnce is false', () => {
      const { result } = renderHook(() => useInView({ triggerOnce: false }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ triggerOnce: false }))
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate intersection
      observerCallback([{ isIntersecting: true, target: mockElement }])

      expect(mockUnobserve).not.toHaveBeenCalled()
    })
  })

  describe('triggerOnce behavior', () => {
    it('should return hasBeenInView when triggerOnce is true', () => {
      const { result } = renderHook(() => useInView({ triggerOnce: true }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ triggerOnce: true }))
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Before intersection
      expect(result.current.isInView).toBe(false)

      // Simulate intersection
      observerCallback([{ isIntersecting: true, target: mockElement }])
      expect(result.current.isInView).toBe(true)

      // Simulate leaving viewport
      observerCallback([{ isIntersecting: false, target: mockElement }])
      // Should still be true because triggerOnce is true
      expect(result.current.isInView).toBe(true)
    })

    it('should return current isInView when triggerOnce is false', () => {
      const { result } = renderHook(() => useInView({ triggerOnce: false }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ triggerOnce: false }))
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate intersection
      observerCallback([{ isIntersecting: true, target: mockElement }])
      expect(result.current.isInView).toBe(true)

      // Simulate leaving viewport
      observerCallback([{ isIntersecting: false, target: mockElement }])
      expect(result.current.isInView).toBe(false)
    })

    it('should not observe again if triggerOnce is true and element has been in view', () => {
      const { result } = renderHook(() => useInView({ triggerOnce: true }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ triggerOnce: true }))
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate intersection to mark as has been in view
      observerCallback([{ isIntersecting: true, target: mockElement }])

      // Clear mock calls
      mockObserve.mockClear()

      // Re-render (simulate dependency change)
      rerender()

      // Should not observe again
      expect(mockObserve).not.toHaveBeenCalled()
    })
  })

  describe('cleanup', () => {
    it('should unobserve element on unmount', () => {
      const { result, unmount } = renderHook(() => useInView())

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView())
      rerender()

      unmount()

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement)
    })

    it('should disconnect observer on unmount', () => {
      const { unmount } = renderHook(() => useInView())

      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should cleanup when element changes', () => {
      const { result, rerender } = renderHook(() => useInView())

      const mockElement1 = document.createElement('div')
      result.current.ref.current = mockElement1

      rerender()

      // Change element
      const mockElement2 = document.createElement('div')
      result.current.ref.current = mockElement2

      rerender()

      expect(mockUnobserve).toHaveBeenCalledWith(mockElement1)
    })

    it('should not crash if element is null during cleanup', () => {
      const { result, rerender, unmount } = renderHook(() => useInView())

      result.current.ref.current = null
      rerender()

      expect(() => unmount()).not.toThrow()
    })
  })

  describe('multiple elements', () => {
    it('should handle multiple intersection entries', () => {
      const { result } = renderHook(() => useInView())

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView())
      rerender()

      const observerCallback = mockIntersectionObserver.mock.calls[0][0]

      // Simulate multiple entries (though only one should match our element)
      const entries = [
        { isIntersecting: false, target: document.createElement('div') },
        { isIntersecting: true, target: mockElement },
        { isIntersecting: false, target: document.createElement('div') },
      ]

      observerCallback(entries)

      expect(result.current.isInView).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle threshold array', () => {
      const options = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }

      const { result } = renderHook(() => useInView(options))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView(options))
      rerender()

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: [0, 0.25, 0.5, 0.75, 1],
          rootMargin: '0px 0px -10% 0px',
        },
      )
    })

    it('should handle zero threshold', () => {
      const { result } = renderHook(() => useInView({ threshold: 0 }))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView({ threshold: 0 }))
      rerender()

      expect(mockObserve).toHaveBeenCalled()
    })

    it('should handle custom rootMargin', async () => {
      const options = {
        rootMargin: '50px 100px 75px 25px',
      }

      const { result } = renderHook(() => useInView(options))

      const mockElement = document.createElement('div')
      result.current.ref.current = mockElement

      const { rerender } = renderHook(() => useInView(options))
      rerender()

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        {
          threshold: 0.1,
          rootMargin: '50px 100px 75px 25px',
        },
      )
    })
  })
})
