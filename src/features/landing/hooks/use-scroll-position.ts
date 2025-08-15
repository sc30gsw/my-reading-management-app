import { useEffect, useRef, useState } from 'react'
import type { UseScrollPositionOptions } from '~/features/landing/types'
import { getElementScrollProgress, getScrollProgress, throttle } from '~/features/landing/utils'

/**
 * Hook to track scroll position with throttling for performance
 * Can track window scroll or specific element scroll progress
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const { threshold = 100, element = null } = options

  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [isScrolledPastThreshold, setIsScrolledPastThreshold] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScrollPosition = throttle(() => {
      const currentScrollY = window.pageYOffset
      const progress = element ? getElementScrollProgress(element) : getScrollProgress()

      const direction = currentScrollY > lastScrollY.current ? 'down' : 'up'

      setScrollY(currentScrollY)
      setScrollProgress(progress)
      setIsScrollingDown(currentScrollY > lastScrollY.current)
      setIsScrolledPastThreshold(currentScrollY > threshold)
      setScrollDirection(direction)

      lastScrollY.current = currentScrollY
    }, 16) // ~60fps

    // Initial call
    updateScrollPosition()

    window.addEventListener('scroll', updateScrollPosition, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollPosition)
    }
  }, [threshold, element])

  return {
    scrollY,
    scrollProgress,
    isScrollingDown,
    isScrolledPastThreshold,
    scrollDirection,
  }
}
