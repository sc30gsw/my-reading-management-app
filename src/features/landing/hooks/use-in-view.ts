import { useEffect, useRef, useState } from 'react'
import type { UseInViewOptions } from '~/features/landing/types'
import { createIntersectionObserver } from '~/features/landing/utils'

/**
 * Hook to detect when an element is in view using Intersection Observer
 * Optimized for performance with proper cleanup and memoization
 */
export function useInView<T extends Element = HTMLDivElement>(options: UseInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px 0px -10% 0px', triggerOnce = true } = options

  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const elementRef = useRef<T>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // If triggerOnce is true and element has already been in view, don't observe
    if (triggerOnce && hasBeenInView) return

    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        const inView = entry.isIntersecting
        setIsInView(inView)

        if (inView && !hasBeenInView) {
          setHasBeenInView(true)
        }

        // If triggerOnce is true and element is now in view, stop observing
        if (triggerOnce && inView && observerRef.current) {
          observerRef.current.unobserve(element)
        }
      })
    }

    observerRef.current = createIntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    if (observerRef.current) {
      observerRef.current.observe(element)
    }

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasBeenInView])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return {
    ref: elementRef,
    isInView: triggerOnce ? hasBeenInView : isInView,
    hasBeenInView,
  }
}
