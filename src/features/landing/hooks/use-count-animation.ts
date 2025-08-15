import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseCountAnimationOptions } from '~/features/landing/types'
import { animateCount, easing } from '~/features/landing/utils'

/**
 * Hook for animating number counts with customizable easing and duration
 * Includes proper cleanup and performance optimizations
 */
export function useCountAnimation(end: number, options: UseCountAnimationOptions = {}) {
  const { duration = 2000, delay = 0, easing: easingType = 'easeOut' } = options

  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get easing function
  const easingFunction = easing[easingType as keyof typeof easing] || easing.easeOut

  const startAnimation = useCallback(() => {
    if (hasAnimated || isAnimating) return

    setIsAnimating(true)

    const startCount = () => {
      cleanupRef.current = animateCount(
        0,
        end,
        duration,
        (value) => setCount(value),
        easingFunction,
      )

      // Mark animation as complete after duration
      setTimeout(() => {
        setIsAnimating(false)
        setHasAnimated(true)
        setCount(end) // Ensure final value is exact
      }, duration)
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(startCount, delay)
    } else {
      startCount()
    }
  }, [end, duration, delay, easingFunction, hasAnimated, isAnimating])

  const resetAnimation = useCallback(() => {
    // Cleanup current animation
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    // Reset state
    setCount(0)
    setIsAnimating(false)
    setHasAnimated(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    count,
    isAnimating,
    hasAnimated,
    startAnimation,
    resetAnimation,
  }
}
