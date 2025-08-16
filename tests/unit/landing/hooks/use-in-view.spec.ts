import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Global callback storage for tests
let globalObserverCallback: IntersectionObserverCallback | null = null

// Create individual mock functions for cleaner testing
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

// Mock the IntersectionObserver API globally before tests
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: vi.fn(),
})

// Mock createIntersectionObserver utility
const mockCreateIntersectionObserver = vi.fn(
  (callback: IntersectionObserverCallback, _options: any) => {
    globalObserverCallback = callback
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      root: null,
      rootMargin: '',
      thresholds: [],
      takeRecords: vi.fn(() => []),
    } as any
  },
)

// Mock the entire utils module using beforeEach approach like localStorage test
vi.mock('~/features/landing/utils')

// Now import after mocking
import { useInView } from '~/features/landing/hooks/use-in-view'
import * as utils from '~/features/landing/utils'

// Explicitly mock the function
vi.mocked(utils.createIntersectionObserver).mockImplementation(mockCreateIntersectionObserver)

describe('useInView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockObserve.mockClear()
    mockUnobserve.mockClear()
    mockDisconnect.mockClear()
    globalObserverCallback = null

    // Reset the mock implementation
    vi.mocked(utils.createIntersectionObserver).mockImplementation((callback) => {
      globalObserverCallback = callback
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: vi.fn(() => []),
      } as any
    })
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

  describe('intersection observer behavior', () => {
    it('should handle intersection detection properly', () => {
      const mockElement = document.createElement('div')

      // Initialize hook with pre-attached element
      const { result } = renderHook(() => {
        const hook = useInView()
        // Set element immediately before useEffect runs
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      // Observer should be created and element observed
      expect(utils.createIntersectionObserver).toHaveBeenCalled()
      expect(mockObserve).toHaveBeenCalledWith(mockElement)

      // Simulate intersection callback
      const mockEntry = {
        isIntersecting: true,
        target: mockElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: 1,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: Date.now(),
      } as IntersectionObserverEntry

      act(() => {
        if (globalObserverCallback) {
          globalObserverCallback([mockEntry], {} as IntersectionObserver)
        }
      })

      expect(result.current.isInView).toBe(true)
      expect(result.current.hasBeenInView).toBe(true)
    })

    it('should handle triggerOnce=false properly', () => {
      const mockElement = document.createElement('div')

      const { result } = renderHook(() => {
        const hook = useInView({ triggerOnce: false })
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      const createMockEntry = (isIntersecting: boolean): IntersectionObserverEntry => ({
        isIntersecting,
        target: mockElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: Date.now(),
      })

      // Enter viewport
      act(() => {
        if (globalObserverCallback) {
          globalObserverCallback([createMockEntry(true)], {} as IntersectionObserver)
        }
      })

      expect(result.current.isInView).toBe(true)
      expect(result.current.hasBeenInView).toBe(true)

      // Leave viewport
      act(() => {
        if (globalObserverCallback) {
          globalObserverCallback([createMockEntry(false)], {} as IntersectionObserver)
        }
      })

      // When triggerOnce=false, isInView should reflect current state
      expect(result.current.isInView).toBe(false)
      expect(result.current.hasBeenInView).toBe(true)
    })

    it('should handle triggerOnce=true properly', () => {
      const mockElement = document.createElement('div')

      const { result } = renderHook(() => {
        const hook = useInView({ triggerOnce: true })
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      const createMockEntry = (isIntersecting: boolean): IntersectionObserverEntry => ({
        isIntersecting,
        target: mockElement,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: Date.now(),
      })

      // Enter viewport
      act(() => {
        if (globalObserverCallback) {
          globalObserverCallback([createMockEntry(true)], {} as IntersectionObserver)
        }
      })

      expect(result.current.isInView).toBe(true)
      expect(result.current.hasBeenInView).toBe(true)
      expect(mockUnobserve).toHaveBeenCalledWith(mockElement)

      // Leave viewport (should not affect isInView when triggerOnce=true)
      act(() => {
        if (globalObserverCallback) {
          globalObserverCallback([createMockEntry(false)], {} as IntersectionObserver)
        }
      })

      // When triggerOnce=true, isInView should return hasBeenInView
      expect(result.current.isInView).toBe(true)
      expect(result.current.hasBeenInView).toBe(true)
    })

    it('should pass correct options to intersection observer', () => {
      const options = {
        threshold: 0.3,
        rootMargin: '10px 20px',
        triggerOnce: true,
      }

      const mockElement = document.createElement('div')

      renderHook(() => {
        const hook = useInView(options)
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      expect(utils.createIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.3,
        rootMargin: '10px 20px',
      })
    })
  })

  describe('cleanup', () => {
    it('should disconnect observer on unmount', () => {
      const mockElement = document.createElement('div')

      const { unmount } = renderHook(() => {
        const hook = useInView()
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      // Verify observer was created
      expect(utils.createIntersectionObserver).toHaveBeenCalled()

      unmount()

      expect(mockDisconnect).toHaveBeenCalled()
    })

    it('should not crash if element is null during cleanup', () => {
      const { result, unmount } = renderHook(() => useInView())

      act(() => {
        result.current.ref.current = null
      })

      expect(() => unmount()).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle threshold array', () => {
      const options = {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }

      const mockElement = document.createElement('div')

      renderHook(() => {
        const hook = useInView(options)
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      expect(utils.createIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '0px 0px -10% 0px',
      })
    })

    it('should handle custom rootMargin', () => {
      const options = {
        rootMargin: '50px 100px 75px 25px',
      }

      const mockElement = document.createElement('div')

      renderHook(() => {
        const hook = useInView(options)
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      expect(utils.createIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
        rootMargin: '50px 100px 75px 25px',
      })
    })

    it('should handle multiple intersection entries', () => {
      const mockElement = document.createElement('div')

      const { result } = renderHook(() => {
        const hook = useInView()
        React.useLayoutEffect(() => {
          hook.ref.current = mockElement
        }, [])
        return hook
      })

      const createMockEntry = (
        element: Element,
        isIntersecting: boolean,
      ): IntersectionObserverEntry => ({
        isIntersecting,
        target: element,
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        rootBounds: {} as DOMRectReadOnly,
        time: Date.now(),
      })

      // Simulate multiple entries (only one should match our element)
      const entries = [
        createMockEntry(document.createElement('div'), false),
        createMockEntry(mockElement, true),
        createMockEntry(document.createElement('div'), false),
      ]

      act(() => {
        if (globalObserverCallback) {
          globalObserverCallback(entries, {} as IntersectionObserver)
        }
      })

      expect(result.current.isInView).toBe(true)
    })
  })
})
