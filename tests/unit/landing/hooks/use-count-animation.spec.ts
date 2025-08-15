import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCountAnimation } from '~/features/landing/hooks/use-count-animation'

// Mock the utils
vi.mock('~/features/landing/utils', () => ({
  animateCount: vi.fn((start, end, duration, callback, _easingFunction) => {
    // Simulate animation by calling callback with intermediate values
    const steps = 10
    const increment = (end - start) / steps
    let current = start
    let stepCount = 0

    const interval = setInterval(() => {
      current += increment
      stepCount++

      if (stepCount >= steps) {
        callback(end)
        clearInterval(interval)
      } else {
        callback(Math.floor(current))
      }
    }, duration / steps)

    // Return cleanup function
    return () => clearInterval(interval)
  }),
  easing: {
    easeOut: vi.fn((t) => 1 - (1 - t) ** 3),
    easeIn: vi.fn((t) => t * t * t),
    easeInOut: vi.fn((t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)),
    linear: vi.fn((t) => t),
  },
}))

describe('useCountAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      expect(result.current.count).toBe(0)
      expect(result.current.isAnimating).toBe(false)
      expect(result.current.hasAnimated).toBe(false)
      expect(typeof result.current.startAnimation).toBe('function')
      expect(typeof result.current.resetAnimation).toBe('function')
    })

    it('should accept custom options', () => {
      const options = {
        duration: 3000,
        delay: 500,
        easing: 'easeIn',
      }

      const { result } = renderHook(() => useCountAnimation(100, options))

      expect(result.current.count).toBe(0)
      expect(result.current.isAnimating).toBe(false)
      expect(result.current.hasAnimated).toBe(false)
    })
  })

  describe('animation behavior', () => {
    it('should start animation when startAnimation is called', async () => {
      const { result } = renderHook(() => useCountAnimation(100, { duration: 1000 }))

      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)
      expect(result.current.hasAnimated).toBe(false)

      // Fast-forward animation
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Animation should complete
      expect(result.current.isAnimating).toBe(false)
      expect(result.current.hasAnimated).toBe(true)
      expect(result.current.count).toBe(100)
    })

    it('should handle delayed animation start', async () => {
      const { result } = renderHook(() => useCountAnimation(50, { duration: 1000, delay: 500 }))

      act(() => {
        result.current.startAnimation()
      })

      // Animation should not start immediately due to delay
      expect(result.current.isAnimating).toBe(true)
      expect(result.current.count).toBe(0)

      // Fast-forward to after delay
      act(() => {
        vi.advanceTimersByTime(500)
      })

      // Now animation should begin
      act(() => {
        vi.advanceTimersByTime(100)
      })

      expect(result.current.count).toBeGreaterThan(0)
    })

    it('should not start animation if already animated', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      // First animation
      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.hasAnimated).toBe(true)

      // Reset count to check if second call starts animation
      const countAfterFirstAnimation = result.current.count

      // Try to start animation again
      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Count should remain the same
      expect(result.current.count).toBe(countAfterFirstAnimation)
    })

    it('should not start animation if currently animating', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)

      // Try to start animation again while animating
      act(() => {
        result.current.startAnimation()
      })

      // Should still be the same animation
      expect(result.current.isAnimating).toBe(true)
    })
  })

  describe('reset functionality', () => {
    it('should reset animation state', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      // Start and complete animation
      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.hasAnimated).toBe(true)
      expect(result.current.count).toBe(100)

      // Reset animation
      act(() => {
        result.current.resetAnimation()
      })

      expect(result.current.count).toBe(0)
      expect(result.current.isAnimating).toBe(false)
      expect(result.current.hasAnimated).toBe(false)
    })

    it('should cleanup ongoing animation when reset', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)

      // Reset while animating
      act(() => {
        result.current.resetAnimation()
      })

      expect(result.current.count).toBe(0)
      expect(result.current.isAnimating).toBe(false)
      expect(result.current.hasAnimated).toBe(false)
    })

    it('should allow animation after reset', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      // Complete first animation
      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // Reset
      act(() => {
        result.current.resetAnimation()
      })

      // Start new animation
      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.hasAnimated).toBe(true)
      expect(result.current.count).toBe(100)
    })
  })

  describe('easing functions', () => {
    it('should use default easeOut easing', () => {
      const { result } = renderHook(() => useCountAnimation(100))

      act(() => {
        result.current.startAnimation()
      })

      // Animation should use easeOut by default
      expect(result.current.isAnimating).toBe(true)
    })

    it('should use custom easing function', () => {
      const { result } = renderHook(() => useCountAnimation(100, { easing: 'easeIn' }))

      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)
    })

    it('should fallback to easeOut for invalid easing', () => {
      const { result } = renderHook(() =>
        useCountAnimation(100, { easing: 'invalidEasing' as any }),
      )

      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle zero end value', () => {
      const { result } = renderHook(() => useCountAnimation(0))

      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.count).toBe(0)
      expect(result.current.hasAnimated).toBe(true)
    })

    it('should handle negative end value', () => {
      const { result } = renderHook(() => useCountAnimation(-50))

      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result.current.count).toBe(-50)
      expect(result.current.hasAnimated).toBe(true)
    })

    it('should handle very short duration', () => {
      const { result } = renderHook(() => useCountAnimation(100, { duration: 10 }))

      act(() => {
        result.current.startAnimation()
      })

      act(() => {
        vi.advanceTimersByTime(10)
      })

      expect(result.current.hasAnimated).toBe(true)
    })
  })

  describe('cleanup on unmount', () => {
    it('should cleanup timers and animations on unmount', () => {
      const { result, unmount } = renderHook(() => useCountAnimation(100))

      act(() => {
        result.current.startAnimation()
      })

      expect(result.current.isAnimating).toBe(true)

      // Unmount component
      unmount()

      // Advance timers to see if any errors occur
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      // Should not throw errors
    })
  })

  describe('multiple hooks', () => {
    it('should handle multiple independent animations', () => {
      const { result: result1 } = renderHook(() => useCountAnimation(100))
      const { result: result2 } = renderHook(() => useCountAnimation(200))

      act(() => {
        result1.current.startAnimation()
        result2.current.startAnimation()
      })

      expect(result1.current.isAnimating).toBe(true)
      expect(result2.current.isAnimating).toBe(true)

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(result1.current.count).toBe(100)
      expect(result2.current.count).toBe(200)
      expect(result1.current.hasAnimated).toBe(true)
      expect(result2.current.hasAnimated).toBe(true)
    })
  })
})
