'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { type ComponentType, useEffect, useRef, useState } from 'react'

// Loading skeleton component
const LoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="mb-4 h-32 rounded-lg bg-slate-200"></div>
    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded bg-slate-200"></div>
      <div className="h-4 w-1/2 rounded bg-slate-200"></div>
    </div>
  </div>
)

// Enhanced loading component with motion
const MotionLoadingSkeleton = ({ className = '' }: { className?: string }) => (
  <motion.div
    className={`${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <LoadingSkeleton className={className} />
  </motion.div>
)

// Lazy-loaded components with optimized loading states
export const LazyFAQSection = dynamic(
  () => import('./faq-section').then((mod) => ({ default: mod.FAQSection })),
  {
    loading: () => <MotionLoadingSkeleton className="min-h-[400px]" />,
    ssr: true, // Enable SSR for better SEO
  },
)

export const LazySocialProofSection = dynamic(
  () => import('./social-proof-section').then((mod) => ({ default: mod.SocialProofSection })),
  {
    loading: () => <MotionLoadingSkeleton className="min-h-[500px]" />,
    ssr: true,
  },
)

export const LazyPricingSection = dynamic(
  () => import('./pricing-section').then((mod) => ({ default: mod.PricingSection })),
  {
    loading: () => <MotionLoadingSkeleton className="min-h-[600px]" />,
    ssr: true,
  },
)

export const LazyValuePropositionSection = dynamic(
  () =>
    import('./value-proposition-section').then((mod) => ({ default: mod.ValuePropositionSection })),
  {
    loading: () => <MotionLoadingSkeleton className="min-h-[500px]" />,
    ssr: true,
  },
)

// Navigation can be loaded immediately as it's above the fold
export const LazyNavigation = dynamic(
  () => import('./navigation').then((mod) => ({ default: mod.Navigation })),
  {
    loading: () => (
      <div className="fixed top-0 right-0 left-0 z-40 h-20 border-slate-200/20 border-b bg-white/95 shadow-lg backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton className="h-8 w-32" />
          <LoadingSkeleton className="h-8 w-24" />
        </div>
      </div>
    ),
    ssr: false, // Navigation might have client-specific features
  },
)

// Footer is often below the fold, so it's a good candidate for lazy loading
export const LazyFooter = dynamic(
  () => import('./footer').then((mod) => ({ default: mod.Footer })),
  {
    loading: () => <MotionLoadingSkeleton className="min-h-[400px] bg-slate-900" />,
    ssr: true,
  },
)

// Higher-order component for adding lazy loading to any component
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  _loadingComponent?: ComponentType,
  options?: {
    ssr?: boolean
    preload?: boolean
  },
) {
  const { ssr = true } = options || {}

  return dynamic(() => Promise.resolve(Component), {
    loading: () => <LoadingSkeleton className="animate-pulse" />,
    ssr,
  })
}

// Intersection Observer-based lazy loading for below-the-fold content
export function LazyIntersectionWrapper({
  children,
  fallback = <LoadingSkeleton className="min-h-[300px]" />,
  rootMargin = '100px',
  threshold = 0.1,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
  threshold?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin, threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return <div ref={ref}>{isVisible ? children : fallback}</div>
}

// Performance monitoring component
export function PerformanceMonitor({
  children,
  sectionName,
}: {
  children: React.ReactNode
  sectionName: string
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.includes(sectionName)) {
            console.log(`${sectionName} render time:`, entry.duration)
          }
        }
      })

      observer.observe({ entryTypes: ['measure'] })

      // Mark the start of this section's render
      performance.mark(`${sectionName}-start`)

      return () => {
        // Mark the end and measure
        performance.mark(`${sectionName}-end`)
        performance.measure(`${sectionName}-render`, `${sectionName}-start`, `${sectionName}-end`)
        observer.disconnect()
      }
    }
  }, [sectionName])

  return <>{children}</>
}
